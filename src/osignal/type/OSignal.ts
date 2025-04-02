import type { ESignal } from "#src/esignal/type/ESignal.js";

export interface OSignal<O = any> extends ESignal {
    readonly output: () => O
}
