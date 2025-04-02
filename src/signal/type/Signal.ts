import type { OSignal } from "#src/osignal/type/OSignal.js";

export interface Signal<I = any, O = any> extends OSignal<O> {
    readonly input: (message: I) => void
}
