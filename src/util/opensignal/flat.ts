import { batcher } from "#src/const/batcher.js";
import type { ESignal } from "#src/esignal/type/ESignal.js";
import type { OSignal } from "#src/osignal/type/OSignal.js";
import { signal_sub_emit } from "#src/signal/sub/emit.js";
import type { PickWrapperExpected } from "#src/type/PickWrapper.js";
import type { Signal_InferO } from "#src/type/signal/Infer.js";
import type { Signal_Sub, Signal_SubConfig } from "#src/type/signal/Sub.js";
import { attachment_new_lazy } from "#src/util/attachment/new/lazy.js";

type Src_Generic = OSignal<PickWrapperExpected<ESignal>>

export type OpenSignalFlat<Src extends Src_Generic> = {
    identity(): Symbol
    target(): Signal_InferO<Src>
    rmsub(sub: Signal_Sub): void
    addsub(sub: Signal_Sub, config?: Signal_SubConfig): void
}

type Cache<Src extends Src_Generic> = {
    src_id: Symbol
    batcher_id: Symbol
    target: Signal_InferO<Src>
}

export const opensignal_flat = function <Src extends Src_Generic>(src: Src): OpenSignalFlat<Src> {
    let cache: Cache<Src> | null = null

    const cache_get = () => {
        const batcher_id = batcher.id()

        if (cache) {
            if (batcher_id !== cache.batcher_id) {
                const src_id = src.id()
                const src_output = src.output() as Signal_InferO<Src>

                if (cache.src_id !== src_id) {
                    cache = {
                        src_id,
                        batcher_id,
                        target: src_output,
                    }
                }
            }
        } else {
            const src_id = src.id()
            const src_output = src.output() as Signal_InferO<Src>

            cache = {
                src_id,
                batcher_id,
                target: src_output,
            }
        }

        return cache
    }

    const attachment = attachment_new_lazy({
        connection_new: order => {
            let target_last: Signal_InferO<Src> | null = null

            const emit = () => {
                attachment.emit(order)
            }

            const src_sub: Signal_Sub = () => {
                const cache_l = cache_get()
                const cache_now = cache_l.target

                const last = target_last

                {
                    target_last = cache_now
                }

                if (last && last.pick) {
                    last.value.rmsub(emit)
                }

                if (cache_now.pick) {
                    cache_now.value.addsub(emit, { order })
                }

                signal_sub_emit(emit, { order: false })
            }

            return {
                attach: () => {
                    const cache_l = cache_get()
                    const cache_now = cache_l.target

                    {
                        target_last = cache_now
                    }

                    src.addsub(src_sub, { order })

                    if (cache_now.pick) {
                        cache_now.value.addsub(emit, { order })
                    }
                },

                detach: () => {
                    src.rmsub(src_sub)

                    if (target_last && target_last.pick) {
                        target_last.value.rmsub(emit)
                    }
                },
            }
        },
    })

    return {
        rmsub: attachment.rmsub,
        addsub: attachment.addsub,

        identity: () => {
            const cache = cache_get()

            if (cache.target.pick) {
                return cache.target.value.id()
            }

            return cache.src_id
        },

        target() {
            return cache_get().target
        },
    }
}
