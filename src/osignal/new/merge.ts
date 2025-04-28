import { esignal_new_merge } from "#src/esignal/new/merge.js";
import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { SignalMerge_OValue } from "#src/type/signal/merge/Values.js";

type Src_Generic = readonly (OSignal | undefined | null)[]

export const osignal_new_merge = function <Src extends Src_Generic>(src: Src): OSignal<SignalMerge_OValue<Src>> {
    const esignal = esignal_new_merge(src.filter(src_value => !!src_value))

    return {
        addsub(sub, config) {
            esignal.addsub(sub, config)
        },

        rmsub(sub) {
            esignal.rmsub(sub)
        },

        output() {
            return src.map(src_value => {
                if (src_value) {
                    return src_value.output()
                }

                return src_value
            }) as SignalMerge_OValue<Src>
        }
    }
}
