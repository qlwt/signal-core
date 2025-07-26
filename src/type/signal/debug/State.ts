export type SignalDebug_EState = Readonly<{
    time: Date
    attached: boolean
}>

export type SignalDebug_OState<O> = Readonly<{
    output: O
    time: Date
    attached: boolean
}>

export type SignalDebug_State<I, O> = Readonly<{
    input?: I

    output: O
    time: Date
    attached: boolean
}>
