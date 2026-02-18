import type { Signal_Sub, Signal_SubConfig, Signal_SubConfig_Order } from "#src/type/signal/Sub.js"
import { emitter_new, type Emitter_OrderMap, type Emitter_SubIdx } from "#src/util/emitter/new/index.js"

export type AttachmentLazy_Connection = {
    readonly detach: VoidFunction
}

export type AttachmentLazy_ConMap = Map<Signal_SubConfig_Order, AttachmentLazy_Connection>

export type AttachmentLazy = {
    emit_all(): void
    emit(order: Signal_SubConfig_Order): void

    active_any(): boolean
    active_list(): Signal_SubConfig_Order[]
    active(order: Signal_SubConfig_Order): boolean

    conmap(): AttachmentLazy_ConMap

    rmsub(sub: Signal_Sub): void
    addsub(sub: Signal_Sub, config?: Signal_SubConfig): void

    subidx(): Emitter_SubIdx
    ordermap(): Emitter_OrderMap
}

export type Attachment_NewLazy = {
    readonly connection_new: (order: number | false) => {
        readonly attach: VoidFunction
        readonly detach: VoidFunction
    }
}

export const attachment_new_lazy = (params: Attachment_NewLazy): AttachmentLazy => {
    const emitter = emitter_new()
    const conmap: AttachmentLazy_ConMap = new Map()

    return {
        subidx: emitter.subidx,
        ordermap: emitter.ordermap,

        emit: emitter.emit,
        emit_all: emitter.emit_all,

        conmap: () => {
            return conmap
        },

        active_any: () => {
            return conmap.size > 0
        },

        active(order) {
            const reg = emitter.ordermap().get(order)

            return Boolean(reg && reg.size > 0)
        },

        active_list() {
            return [...conmap.keys()]
        },

        rmsub(sub) {
            const res = emitter.rmsub(sub)

            if (res !== null) {
                const con = conmap.get(res)!

                conmap.delete(res)

                con.detach()
            }
        },

        addsub(sub, config) {
            const res = emitter.addsub(sub, config)

            if (res !== null) {
                const con = params.connection_new(res)

                conmap.set(res, {
                    detach: con.detach.bind(con)
                })

                con.attach()
            }
        }
    }
}
