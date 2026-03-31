import { osignal_new_pipe } from "#src/osignal/new/pipe.js"
import type { OSignal } from "#src/osignal/type/OSignal.js"
import type { PickWrapper_Fail, PickWrapper_Success, PickWrapper_Success_Infer } from "#src/type/PickWrapper.js"
import type { SignalListPipe_Output, SignalListPipe_RawItem } from "#src/type/signal/listpipe/Values.js"

type Src_Generic = OSignal<(
    | null
    | undefined
    | Iterable<any>
)>

export const osignal_new_listpipe_pick = function <Src extends Src_Generic, R extends PickWrapper_Success | PickWrapper_Fail>(
    src: Src, mapper: (input: SignalListPipe_RawItem<Src>) => R
): OSignal<SignalListPipe_Output<Src, PickWrapper_Success_Infer<R>>> {
    const cache = new Map<SignalListPipe_RawItem<Src>, R>()

    return osignal_new_pipe(src, src_o => {
        if (src_o === undefined || src_o === null) {
            return src_o as any
        }

        {
            // for faster lookups in big array cases
            const src_o_set = new Set(src_o)

            for (const key of cache.keys()) {
                if (!src_o_set.has(key)) {
                    cache.delete(key)
                }
            }
        }

        const results = new Array<R>()

        for (const item of src_o) {
            if (cache.has(item)) {
                const result = cache.get(item)!

                results.push(result)
            } else {
                const result = mapper(item)

                if (result.pick) {
                    cache.set(item, result.value)

                    results.push(result.value)
                }
            }
        }

        return results
    })
}
