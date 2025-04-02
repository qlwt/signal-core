import { esignal_new_merge } from "#src/esignal/new/merge.js";
import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { SignalMerge_OValue } from "#src/type/SignalMerge_Values.js";

export const osignal_new_merge = function <Src extends readonly OSignal<any>[]>(
    src: Src
): OSignal<SignalMerge_OValue<Src>> {
    const esignal = esignal_new_merge(src)

    return {
        addsub(sub, config) {
            esignal.addsub(sub, config)
        },

        rmsub(sub) {
            esignal.rmsub(sub)
        },

        output() {
            return src.map(osignal => osignal.output()) as SignalMerge_OValue<Src>
        }
    }
}
