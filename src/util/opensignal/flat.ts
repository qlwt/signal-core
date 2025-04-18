import type { ESignal } from "#src/esignal/type/ESignal.js";
import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { Signal_Sub, Signal_SubConfig } from "#src/type/Signal_Sub.js";
import type { Signal_InferO } from "#src/type/Signal_ValueInfer.js";
import { attachment_new_lazy } from "#src/util/attachment/new/lazy.js";

export type OpenSignalFlat<Src extends OSignal<ESignal | undefined | null>> = {
    rmsub(sub: Signal_Sub): void
    addsub(sub: Signal_Sub, config?: Signal_SubConfig): void
    target(): Signal_InferO<Src>
}

type Target<Src extends OSignal<ESignal | undefined | null>> = (
    | {
        readonly active: true
        readonly value: Signal_InferO<Src>
    }
    | {
        readonly active: false
    }
)

export const opensignal_flat = function <Src extends OSignal<ESignal | undefined | null>>(src: Src): OpenSignalFlat<Src> {
    let target: Target<Src> = { active: false }

    const attachment = attachment_new_lazy(
        () => {
            const newtarget = src.output() as Signal_InferO<Src>

            target = { active: true, value: newtarget }

            src.addsub(src_sub, { instant: true })

            if (newtarget) {
                newtarget.addsub(target_sub, { instant: true })
            }
        },
        () => {
            const oldtarget = target

            target = { active: false }

            src.rmsub(src_sub)

            if (oldtarget.active && oldtarget.value) {
                oldtarget.value.rmsub(target_sub)
            }
        }
    )

    const src_sub: Signal_Sub = () => {
        const oldtarget = target
        const newtarget = src.output() as Signal_InferO<Src>

        target = { active: true, value: newtarget }

        if (oldtarget.active && oldtarget.value) {
            oldtarget.value.rmsub(target_sub)
        }

        if (newtarget) {
            newtarget.addsub(target_sub, { instant: true })
        }

        target_sub()
    }

    const target_sub: Signal_Sub = () => {
        attachment.emit()
    }

    return {
        target() {
            if (target.active) {
                return target.value
            }

            return src.output() as Signal_InferO<Src>
        },

        rmsub(sub) {
            attachment.rmsub(sub)
        },

        addsub(sub, config) {
            attachment.addsub(sub, config)
        }
    }
}
