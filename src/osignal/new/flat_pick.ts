import type { OSignal } from "#src/osignal/type/OSignal.js"
import type { PickWrapper } from "#src/type/PickWrapper.js"
import type { SignalFlatPick_OValue } from "#src/type/signal/flat-pick/Values.js"
import { opensignal_flat } from "#src/util/opensignal/flat.js"

type Src_Generic = OSignal<PickWrapper<OSignal, any>>

export const osignal_new_flat_pick = function <Src extends Src_Generic>(src: Src): OSignal<SignalFlatPick_OValue<Src>> {
    const opensignal = opensignal_flat(src)

    return {
        output() {
            const target = opensignal.target()

            if (target.pick) {
                return target.value.output()
            }

            return target.value
        },

        rmsub(sub) {
            opensignal.rmsub(sub)
        },

        addsub(sub, config) {
            opensignal.addsub(sub, config)
        }
    }
}
