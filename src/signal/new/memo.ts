import { osignal_new_memo } from "#src/osignal/new/memo.js";
import type { Signal } from "#src/signal/type/Signal.js";

type Comparator<T> = {
    (a: T, b: T): boolean
}

export const signal_new_memo = function <I, O>(src: Signal<I, O>, eq: Comparator<O> | null = null): Signal<I, O> {
    const osignal = osignal_new_memo(src, eq)

    return {
        ...osignal,

        input: src.input.bind(src),
    }
}
