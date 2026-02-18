export type Signal_Sub = {
    (): void
}

export type Signal_SubConfig_Order = (
    | number
    | false
)

export type Signal_SubConfig = {
    readonly blocked_new?: () => boolean
    readonly order?: Signal_SubConfig_Order
}
