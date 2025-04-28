import { osignal_new_flat_pick } from "#src/osignal/new/flat_pick.js";
import { osignal_new_pipe } from "#src/osignal/new/pipe.js";
import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { PickWrapper } from "#src/type/PickWrapper.js";
import type { SignalPipe_OTransformer } from "#src/type/signal/pipe/Transformers.js";

type OT_Generic = PickWrapper<OSignal, any>

export const osignal_new_pipeflat_pick = function <O, OT extends OT_Generic>(src: OSignal<O>, transformer: SignalPipe_OTransformer<O, OT>) {
    return osignal_new_flat_pick(osignal_new_pipe(src, src_o => {
        return transformer(src_o)
    }))
}
