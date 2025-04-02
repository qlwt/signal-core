import type { Signal } from "#src/signal/type/Signal.js";
import type { Signal_Sub } from "#src/type/Signal_Sub.js";
import type { SignalPipe_OTransformer } from "#src/type/SignalPipe_Transformers.js";
import { attachment_new_lazy } from "#src/util/attachment/new/lazy.js";

export const signal_new_pipeo = function <I, O, OT>(
    src: Signal<I, O>,
    otransformer: SignalPipe_OTransformer<O, OT>
): Signal<I, OT> {
    const srcsub: Signal_Sub = () => {
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
        input(value) {
            src.input(value)
        },

        output() {
            return otransformer(src.output())
        },

        addsub(sub, config) {
            attachment.addsub(sub, config)
        },

        rmsub(sub) {
            attachment.rmsub(sub)
        }
    }
}

