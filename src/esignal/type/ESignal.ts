import type { Signal_Sub, Signal_SubConfig } from "#src/type/signal/Sub.js"

export interface ESignal {
    readonly rmsub: (sub: Signal_Sub) => void
    readonly addsub: (sub: Signal_Sub, config?: Signal_SubConfig) => void
}
