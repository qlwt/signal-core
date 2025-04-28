import { osignal_new_merge } from "#src/osignal/new/merge.js";
import type { Signal } from "#src/signal/type/Signal.js";
import type { SignalMerge_IValue, SignalMerge_OValue } from "#src/type/signal/merge/Values.js";

type Src_Generic = readonly (Signal | undefined | null)[]

type IValue<Src extends Src_Generic> = SignalMerge_IValue<Src>
type OValue<Src extends Src_Generic> = SignalMerge_OValue<Src>

export const signal_new_merge = function <Src extends Src_Generic>(src: Src): Signal<IValue<Src>, OValue<Src>> {
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
