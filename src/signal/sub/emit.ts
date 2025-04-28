import { batcher } from "#src/const/batcher.js";
import type { Signal_Sub, Signal_SubConfig } from "#src/type/signal/Sub.js";

export const signal_sub_emit = function (sub: Signal_Sub, config?: Signal_SubConfig): void {
    if (config?.instant) {
        sub()

        return
    }

    batcher.schedule(sub)
}
