import type { OSignal } from "#src/osignal/type/OSignal.js"

export type SignalListPipe_RawItem<Src extends OSignal<readonly any[] | null | undefined>> = (
    Src extends OSignal<infer O> ? O extends readonly (infer I)[] ? I : never : never
)

export type SignalListPipe_Output<Src extends OSignal<readonly any[] | null | undefined>, R> = (
    (Src extends OSignal<infer O>
        ? (O extends readonly any[]
            ? R[]
            : O
        )
        : Src
    )
)
