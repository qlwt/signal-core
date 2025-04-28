import { osignal_new_merge_pick } from "#src/osignal/new/merge_pick.js";
import type { Signal } from "#src/signal/type/Signal.js";
import type { PickWrapper } from "#src/type/PickWrapper.js";
import type { SignalMergePick_IValue, SignalMergePick_OValue } from "#src/type/signal/merge-pick/Values.js";

type Src_Generic = readonly PickWrapper<Signal, any>[]

type IValue<Src extends Src_Generic>  = SignalMergePick_IValue<Src>
type OValue<Src extends Src_Generic>  = SignalMergePick_OValue<Src>

export const signal_new_merge_pick = function <Src extends Src_Generic>(src: Src): Signal<IValue<Src>, OValue<Src>> {
    const osignal = osignal_new_merge_pick(src)

    return {
        output() {
            return osignal.output()
        },

        input(values) {
            values.forEach((value, index) => {
                const src_item = src[index]

                if (src_item && src_item.pick) {
                    src_item.value.input(value)
                }
            })
        },

        rmsub(sub) {
            osignal.rmsub(sub)
        },

        addsub(sub, config) {
            osignal.addsub(sub, config)
        }
    }
}
