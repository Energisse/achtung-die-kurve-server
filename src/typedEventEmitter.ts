import EventEmitter from "node:events";

export default class TypedEventEmitter<TEvents extends Record<string, Array<any>>> {
    private emitter = new EventEmitter()
  
    public emit<TEventName extends keyof TEvents & string>(
      eventName: TEventName,
      ...eventArg: TEvents[TEventName]
    ) {
      return this.emitter.emit(eventName, ...eventArg)
    }
  
    public on<TEventName extends keyof TEvents & string>(
      eventName: TEventName,
      handler: (...eventArg: TEvents[TEventName]) => void
    ) {
      return this.emitter.on(eventName, handler as any)
    }

    public once<TEventName extends keyof TEvents & string>(
      eventName: TEventName,
      handler: (...eventArg: TEvents[TEventName]) => void
    ) {
      return this.emitter.once(eventName, handler as any)
    }
  
    public off<TEventName extends keyof TEvents & string>(
      eventName: TEventName,
      handler: (...eventArg: TEvents[TEventName]) => void
    ) {
      return this.emitter.off(eventName, handler as any)
    }
  }
  