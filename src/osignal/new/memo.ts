import { batcher } from "#src/const/batcher.js";
import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { Signal_Sub } from "#src/type/signal/Sub.js";

type Cache<T> = {
    id: Symbol
    batcher_id: Symbol
    id_lastcheck: Symbol
    output: { value: T } | null
}

type Comparator<T> = {
    (a: T, b: T): boolean
}

export const osignal_new_memo = <T>(src: OSignal<T>, eq: Comparator<T> | null = Object.is): OSignal<T> => {
    let cache: Cache<T> | null = null

    const cache_get = function(): Cache<T> {
        const batcher_id = batcher.id()

        if (cache) {
            if (batcher_id !== cache.batcher_id) {
                const src_id = src.id()

                if (cache.id_lastcheck !== src_id) {

                    if (eq) {
                        const src_output = src.output()

                        if (cache.output && eq(src_output, cache.output.value)) {
                            cache.id_lastcheck = src_id
                        } else {
                            cache = {
                                batcher_id,
                                id: src_id,
                                id_lastcheck: src_id,
                                output: { value: src_output },
                            }
                        }
                    } else {
                        cache = {
                            batcher_id,
                            id: src_id,
                            output: null,
                            id_lastcheck: src_id,
                        }
                    }
                }
            }
        } else {
            const src_id = src.id()

            if (eq) {
                cache = {
                    batcher_id,
                    id: src_id,
                    id_lastcheck: src_id,
                    output: { value: src.output() },
                }
            } else {
                cache = {
                    batcher_id,
                    id: src_id,
                    output: null,
                    id_lastcheck: src_id,
                }
            }
        }

        return cache
    }

    const emitmap = new WeakMap<Signal_Sub, Symbol>()

    return {
        rmsub: src.rmsub.bind(src),

        addsub: (sub, config) => {
            src.addsub(sub, {
                ...config,

                blocked_new: () => {
                    const emitid = emitmap.get(sub)
                    const cache_l = cache_get()

                    if (emitid !== cache_l.id) {
                        emitmap.set(sub, cache_l.id)

                        return config?.blocked_new?.() ?? false
                    }

                    return true
                }
            })
        },

        id: () => {
            return cache_get().id
        },

        output() {
            const cache_l = cache_get()

            if (cache_l.output === null) {
                cache_l.output = { value: src.output() }
            }

            return cache_l.output.value
        },
    }
}
