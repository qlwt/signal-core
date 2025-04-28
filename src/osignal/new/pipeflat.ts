import { osignal_new_flat } from "#src/osignal/new/flat.js";
import { osignal_new_pipe } from "#src/osignal/new/pipe.js";
import type { OSignal } from "#src/osignal/type/OSignal.js";
import type { SignalPipe_OTransformer } from "#src/type/signal/pipe/Transformers.js";

type OT_Generic = OSignal | undefined | null

export const osignal_new_pipeflat = function <O, OT extends OT_Generic>(src: OSignal<O>, transformer: SignalPipe_OTransformer<O, OT>) {
    return osignal_new_flat(osignal_new_pipe(src, src_o => {
        return transformer(src_o)
    }))
}
