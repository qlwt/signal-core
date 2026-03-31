import { osignal_new_listpipe_pick } from "#src/osignal/new/listpipe_pick.js"
import type { Signal } from "#src/signal/type/Signal.js"
import type { PickWrapper_Fail, PickWrapper_Success, PickWrapper_Success_Infer } from "#src/type/PickWrapper.js"
import type { Signal_InferI } from "#src/type/signal/Infer.js"
import type { SignalListPipe_Output, SignalListPipe_RawItem } from "#src/type/signal/listpipe/Values.js"

type Src_Generic = Signal<(
    | null
    | undefined
    | Iterable<any>
)>

export const signal_new_listpipe_pick = function <Src extends Src_Generic, R extends PickWrapper_Success | PickWrapper_Fail>(
    src: Src, mapper: (input: SignalListPipe_RawItem<Src>) => R
): Signal<Signal_InferI<Src>, SignalListPipe_Output<Src, PickWrapper_Success_Infer<R>>> {
    const osignal = osignal_new_listpipe_pick(src, mapper)

    return {
        ...osignal,

        input: src.input.bind(src),
    }
}
