import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { Signal } from "#src/signal/type/Signal.js";

export type SignalFlat_OValue<
    Src extends OSignal<OSignal<any> | undefined | null>
> = Src extends OSignal<OSignal<infer O>>
    ? O
    : (Src extends OSignal<OSignal<infer O> | undefined>
        ? O | undefined
        : (Src extends OSignal<OSignal<infer O> | null>
            ? O | null
            : (Src extends OSignal<OSignal<infer O> | null | undefined>
                ? O | null | undefined
                : never
            )
        )
    )

export type SignalFlat_IValue<
    Src extends OSignal<Signal<any, any> | undefined | null>
> = Src extends OSignal<Signal<infer I, any>>
    ? I
    : (Src extends OSignal<Signal<infer I, any> | undefined>
        ? I | undefined
        : (Src extends OSignal<Signal<infer I, any> | null>
            ? I | null
            : (Src extends OSignal<Signal<infer I, any> | null | undefined>
                ? I | null | undefined
                : never
            )
        )
    ) 
