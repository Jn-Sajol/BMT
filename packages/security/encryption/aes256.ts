import * as crypto from "crypto"

export interface EncryptedData {
  ciphertext: string
  iv: string
  authTag: string
}

export class Aes256Gcm {
  private static ALGORITHM = "aes-256-gcm"

  private static getMasterKey(): Buffer {
    const key = process.env.VAULT_MASTER_KEY || "default-secret-key-32-bytes-length"
    // Use sha256 to guarantee 32-byte key length
    return crypto.createHash("sha256").update(key).digest()
  }

  public static encrypt(plaintext: string): EncryptedData {
    const iv = crypto.randomBytes(12)
    const key = Aes256Gcm.getMasterKey()
    const cipher = crypto.createCipheriv(Aes256Gcm.ALGORITHM, key, iv) as crypto.CipherGCM

    let ciphertext = cipher.update(plaintext, "utf8", "hex")
    ciphertext += cipher.final("hex")
    
    const authTag = cipher.getAuthTag().toString("hex")

    return {
      ciphertext,
      iv: iv.toString("hex"),
      authTag,
    }
  }

  public static decrypt(encrypted: EncryptedData): string {
    const key = Aes256Gcm.getMasterKey()
    const iv = Buffer.from(encrypted.iv, "hex")
    const authTag = Buffer.from(encrypted.authTag, "hex")

    const decipher = crypto.createDecipheriv(Aes256Gcm.ALGORITHM, key, iv) as crypto.DecipherGCM
    decipher.setAuthTag(authTag)

    let plaintext = decipher.update(encrypted.ciphertext, "hex", "utf8")
    plaintext += decipher.final("utf8")

    return plaintext
  }
}
