import { esignal_new_merge } from "#src/esignal/new/merge.js"
import type { OSignal } from "#src/osignal/type/OSignal.js"
import type { SignalMergeMap_OValue } from "#src/type/SignalMergeMap_Values.js"

type Generic__Src = Readonly<Record<keyof any, OSignal>>

export const osignal_new_mergemap = function <Src extends Generic__Src>(
    src: Src
): OSignal<SignalMergeMap_OValue<Src>> {
    const esignal = esignal_new_merge(Object.values(src))

    return {
        rmsub(sub) {
            esignal.rmsub(sub)
        },

        addsub(sub, config) {
            esignal.addsub(sub, config)
        },

        output() {
            const ovalue = {} as SignalMergeMap_OValue<Src>

            for (const [key, key_osignal] of Object.entries(src)) {
                ovalue[key as keyof SignalMergeMap_OValue<Src>] = key_osignal.output()
            }

            return ovalue
        },
    }
}
