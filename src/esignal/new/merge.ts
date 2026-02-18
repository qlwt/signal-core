import type { ESignal } from "#src/esignal/type/ESignal.js";

type Cache = {
    id: Symbol
    src_ids: Symbol[]
}

export const esignal_new_merge = (src: readonly ESignal[]): ESignal => {
    let cache: Cache | null = null

    const cache_get = (): Cache => {
        if (cache) {
            let now_ids = new Array<Symbol>(src.length)

            for (let i = 0; i < src.length; ++i) {
                const src_id = src[i]!.id()

                now_ids[i] = src_id

                if (src_id !== cache.src_ids[i]!) {
                    for (let j = i + 1; j < src.length; ++j) {
                        now_ids[j] = src[j]!.id()
                    }

                    cache = {
                        id: Symbol(),
                        src_ids: now_ids,
                    }
                }
            }
        } else {
            cache = {
                id: Symbol(),
                src_ids: src.map(src_node => src_node.id()),
            }
        }

        return cache
    }

    return {
        id: () => {
            return cache_get().id
        },

        addsub(sub, config) {
            for (const src_node of src) {
                src_node.addsub(sub, config)
            }
        },

        rmsub(sub) {
            for (const src_node of src) {
                src_node.rmsub(sub)
            }
        }
    }
}
