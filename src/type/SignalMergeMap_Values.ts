import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { Signal } from "#src/signal/type/Signal.js";
import type { Signal_InferI, Signal_InferO } from "#src/type/Signal_ValueInfer.js";

export type SignalMergeMap_OValue<Src extends { readonly [K in keyof any]: OSignal<any> }> = {
    -readonly [K in keyof Src]: Signal_InferO<Src[K]>
}

export type SignalMergeMap_IValue<Src extends { readonly [K in keyof any]: Signal<any, any> }> = {
    -readonly [K in keyof Src]: Signal_InferI<Src[K]>
}
