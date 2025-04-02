import { batcher } from "#src/const/batcher.js";
import type { ESignal } from "#src/esignal/type/ESignal.js";
import { emitter_new } from "#src/util/emitter/new/index.js";

export const esignal_new_manual = function(): [ESignal, VoidFunction] {
    const emitter = emitter_new()

    return [
        {
            rmsub: sub => {
                emitter.rmsub(sub)
            },

            addsub: (sub, config) => {
                emitter.addsub(sub, config)
            },
        },
        () => {
            batcher.batch_sync(() => {
                emitter.emit()
            })
        }
    ]
}
