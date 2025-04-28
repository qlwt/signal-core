import type { ESignal } from "#src/esignal/type/ESignal.js";
import type { Signal_Sub } from "#src/type/signal/Sub.js";
import { attachment_new_lazy } from "#src/util/attachment/new/lazy.js";

export const esignal_new_merge = (src: readonly ESignal[]): ESignal => {
    const src_sub: Signal_Sub = () => {
        attachment.emit()
    }

    const attachment = attachment_new_lazy(
        () => {
            src.forEach(src => {
                src.addsub(src_sub, { instant: true })
            })
        },
        () => {
            src.forEach(src => {
                src.rmsub(src_sub)
            })
        }
    )

    return {
        addsub(sub, config) {
            attachment.addsub(sub, config)
        },

        rmsub(sub) {
            attachment.rmsub(sub)
        }
    }
}
