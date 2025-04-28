import { osignal_new_mergemap } from "#src/osignal/new/mergemap.js"
import type { Signal } from "#src/signal/type/Signal.js"
import type { SignalMergeMap_IValue, SignalMergeMap_OValue } from "#src/type/signal/mergemap/Values.js"

type Src_Generic = Readonly<Record<keyof any, Signal | null | undefined>>

type IValue<Src extends Src_Generic> = SignalMergeMap_IValue<Src>
type OValue<Src extends Src_Generic> = SignalMergeMap_OValue<Src>

export const signal_new_mergemap = function <Src extends Src_Generic>(src: Src): Signal<IValue<Src>, OValue<Src>> {
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
