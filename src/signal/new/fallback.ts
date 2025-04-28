import { osignal_new_fallback } from "#src/osignal/new/fallback.js";
import type { Signal } from "#src/signal/type/Signal.js";
import type { SignalFallback_Filter } from "#src/type/signal/fallback/Filter.js";

type Src<I, O> = Signal<I, O | SignalFallback_Filter>
type Fallback<F> = (value: SignalFallback_Filter) => F

export const signal_new_fallback = function <I, O, F>(src: Src<I, O>, fallback: Fallback<F>): Signal<I, O | F> {
    const osignal = osignal_new_fallback(src, fallback)

    return {
        ...osignal,

        input: message => {
            src.input(message)
        }
    }
}
