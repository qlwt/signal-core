import type { OSignal } from "#src/osignal/type/OSignal.js";

export interface Signal<I = any, O = I> extends OSignal<O> {
    readonly input: (message: I) => void
}
