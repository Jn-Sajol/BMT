/**
 * BMT Facebook Token Manager
 * Handles Long-Lived Token exchange (60 days) and auto-refresh.
 * 
 * Flow:
 * 1. Short-lived token (1 hour) → Exchange → Long-lived token (60 days)
 * 2. Token expiry tracked in localStorage
 * 3. Auto-refresh when token has < 7 days remaining
 * 
 * Production Note: In production, move token exchange to backend API route
 * to avoid exposing App Secret in client-side code.
 */

const GRAPH_API_VERSION = "v26.0"
const GRAPH_API_BASE = `https://graph.facebook.com/${GRAPH_API_VERSION}`

interface TokenInfo {
  accessToken: string
  expiresAt: number  // Unix timestamp (ms)
  isLongLived: boolean
  pageId: string
  pageName: string
}

const STORAGE_KEY = "bmt_fb_tokens"

// Get all stored tokens
export function getStoredTokens(): Record<string, TokenInfo> {
  if (typeof window === "undefined") return {}
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

// Save token for a specific page
export function saveToken(pageId: string, tokenInfo: TokenInfo): void {
  if (typeof window === "undefined") return
  const tokens = getStoredTokens()
  tokens[pageId] = tokenInfo
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
}

// Get token for a specific page
export function getTokenForPage(pageId: string): TokenInfo | null {
  const tokens = getStoredTokens()
  return tokens[pageId] || null
}

// Remove token for a specific page
export function removeToken(pageId: string): void {
  if (typeof window === "undefined") return
  const tokens = getStoredTokens()
  delete tokens[pageId]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
}

// Check if token is expired or about to expire (< 7 days)
export function isTokenExpiringSoon(tokenInfo: TokenInfo): boolean {
  const now = Date.now()
  const sevenDays = 7 * 24 * 60 * 60 * 1000
  return tokenInfo.expiresAt - now < sevenDays
}

export function isTokenExpired(tokenInfo: TokenInfo): boolean {
  return Date.now() >= tokenInfo.expiresAt
}

// Exchange short-lived token for long-lived token (60 days)
export async function exchangeForLongLivedToken(
  shortLivedToken: string,
  appId: string,
  appSecret: string
): Promise<{ accessToken: string; expiresIn: number } | null> {
  try {
    const url = `${GRAPH_API_BASE}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`
    
    const response = await fetch(url)
    const data = await response.json()

    if (data.access_token) {
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in || 60 * 24 * 60 * 60, // Default 60 days
      }
    } else {
      console.error("[BMT TokenManager] Long-lived exchange failed:", data.error?.message)
      return null
    }
  } catch (err) {
    console.error("[BMT TokenManager] Exchange network error:", err)
    return null
  }
}

// Auto-refresh: Exchange and update stored token
export async function autoRefreshTokenIfNeeded(
  pageId: string,
  appId: string,
  appSecret: string
): Promise<string | null> {
  const tokenInfo = getTokenForPage(pageId)
  if (!tokenInfo) return null

  // If not expiring soon, return current token
  if (!isTokenExpiringSoon(tokenInfo)) {
    return tokenInfo.accessToken
  }

  // If already expired, can't refresh
  if (isTokenExpired(tokenInfo)) {
    console.warn("[BMT TokenManager] Token expired for page:", tokenInfo.pageName)
    return null
  }

  // Exchange for new long-lived token
  const result = await exchangeForLongLivedToken(tokenInfo.accessToken, appId, appSecret)
  if (result) {
    const updatedToken: TokenInfo = {
      ...tokenInfo,
      accessToken: result.accessToken,
      expiresAt: Date.now() + result.expiresIn * 1000,
      isLongLived: true,
    }
    saveToken(pageId, updatedToken)
    console.log("[BMT TokenManager] Token refreshed for:", tokenInfo.pageName)
    return result.accessToken
  }

  return tokenInfo.accessToken // Return existing if refresh fails
}

// Initialize token from env (first-time setup)
export async function initializeTokenFromEnv(
  pageId: string,
  pageName: string,
  envToken: string,
  appId: string,
  appSecret: string
): Promise<string> {
  const existing = getTokenForPage(pageId)
  
  // If we have a valid stored long-lived token, use it
  if (existing && existing.isLongLived && !isTokenExpired(existing)) {
    // Auto-refresh if needed
    const refreshed = await autoRefreshTokenIfNeeded(pageId, appId, appSecret)
    return refreshed || existing.accessToken
  }

  // Exchange env token for long-lived token
  const result = await exchangeForLongLivedToken(envToken, appId, appSecret)
  
  if (result) {
    const tokenInfo: TokenInfo = {
      accessToken: result.accessToken,
      expiresAt: Date.now() + result.expiresIn * 1000,
      isLongLived: true,
      pageId,
      pageName,
    }
    saveToken(pageId, tokenInfo)
    return result.accessToken
  }

  // Fallback to env token if exchange fails
  const fallbackInfo: TokenInfo = {
    accessToken: envToken,
    expiresAt: Date.now() + 3600 * 1000, // 1 hour assumption
    isLongLived: false,
    pageId,
    pageName,
  }
  saveToken(pageId, fallbackInfo)
  return envToken
}
