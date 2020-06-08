const channels = {}

function subscribe(channel, listener) {
  channels[channel] = channels[channel] ?? []
  channels[channel].push(listener)
}

function publish(channel, ...args) {
  const chan = channels[channel]
  if(chan) {
    chan.forEach(fun => fun(...args))
  }
}

export const mediator = {
  subscribe,
  publish,
}
