export type SignalDebug_EState = {
    readonly time: Date
    readonly attached: boolean
}

export type SignalDebug_OState<O> = Readonly<{
    readonly output: O
    readonly time: Date
    readonly attached: boolean
}>

export type SignalDebug_State<I, O> = {
    readonly input?: I

    readonly output: O
    readonly time: Date
    readonly attached: boolean
}
