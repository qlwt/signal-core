import type { Signal } from "#src/signal/type/Signal.js";
import type { SignalPipe_ITransformer } from "#src/type/signal/pipe/Transformers.js";

export const signal_new_pipei = function <I, O, IT>(
    src: Signal<I, O>,
    itransformer: SignalPipe_ITransformer<I, IT>
): Signal<IT, O> {
    return {
        rmsub: src.rmsub.bind(src),
        addsub: src.addsub.bind(src),
        output: src.output.bind(src),
        id: src.id.bind(src),

        input(value) {
            src.input(itransformer(value))
        },
    }
}

