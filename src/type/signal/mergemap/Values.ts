import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { Signal } from "#src/signal/type/Signal.js";

type OValueSrc_Generic = Readonly<Record<keyof any, OSignal | undefined | null>>

type InferO<Src> = Src extends OSignal<infer O> ? O : Src

export type SignalMergeMap_OValue<Src extends OValueSrc_Generic> = {
    -readonly [K in keyof Src]: InferO<Src[K]>
}

type IValueSrc_Generic = Readonly<Record<keyof any, Signal | undefined | null>>

type InferI<Src> = Src extends Signal<infer I> ? I : never

export type SignalMergeMap_IValue<Src extends IValueSrc_Generic> = {
    readonly [K in keyof Src]-?: InferI<Src[K]>
}
