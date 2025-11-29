export type SignalDebug_EConfig = {
    readonly name: string

    readonly print?: {
        readonly state?: boolean
        readonly actions_fallback?: boolean

        readonly actions?: {
            readonly emit?: boolean
            readonly rmsub?: boolean
            readonly addsub?: boolean
            readonly attach?: boolean
            readonly detach?: boolean
        }
    }
}

export type SignalDebug_OConfig = Readonly<{
    readonly name: string

    readonly print?: Readonly<{
        readonly state?: boolean
        readonly actions_fallback?: boolean

        readonly actions?: Readonly<{
            readonly emit?: boolean
            readonly rmsub?: boolean
            readonly addsub?: boolean
            readonly attach?: boolean
            readonly detach?: boolean
            readonly output?: boolean
        }>
    }>
}>

export type SignalDebug_Config = Readonly<{
    readonly name: string

    readonly print?: Readonly<{
        readonly state?: boolean
        readonly actions_fallback?: boolean

        readonly actions?: Readonly<{
            readonly emit?: boolean
            readonly rmsub?: boolean
            readonly addsub?: boolean
            readonly attach?: boolean
            readonly detach?: boolean
            readonly input?: boolean
            readonly output?: boolean
        }>
    }>
}>
