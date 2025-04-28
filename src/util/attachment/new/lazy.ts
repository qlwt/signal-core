import type { Signal_Sub, Signal_SubConfig } from "#src/type/signal/Sub.js"
import { emitter_new } from "#src/util/emitter/new/index.js"

export type AttachmentLazy = {
    emit(): void
    active(): boolean
    rmsub(sub: Signal_Sub): void
    addsub(sub: Signal_Sub, config?: Signal_SubConfig): void
}

export const attachment_new_lazy = (attach: VoidFunction, deattach: VoidFunction): AttachmentLazy => {
    const emitter = emitter_new()

    return {
        active() {
            return emitter.submap().size > 0
        },

        emit() {
            emitter.emit()
        },

        rmsub(sub) {
            const submap_size_init = emitter.submap().size

            emitter.rmsub(sub)

            if (submap_size_init > 0 && emitter.submap().size === 0) {
                deattach()
            }
        },

        addsub(sub, config) {
            const submap_size_init = emitter.submap().size

            emitter.addsub(sub, config)

            if (submap_size_init === 0) {
                attach()
            }
        }
    }
}
