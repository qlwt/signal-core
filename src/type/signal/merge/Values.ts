import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { Signal } from "#src/signal/type/Signal.js";

type SrcOValue_Generic = readonly (OSignal | undefined | null)[]

type InferO<Src> = Src extends OSignal<infer O> ? O : Src

export type SignalMerge_OValue<Src extends SrcOValue_Generic> = {
    -readonly [K in keyof Src]: InferO<Src[K]>
}

type SrcIValue_Generic = readonly (Signal | undefined | null)[]

type InferI<Src> = Src extends Signal<infer I, any> ? I : never

export type SignalMerge_IValue<Src extends SrcIValue_Generic> = {
    -readonly [K in keyof Src]: InferI<Src[K]>
}
