import type { OSignal } from "#src/osignal/type/OSignal.js"

export type SignalListPipe_RawItem<Src extends OSignal<Iterable<any> | null | undefined>> = (
    Src extends OSignal<infer O> ? O extends Iterable<infer I> ? I : never : never
)

export type SignalListPipe_Output<Src extends OSignal<Iterable<any> | null | undefined>, R> = (
    (Src extends OSignal<infer O>
        ? (O extends Iterable<any>
            ? R[]
            : O
        )
        : Src
    )
)
