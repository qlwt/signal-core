import type { OSignal } from "#src/osignal/type/OSignal.js"
import type { Signal } from "#src/signal/type/Signal.js"
import type { SignalFlat_IValue, SignalFlat_OValue } from "#src/type/SignalFlat_Values.js"
import { opensignal_flat } from "#src/util/opensignal/flat.js"

export const signal_new_flat = function <Src extends OSignal<Signal<any, any> | undefined | null>>(
    src: Src
): Signal<SignalFlat_IValue<Src>, SignalFlat_OValue<Src>> {
    const opensignal = opensignal_flat(src)

    return {
        input(value) {
            const target = opensignal.target()

            if (target) {
                target.input(value)
            }
        },

        output() {
            const target = opensignal.target()

            if (target) {
                return target.output()
            }

            return undefined as SignalFlat_OValue<Src>
        },

        rmsub(sub) {
            opensignal.rmsub(sub)
        },

        addsub(sub, config) {
            opensignal.addsub(sub, config)
        }
    }
}
