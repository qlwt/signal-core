import type { OSignal } from "#src/osignal/type/OSignal.js";
import { attachment_new_lazy } from "#src/util/attachment/new/lazy.js";

type Comparator<T> = {
    (a: T, b: T): boolean
}

export const osignal_new_memo = <T>(src: OSignal<T>, eq: Comparator<T> = Object.is): OSignal<T> => {
    let cache: T

    const src_sub = () => {
        const src_o = src.output()

        if (!eq(cache, src_o)) {
            cache = src_o

            attachment.emit()
        }
    }

    const attachment = attachment_new_lazy(
        () => {
            src.addsub(src_sub, { instant: true })

            cache = src.output()
        },
        () => {
            src.rmsub(src_sub)
        }
    )

    return {
        output() {
            if (attachment.active()) {
                return cache
            }

            return src.output()
        },

        rmsub(sub) {
            attachment.rmsub(sub)
        },

        addsub(sub, config) {
            attachment.addsub(sub, config)
        },
    }
}
