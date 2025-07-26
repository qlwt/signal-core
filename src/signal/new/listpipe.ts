import { osignal_new_listpipe } from "#src/osignal/new/listpipe.js"
import type { Signal } from "#src/signal/type/Signal.js"
import type { Signal_InferI } from "#src/type/signal/Infer.js"
import type { SignalListPipe_Output, SignalListPipe_RawItem } from "#src/type/signal/listpipe/Values.js"

type Src_Generic = Signal<null | undefined | readonly any[], null | undefined | readonly any[]>

export const signal_new_listpipe = function <Src extends Src_Generic, R>(
    src: Src, mapper: (input: SignalListPipe_RawItem<Src>) => R
): Signal<Signal_InferI<Src>, SignalListPipe_Output<Src, R>> {
    const osignal = osignal_new_listpipe(src, mapper)

    return {
        ...osignal,

        input: message => {
            src.input(message)
        }
    }
}

