import type { Signal } from "#src/signal/type/Signal.js";
import type { OSignal } from "#src/osignal/type/OSignal.js";

export type Signal_InferO<Src extends OSignal<any>> = Src extends OSignal<infer O> ? O : never

export type Signal_InferI<Src extends Signal<any, any>> = Src extends Signal<infer I, any> ? I : never
