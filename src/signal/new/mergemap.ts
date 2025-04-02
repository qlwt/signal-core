import { osignal_new_mergemap } from "#src/osignal/new/mergemap.js"
import type { Signal } from "#src/signal/type/Signal.js"
import type { SignalMergeMap_IValue, SignalMergeMap_OValue } from "#src/type/SignalMergeMap_Values.js"

type SrcGeneric = { readonly [K in keyof any]: Signal<any, any> }

export const signal_new_mergemap = function <Src extends SrcGeneric>(
    src: Src
): Signal<SignalMergeMap_IValue<Src>, SignalMergeMap_OValue<Src>> {
    const osignal = osignal_new_mergemap(src)

    return {
        rmsub(sub) {
            osignal.rmsub(sub)
        },

        addsub(sub, config) {
            osignal.addsub(sub, config)
        },

        output() {
            return osignal.output()
        },
        
        input(message) {
            for (const [key, key_value] of Object.entries(message)) {
                src[key]!.input(key_value)
            }
        }
    }
}
