import { osignal_new_flat_pick } from "#src/osignal/new/flat_pick.js"
import { osignal_new_pipe } from "#src/osignal/new/pipe.js"
import type { OSignal } from "#src/osignal/type/OSignal.js"
import type { SignalFlat_OValue } from "#src/type/signal/flat/Values.js"

type Src_Generic = OSignal<OSignal | null | undefined>

export const osignal_new_flat = function <Src extends Src_Generic>(src: Src): OSignal<SignalFlat_OValue<Src>> {
    return osignal_new_flat_pick(osignal_new_pipe(src, src_o => {
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
