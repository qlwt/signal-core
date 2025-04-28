import { osignal_new_pipe } from "#src/osignal/new/pipe.js";
import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { SignalFallback_Filter } from "#src/type/signal/fallback/Filter.js";

type Src<T> = OSignal<T | SignalFallback_Filter>
type Fallback<F> = (value: SignalFallback_Filter) => F

export const osignal_new_fallback = function <T, F>(src: Src<T>, fallback: Fallback<F>): OSignal<T | F> {
    return osignal_new_pipe(src, src_o => {
        if (src_o === undefined || src_o === null) {
            return fallback(src_o as SignalFallback_Filter)
        }

        return src_o
    })
}
