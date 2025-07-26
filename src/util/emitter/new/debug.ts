import { signal_sub_emit } from "#src/signal/sub/emit.js";
import type { Signal_Sub, Signal_SubConfig } from "#src/type/signal/Sub.js";

export type EmitterDebug = {
    readonly emit: () => void
    readonly submap: () => Map<Signal_Sub, Signal_SubConfig>

    readonly rmsub: (sub: Signal_Sub) => void
    readonly addsub: (sub: Signal_Sub, config?: Signal_SubConfig) => void

    readonly debug_submap_get: () => Map<Signal_Sub, Signal_SubConfig>
}

export const emitter_new_debug = function(): EmitterDebug {
    const submap = new Map<Signal_Sub, Signal_SubConfig>()

    return {
        submap: () => {
            return submap
        },

        rmsub: sub => {
            submap.delete(sub)
        },

        addsub: (sub, config = {}) => {
            submap.set(sub, config)
        },

        emit: () => {
            submap.forEach((config, sub) => {
                signal_sub_emit(sub, config)
            })
        },

        debug_submap_get: () => submap
    }
}
