import type { ESignal } from "#src/esignal/type/ESignal.js";
import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { PickWrapperExpected } from "#src/type/PickWrapper.js";
import type { Signal_Sub, Signal_SubConfig } from "#src/type/signal/Sub.js";
import type { Signal_InferO } from "#src/type/signal/Infer.js";
import { attachment_new_lazy } from "#src/util/attachment/new/lazy.js";

type Src_Generic = OSignal<PickWrapperExpected<ESignal>>

export type OpenSignalFlat<Src extends Src_Generic> = {
    target(): Signal_InferO<Src>
    rmsub(sub: Signal_Sub): void
    addsub(sub: Signal_Sub, config?: Signal_SubConfig): void
}

type State<Src extends Src_Generic> = (
    | {
        readonly active: true
        readonly target: Signal_InferO<Src>
    }
    | {
        readonly active: false
    }
)

export const opensignal_flat = function <Src extends Src_Generic>(src: Src): OpenSignalFlat<Src> {
    let state: State<Src> = { active: false }

    const attachment = attachment_new_lazy(
        () => {
            const next_target = src.output()

            state = {
                active: true,
                target: next_target as Signal_InferO<Src>
            }

            src.addsub(src_sub, { instant: true })

            if (next_target.pick) {
                next_target.value.addsub(target_sub, { instant: true })
            }
        },
        () => {
            const now_state = state

            state = { active: false }

            src.rmsub(src_sub)

            if (now_state.active && now_state.target.pick) {
                now_state.target.value.rmsub(target_sub)
            }
        }
    )

    const src_sub: Signal_Sub = () => {
        const now_state = state
        const next_target = src.output()

        state = {
            active: true,
            target: next_target as Signal_InferO<Src>
        }

        if (now_state.active && now_state.target.pick) {
            now_state.target.value.rmsub(target_sub)
        }

        if (next_target.pick) {
            next_target.value.addsub(target_sub, { instant: true })
        }


        target_sub()
    }

    const target_sub: Signal_Sub = () => {
        attachment.emit()
    }

    return {
        target() {
            if (state.active) {
                return state.target
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
