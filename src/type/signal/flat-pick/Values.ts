import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { Signal } from "#src/signal/type/Signal.js";
import type { PickWrapper, PickWrapper_Fallback, PickWrapper_Success } from "#src/type/PickWrapper.js";
import type { Signal_InferI, Signal_InferO } from "#src/type/signal/Infer.js";

type InferOPickFallback<Src> = (
    (Src extends PickWrapper_Fallback
        ? Src["value"]
        : never
    )
)

type InferOPickSuccess<Src extends PickWrapper<OSignal, any>> = (
    (Src extends PickWrapper_Success
        ? Signal_InferO<Src["value"]>
        : InferOPickFallback<Src>
    )
)

export type SignalFlatPick_OValue<Src extends OSignal<PickWrapper<OSignal, any>>> = (
    InferOPickSuccess<Signal_InferO<Src>>
)

type InferIPickSuccess<Src extends PickWrapper<Signal>> = (
    (Src extends PickWrapper_Success
        ? Signal_InferI<Src["value"]>
        : never
    )
)

export type SignalFlatPick_IValue<Src extends OSignal<PickWrapper<Signal>>> = (
    InferIPickSuccess<Signal_InferO<Src>>
)
