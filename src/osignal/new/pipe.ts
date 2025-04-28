import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { SignalPipe_OTransformer } from "#src/type/signal/pipe/Transformers.js";
import { attachment_new_lazy } from "#src/util/attachment/new/lazy.js";

export const osignal_new_pipe = function <O, OT>(src: OSignal<O>, otransformer: SignalPipe_OTransformer<O, OT>): OSignal<OT> {
    const srcsub = () => {
        attachment.emit()
    }

    const attachment = attachment_new_lazy(
        () => {
            src.addsub(srcsub, { instant: true })
        },
        () => {
            src.rmsub(srcsub)
        }
    )

    return {
        addsub(sub, config) {
            attachment.addsub(sub, config)
        },

        rmsub(sub) {
            attachment.rmsub(sub)
        },

        output() {
            return otransformer(src.output())
        }
    }
}
