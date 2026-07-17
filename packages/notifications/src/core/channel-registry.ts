import { INotificationChannel } from "./notification.interface"

export class ChannelRegistry {
  private static registry = new Map<string, INotificationChannel>()

  public static register(channelName: string, channel: INotificationChannel): void {
    ChannelRegistry.registry.set(channelName.toLowerCase(), channel)
  }

  public static resolve(channelName: string): INotificationChannel {
    const channel = ChannelRegistry.registry.get(channelName.toLowerCase())
    if (!channel) {
      throw new Error(`Notification Channel ${channelName} is not registered.`)
    }
    return channel
  }

  public static clear(): void {
    ChannelRegistry.registry.clear()
  }
}
