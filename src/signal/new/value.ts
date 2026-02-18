import { batcher } from "#src/const/batcher.js";
import type { Signal } from "#src/signal/type/Signal.js";
import { emitter_new } from "#src/util/emitter/new/index.js";

export const signal_new_value = function <T>(initial: T): Signal<T, T> {
    let id = Symbol()
    let value = initial

    const emitter = emitter_new()

    return {
        id: () => id,
        rmsub: emitter.rmsub,
        addsub: emitter.addsub,

        output() {
            return value
        },

        input(invalue) {
            batcher.change(() => {
                id = Symbol()
                value = invalue
            })

            batcher.batch_sync(() => {
                emitter.emit_all()
            })
        },
    }
}
