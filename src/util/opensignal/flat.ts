import type { ESignal } from "#src/esignal/type/ESignal.js";
import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { Signal_Sub, Signal_SubConfig } from "#src/type/Signal_Sub.js";
import { attachment_new_lazy } from "#src/util/attachment/new/lazy.js";

type InferTarget<Src extends OSignal<ESignal | undefined | null>> = Src extends OSignal<infer T> ? T : never

export type OpenSignalFlat<Src extends OSignal<ESignal | undefined | null>> = {
    rmsub(sub: Signal_Sub): void
    addsub(sub: Signal_Sub, config?: Signal_SubConfig): void
    target(): InferTarget<Src>
}

export const opensignal_flat = function <Src extends OSignal<ESignal | undefined | null>>(src: Src): OpenSignalFlat<Src> {
    let target: InferTarget<Src> | null = null

    const attachment = attachment_new_lazy(
        () => {
            const newtarget = src.output() as InferTarget<Src>

            target = newtarget

            src.addsub(src_sub, { instant: true })

            if (newtarget) {
                newtarget.addsub(target_sub, { instant: true })
            }
        },
        () => {
            const oldtarget = target

            target = null

            src.rmsub(src_sub)

            if (oldtarget) {
                oldtarget.rmsub(target_sub)
            }
        }
    )

    const src_sub: Signal_Sub = () => {
        const oldtarget = target
        const newtarget = src.output() as InferTarget<Src>

        target = newtarget

        if (oldtarget) {
            oldtarget.rmsub(target_sub)
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
            if (target !== null) {
                return target
            }

            return src.output() as InferTarget<Src>
        },

        rmsub(sub) {
            attachment.rmsub(sub)
        },

        addsub(sub, config) {
            attachment.addsub(sub, config)
        }
    }
}
