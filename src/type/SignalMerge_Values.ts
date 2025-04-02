import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { Signal } from "#src/signal/type/Signal.js";
import type { Signal_InferI, Signal_InferO } from "#src/type/Signal_ValueInfer.js";

export type SignalMerge_OValue<Src extends readonly OSignal<any>[]> = {
    -readonly [K in keyof Src]: Signal_InferO<Src[K]>
}

export type SignalMerge_IValue<Src extends readonly Signal<any, any>[]> = {
    -readonly [K in keyof Src]: Signal_InferI<Src[K]>
}
