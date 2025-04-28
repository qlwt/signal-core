import { esignal_new_merge } from "#src/esignal/new/merge.js"
import type { OSignal } from "#src/osignal/type/OSignal.js"
import type { PickWrapper } from "#src/type/PickWrapper.js"
import type { SignalMergeMapPick_OValue } from "#src/type/signal/mergemap-pick/Values.js"

type Src_Generic = Readonly<Record<keyof any, PickWrapper<OSignal, any>>>

export const osignal_new_mergemap_pick = function <Src extends Src_Generic>(src: Src): OSignal<SignalMergeMapPick_OValue<Src>> {
    const esignal = esignal_new_merge(Object.values(src).filter(src_value => src_value.pick).map(src_value => src_value.value))

    return {
        rmsub(sub) {
            esignal.rmsub(sub)
        },

        addsub(sub, config) {
            esignal.addsub(sub, config)
        },

        output() {
            const ovalue = {} as SignalMergeMapPick_OValue<Src>

            for (const [key, value] of Object.entries(src)) {
                if (value.pick) {
                    ovalue[key as keyof SignalMergeMapPick_OValue<Src>] = value.value.output()
                } else {
                    ovalue[key as keyof SignalMergeMapPick_OValue<Src>] = value.value
                }
            }

            return ovalue
        },
    }
}
