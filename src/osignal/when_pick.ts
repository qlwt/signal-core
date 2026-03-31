import type { OSignal } from "#src/osignal/type/OSignal.js"
import type { PickWrapper, PickWrapper_Success_Infer } from "#src/type/PickWrapper.js"
import type { Signal_InferO } from "#src/type/signal/Infer.js"

type Src_Generic = OSignal<PickWrapper<any, any>>

export type Osignal_WhenPick_Config = {
    readonly noemit?: boolean
}

export const osignal_when_pick = function <Src extends Src_Generic>(
    src: Src, action: (src_o: PickWrapper_Success_Infer<Signal_InferO<Src>>) => void, config?: Osignal_WhenPick_Config
) {
    if (!config?.noemit) {
        const src_o = src.output()

        if (src_o.pick) {
            action(src_o.value)

            return
        }
    }

    const src_sub = () => {
        const src_o = src.output()

        if (src_o.pick) {
            action(src_o.value)

            src.rmsub(src_sub)
        }
    }

    src.addsub(src_sub)
}
