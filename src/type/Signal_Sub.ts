export type Signal_Sub = {
    (): void
}

export type Signal_SubConfig = {
    /** ignore batch */
    readonly instant?: boolean
}
