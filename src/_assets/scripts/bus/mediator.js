class Mediator {
  channels = {}

  subscribe(channel, listener) {
    this.channels[channel] = this.channels[channel] ?? []
    this.channels[channel].push(listener)
  }

  publish(channel, ...args) {
    const chan = this.channels[channel]
    if(chan) {
      chan.forEach(fun => fun(...args))
    }
  }
}

export const mediator = new Mediator()
