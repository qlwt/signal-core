import type { Signal_SubConfig_Order } from "#src/type/signal/Sub.js"

export type SignalDebug_EState = {
    readonly time: Date
    readonly attachments: Signal_SubConfig_Order[]
}

export type SignalDebug_OState<O> = Readonly<{
    readonly output: O
    readonly time: Date
    readonly attachments: Signal_SubConfig_Order[]
}>

export type SignalDebug_State<I, O> = {
    readonly input?: I

    readonly output: O
    readonly time: Date
    readonly attachments: Signal_SubConfig_Order[]
}
