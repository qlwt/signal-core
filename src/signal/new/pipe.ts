import { osignal_new_pipe } from "#src/osignal/new/pipe.js";
import type { Signal } from "#src/signal/type/Signal.js";
import type { SignalPipe_ITransformer, SignalPipe_OTransformer } from "#src/type/signal/pipe/Transformers.js";

export const signal_new_pipe = function <I, O, IT, OT>(
    src: Signal<I, O>,
    itransformer: SignalPipe_ITransformer<I, IT>,
    otransformer: SignalPipe_OTransformer<O, OT>
): Signal<IT, OT> {
    const osignal = osignal_new_pipe(src, otransformer)

    return {
        ...osignal,

        input(value) {
            src.input(itransformer(value))
        },
    }
}
