import { esignal_new_flat_pick } from "#src/esignal/new/flat_pick.js"
import type { ESignal } from "#src/esignal/type/ESignal.js"
import { osignal_new_pipe } from "#src/osignal/new/pipe.js"
import type { OSignal } from "#src/osignal/type/OSignal.js"

export const esignal_new_flat = (src: OSignal<ESignal | undefined | null>): ESignal => {
    return esignal_new_flat_pick(osignal_new_pipe(src, src_o => {
        if (src_o) {
            return {
                pick: true,
                value: src_o,
            }
        }

        return {
            pick: false
        }
    }))
}
