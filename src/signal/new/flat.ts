import { osignal_new_pipe } from "#src/osignal/new/pipe.js"
import type { OSignal } from "#src/osignal/type/OSignal.js"
import { signal_new_flat_pick } from "#src/signal/new/flat_pick.js"
import type { Signal } from "#src/signal/type/Signal.js"
import type { SignalFlat_IValue, SignalFlat_OValue } from "#src/type/signal/flat/Values.js"

type Src_Generic = OSignal<Signal | undefined | null>

type IValue<Src extends Src_Generic> = SignalFlat_IValue<Src>
type OValue<Src extends Src_Generic> = SignalFlat_OValue<Src>

export const signal_new_flat = function <Src extends Src_Generic>(src: Src): Signal<IValue<Src>, OValue<Src>> {
    return signal_new_flat_pick(osignal_new_pipe(src, src_o => {
        if (src_o) {
            return {
                pick: true,
                value: src_o
            }
        }

        return {
            pick: false,
            value: src_o
        }
    }))
}
