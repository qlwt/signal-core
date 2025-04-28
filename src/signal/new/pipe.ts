import type { Signal } from "#src/signal/type/Signal.js";
import type { Signal_Sub } from "#src/type/signal/Sub.js";
import type { SignalPipe_ITransformer, SignalPipe_OTransformer } from "#src/type/signal/pipe/Transformers.js";
import { attachment_new_lazy } from "#src/util/attachment/new/lazy.js";

export const signal_new_pipe = function <I, O, IT, OT>(
    src: Signal<I, O>,
    itransformer: SignalPipe_ITransformer<I, IT>,
    otransformer: SignalPipe_OTransformer<O, OT>
): Signal<IT, OT> {
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
            src.input(itransformer(value))
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
