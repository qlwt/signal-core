import type { ESignal } from "#src/esignal/type/ESignal.js"
import type { OSignal } from "#src/osignal/type/OSignal.js"
import { opensignal_flat } from "#src/util/opensignal/flat.js"

export const esignal_new_flat = (src: OSignal<ESignal | undefined | null>): ESignal => {
    const opensignal = opensignal_flat(src)

    return {
        rmsub(sub) {
            opensignal.rmsub(sub)
        },

        addsub(sub, config) {
            opensignal.addsub(sub, config)
        }
    }
}
