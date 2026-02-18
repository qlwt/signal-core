import { batcher } from "#src/const/batcher.js";
import type { ESignal } from "#src/esignal/type/ESignal.js";
import { emitter_new } from "#src/util/emitter/new/index.js";

export const esignal_new_manual = function(): [ESignal, VoidFunction] {
    let id = Symbol()

    const emitter = emitter_new()

    return [
        {
            id: () => id,

            rmsub: emitter.rmsub,
            addsub: emitter.addsub,
        },
        () => {
            batcher.change(() => {
                id = Symbol()
            })

            batcher.batch_sync(() => {
                emitter.emit_all()
            })
        }
    ]
}
