import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { SignalPipe_OTransformer } from "#src/type/signal/pipe/Transformers.js";

export const osignal_new_pipe = function <O, OT>(src: OSignal<O>, otransformer: SignalPipe_OTransformer<O, OT>): OSignal<OT> {
    return {
        rmsub: src.rmsub.bind(src),
        id: src.id.bind(src),

        addsub: (sub, config) => {
            src.addsub(sub, config)
        },

        output() {
            return otransformer(src.output())
        }
    }
}
