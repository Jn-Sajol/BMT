import { Injectable } from "@nestjs/common"
import { DistributedLock } from "../domain/automation-core.model"

@Injectable()
export class RedisLockManager {
  private locks = new Map<string, DistributedLock>()

  public async acquireLock(key: string, ownerId: string, durationMs: number): Promise<boolean> {
    const now = new Date()
    const existing = this.locks.get(key)

    if (existing && existing.expiresAt > now) {
      console.log(`[RedisLockManager] Lock key "${key}" is already held by "${existing.ownerId}"`)
      return false
    }

    const expiresAt = new Date(Date.now() + durationMs)
    this.locks.set(key, { key, ownerId, expiresAt })
    console.log(`[RedisLockManager] Lock key "${key}" successfully acquired by "${ownerId}" until ${expiresAt.toISOString()}`)
    return true
  }

  public async releaseLock(key: string, ownerId: string): Promise<boolean> {
    const existing = this.locks.get(key)
    if (!existing) return false

    if (existing.ownerId === ownerId) {
      this.locks.delete(key)
      console.log(`[RedisLockManager] Lock key "${key}" released by "${ownerId}"`)
      return true
    }

    return false
  }
}
