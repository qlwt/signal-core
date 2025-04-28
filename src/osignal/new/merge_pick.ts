import { esignal_new_merge } from "#src/esignal/new/merge.js";
import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { PickWrapper } from "#src/type/PickWrapper.js";
import type { SignalMergePick_OValue } from "#src/type/signal/merge-pick/Values.js";

type Src_Generic = readonly PickWrapper<OSignal, any>[]

export const osignal_new_merge_pick = function <Src extends Src_Generic>(src: Src): OSignal<SignalMergePick_OValue<Src>> {
    const esignal = esignal_new_merge(src.filter(src_value => src_value.pick).map(src_value => src_value.value))

    return {
        addsub(sub, config) {
            esignal.addsub(sub, config)
        },

        rmsub(sub) {
            esignal.rmsub(sub)
        },

        output() {
            return src.map(src_value => {
                if (src_value.pick) {
                    return src_value.value.output()
                }

                return src_value.value
            }) as SignalMergePick_OValue<Src>
        }
    }
}
