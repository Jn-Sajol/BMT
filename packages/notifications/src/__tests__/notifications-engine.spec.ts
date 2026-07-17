import { ChannelRegistry } from "../core/channel-registry"
import { InAppChannel } from "../channels/in-app.channel"

describe("Notifications Engine Channel Registry", () => {
  beforeEach(() => {
    ChannelRegistry.clear()
    ChannelRegistry.register("in-app", new InAppChannel())
  })

  it("should register and resolve notification channels dynamically", () => {
    const channel = ChannelRegistry.resolve("in-app")
    expect(channel).toBeDefined()
    expect(channel).toBeInstanceOf(InAppChannel)
  })

  it("should throw error if attempting to resolve unregistered channels", () => {
    expect(() => {
      ChannelRegistry.resolve("whatsapp")
    }).toThrow()
  })
})
