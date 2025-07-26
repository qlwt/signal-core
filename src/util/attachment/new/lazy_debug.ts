import type { Signal_Sub, Signal_SubConfig } from "#src/type/signal/Sub.js"
import { emitter_new_debug } from "#src/util/emitter/new/debug.js"

export type AttachmentLazyDebug = {
    emit(): void
    active(): boolean
    rmsub(sub: Signal_Sub): void
    addsub(sub: Signal_Sub, config?: Signal_SubConfig): void

    readonly debug_submap_get: () => Map<Signal_Sub, Signal_SubConfig>
}

export const attachment_new_lazy_debug = (attach: VoidFunction, deattach: VoidFunction): AttachmentLazyDebug => {
    const emitter = emitter_new_debug()

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
        },

        debug_submap_get: () => emitter.debug_submap_get()
    }
}
