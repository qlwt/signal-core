import type { OSignal } from "#src/osignal/type/OSignal.js"
import type { Signal } from "#src/signal/type/Signal.js"
import type { PickWrapper } from "#src/type/PickWrapper.js"
import type { SignalFlatPick_IValue, SignalFlatPick_OValue } from "#src/type/signal/flat-pick/Values.js"
import { opensignal_flat } from "#src/util/opensignal/flat.js"

type Src_Generic = OSignal<PickWrapper<Signal, any>>

type IValue<Src extends Src_Generic> = SignalFlatPick_IValue<Src>
type OValue<Src extends Src_Generic> = SignalFlatPick_OValue<Src>

export const signal_new_flat_pick = function <Src extends Src_Generic>(src: Src): Signal<IValue<Src>, OValue<Src>> {
    const opensignal = opensignal_flat(src)

    return {
        input(value) {
            const target = opensignal.target()

            if (target.pick) {
                target.value.input(value)
            }
        },

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
