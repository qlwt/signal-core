import { osignal_new_pipe } from "#src/osignal/new/pipe.js";
import type { Signal } from "#src/signal/type/Signal.js";
import type { SignalPipe_OTransformer } from "#src/type/signal/pipe/Transformers.js";

export const signal_new_pipeo = function <I, O, OT>(
    src: Signal<I, O>,
    otransformer: SignalPipe_OTransformer<O, OT>
): Signal<I, OT> {
    const osignal = osignal_new_pipe(src, otransformer)

    return {
        ...osignal,

        input(value) {
            src.input(value)
        },
    }
}
