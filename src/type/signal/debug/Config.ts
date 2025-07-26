export type SignalDebug_EConfig = Readonly<{
    name: string

    print?: Readonly<{
        state?: boolean
        actions_fallback?: boolean

        actions?: Readonly<{
            emit?: boolean
            rmsub?: boolean
            addsub?: boolean
            attach?: boolean
            detach?: boolean
        }>
    }>
}>

export type SignalDebug_OConfig = Readonly<{
    name: string

    print?: Readonly<{
        state?: boolean
        actions_fallback?: boolean

        actions?: Readonly<{
            emit?: boolean
            rmsub?: boolean
            addsub?: boolean
            attach?: boolean
            detach?: boolean
            output?: boolean
        }>
    }>
}>

export type SignalDebug_Config = Readonly<{
    name: string

    print?: Readonly<{
        state?: boolean
        actions_fallback?: boolean

        actions?: Readonly<{
            emit?: boolean
            rmsub?: boolean
            addsub?: boolean
            attach?: boolean
            detach?: boolean
            input?: boolean
            output?: boolean
        }>
    }>
}>
