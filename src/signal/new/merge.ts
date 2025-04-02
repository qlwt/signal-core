import { osignal_new_merge } from "#src/osignal/new/merge.js";
import type { Signal } from "#src/signal/type/Signal.js";
import type { SignalMerge_IValue, SignalMerge_OValue } from "#src/type/SignalMerge_Values.js";

export const signal_new_merge = function <Src extends readonly Signal<any, any>[]>(
    src: Src
): Signal<SignalMerge_IValue<Src>, SignalMerge_OValue<Src>> {
    const osignal = osignal_new_merge(src)

    return {
        output() {
            return osignal.output()
        },

        input(values) {
            values.forEach((value, index) => {
                const src_item = src[index]

                if (src_item) {
                    src_item.input(value)
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
