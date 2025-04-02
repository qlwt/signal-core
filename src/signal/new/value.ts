import { batcher } from "#src/const/batcher.js";
import type { Signal } from "#src/signal/type/Signal.js";
import { emitter_new } from "#src/util/emitter/new/index.js";

export const signal_new_value = function <T>(initial: T): Signal<T, T> {
    let value = initial

    const emitter = emitter_new()

    return {
        output() {
            return value
        },

        input(invalue) {
            value = invalue

            batcher.batch_sync(() => {
                emitter.emit()
            })
        },

        rmsub(sub) {
            emitter.rmsub(sub)
        },

        addsub(sub, config) {
            emitter.addsub(sub, config)
        }
    }
}
