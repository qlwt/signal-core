import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { Signal } from "#src/signal/type/Signal.js";

export type SignalFlat_OValue<Src extends OSignal<OSignal<any> | undefined | null>> = (
    (Src extends OSignal<infer Target>
        ? Target extends OSignal<infer O> ? O : Target
        : never
    )
)

export type SignalFlat_IValue<Src extends OSignal<Signal<any, any> | undefined | null>> = (
    (Src extends OSignal<infer Target>
        ? Target extends Signal<infer I, any> ? I : never
        : never
    )
)
