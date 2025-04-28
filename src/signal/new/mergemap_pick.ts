import { osignal_new_mergemap_pick } from "#src/osignal/new/mergemap_pick.js"
import type { Signal } from "#src/signal/type/Signal.js"
import type { PickWrapper } from "#src/type/PickWrapper.js"
import type { SignalMergeMapPick_IValue, SignalMergeMapPick_OValue } from "#src/type/signal/mergemap-pick/Values.js"

type Src_Generic = Readonly<Record<keyof any, PickWrapper<Signal, any>>>

type IValue<Src extends Src_Generic> = SignalMergeMapPick_IValue<Src>
type OValue<Src extends Src_Generic> = SignalMergeMapPick_OValue<Src>

export const signal_new_mergemap_pick = function <Src extends Src_Generic>(src: Src): Signal<IValue<Src>, OValue<Src>> {
    const osignal = osignal_new_mergemap_pick(src)

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
                const src_item = src[key]

                if (src_item && src_item.pick) {
                    src_item.value.input(key_value)
                }
            }
        }
    }
}
