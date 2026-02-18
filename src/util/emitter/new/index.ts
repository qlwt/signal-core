import { signal_sub_emit } from "#src/signal/sub/emit.js";
import type { Signal_Sub, Signal_SubConfig, Signal_SubConfig_Order } from "#src/type/signal/Sub.js";

export type Emitter_SubIdx = Map<Signal_Sub, number | false>
export type Emitter_SubMap = Map<Signal_Sub, Signal_SubConfig>
export type Emitter_OrderMap = Map<number | false, Emitter_SubMap>

export type Emitter = {
    readonly emit_all: () => void
    readonly emit: (order: Signal_SubConfig_Order) => void

    readonly subidx: () => Emitter_SubIdx
    readonly ordermap: () => Emitter_OrderMap

    readonly rmsub: (sub: Signal_Sub) => Signal_SubConfig_Order | null
    readonly addsub: (sub: Signal_Sub, config?: Signal_SubConfig) => Signal_SubConfig_Order | null
}

export const emitter_new = function(): Emitter {
    const subidx = new Map<Signal_Sub, number | false>()
    const ordermap = new Map<number | false, Map<Signal_Sub, Signal_SubConfig>>()

    return {
        subidx: () => {
            return subidx
        },

        ordermap: () => {
            return ordermap
        },

        rmsub: sub => {
            const idx = subidx.get(sub)

            subidx.delete(sub)

            if (idx !== undefined) {
                const reg = ordermap.get(idx)!

                reg.delete(sub)

                if (reg.size === 0) {
                    ordermap.delete(idx)

                    return idx
                }
            }

            return null
        },

        addsub: (sub, config = {}) => {
            const order = config.order ?? 0

            {
                const idx = subidx.get(sub)

                if (idx !== undefined) {
                    const submap = ordermap.get(idx)!

                    submap.delete(sub)

                    if (submap.size === 0) {
                        ordermap.delete(idx)
                    }
                }
            }

            {
                subidx.set(sub, order)

                let reg = ordermap.get(order)

                if (reg) {
                    reg.set(sub, config)
                } else {
                    reg = new Map()

                    ordermap.set(order, reg)

                    reg.set(sub, config)

                    return order
                }
            }

            return null
        },

        emit: order => {
            const submap = ordermap.get(order)

            if (submap) {
                for (const [sub, config] of submap) {
                    signal_sub_emit(sub, config)
                }
            }
        },

        emit_all: () => {
            for (const submap of ordermap.values()) {
                for (const [sub, config] of submap) {
                    signal_sub_emit(sub, config)
                }
            }
        },
    }
}
