import { Aes256Gcm } from "../encryption/aes256"

describe("Aes256Gcm Encryption Engine", () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it("should successfully encrypt and decrypt values using AES-256-GCM", () => {
    process.env.VAULT_MASTER_KEY = "super-secret-master-encryption-key-phrase"
    const secretText = "meta-oauth-client-secret-123456"

    const encrypted = Aes256Gcm.encrypt(secretText)
    expect(encrypted.ciphertext).toBeDefined()
    expect(encrypted.iv).toBeDefined()
    expect(encrypted.authTag).toBeDefined()

    const decrypted = Aes256Gcm.decrypt(encrypted)
    expect(decrypted).toBe(secretText)
  })

  it("should fail decryption if master key changes", () => {
    process.env.VAULT_MASTER_KEY = "key-version-1"
    const encrypted = Aes256Gcm.encrypt("sensitive-content")

    // Switch key
    process.env.VAULT_MASTER_KEY = "key-version-2"
    expect(() => Aes256Gcm.decrypt(encrypted)).toThrow()
  })
})
