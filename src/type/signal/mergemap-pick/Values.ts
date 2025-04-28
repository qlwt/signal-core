import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { Signal } from "#src/signal/type/Signal.js";
import type { PickWrapper, PickWrapper_Fallback, PickWrapper_Success } from "#src/type/PickWrapper.js";
import type { Signal_InferI, Signal_InferO } from "#src/type/signal/Infer.js";

type OValueSrc_Generic = Readonly<Record<keyof any, PickWrapper<OSignal, any>>>

type InferO<Src extends PickWrapper<OSignal, any>> = (
    (Src extends PickWrapper_Success
        ? Signal_InferO<Src["value"]>
        : (Src extends PickWrapper_Fallback
            ? Src["value"]
            : never
        )
    )
)

export type SignalMergeMapPick_OValue<Src extends OValueSrc_Generic> = {
    -readonly [K in keyof Src]: InferO<Src[K]>
}

type IValueSrc_Generic = Readonly<Record<keyof any, PickWrapper<Signal, any>>>

type InferI<Src extends PickWrapper<Signal, any>> = (
    (Src extends PickWrapper_Success
        ? Signal_InferI<Src["value"]>
        : never
    )
)

export type SignalMergeMapPick_IValue<Src extends IValueSrc_Generic> = {
    readonly [K in keyof Src]-?: InferI<Src[K]>
}
