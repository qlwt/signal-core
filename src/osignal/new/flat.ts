import type { OSignal } from "#src/osignal/type/OSignal.js"
import type { SignalFlat_OValue } from "#src/type/SignalFlat_Values.js"
import { opensignal_flat } from "#src/util/opensignal/flat.js"

export const osignal_new_flat = function <Src extends OSignal<OSignal<any> | undefined | null>>(src: Src): OSignal<SignalFlat_OValue<Src>> {
    const opensignal = opensignal_flat(src)

    return {
        output() {
            const target = opensignal.target()

            if (target) {
                return target.output()
            }

            return undefined
        },

        rmsub(sub) {
            opensignal.rmsub(sub)
        },

        addsub(sub, config) {
            opensignal.addsub(sub, config)
        }
    }
}
