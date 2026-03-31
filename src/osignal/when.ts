import type { OSignal } from "#src/osignal/type/OSignal.js"
import type { Signal_InferO } from "#src/type/signal/Infer.js"

type Src_Generic = OSignal<any | null | undefined>

export type Osignal_When_Config = {
    readonly noemit?: boolean
}

export const osignal_when = function <Src extends Src_Generic>(
    src: Src, action: (src_o: Exclude<Signal_InferO<Src>, null | undefined>) => void, config?: Osignal_When_Config
) {
    if (!config?.noemit) {
        const src_o = src.output()

        if (!(src_o === undefined || src_o === null)) {
            action(src_o.value)

            return
        }
    }

    const src_sub = () => {
        const src_o = src.output()

        if (!(src_o === undefined || src_o === null)) {
            action(src_o)

            src.rmsub(src_sub)
        }
    }

    src.addsub(src_sub)
}
