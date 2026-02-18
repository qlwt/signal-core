import type { ESignal } from "#src/esignal/type/ESignal.js"
import type { SignalDebug_EConfig } from "#src/type/signal/debug/Config.js"
import type { SignalDebug_EState } from "#src/type/signal/debug/State.js"
import type { Signal_Sub, Signal_SubConfig_Order } from "#src/type/signal/Sub.js"
import { attachment_new_lazy } from "#src/util/attachment/new/lazy.js"
import type { Emitter_OrderMap, Emitter_SubIdx } from "#src/util/emitter/new/index.js"

type Msg = {
    name: string
    state?: SignalDebug_EState
}

type Msg_Data = {
    attachments: Signal_SubConfig_Order[]
}

const withstate = function(msg: Msg, config: SignalDebug_EConfig, data_new: () => Msg_Data): Msg {
    if (!config.print?.state) {
        return msg
    }

    const data = data_new()

    return {
        ...msg,

        state: {
            time: new Date(),
            attachments: data.attachments,
        }
    }
}

export interface ESignalDebug extends ESignal {
    readonly debug_subidx: () => Emitter_SubIdx
    readonly debug_ordermap: () => Emitter_OrderMap
    readonly debug_active_list: () => Signal_SubConfig_Order[]
    readonly debug_active: (order: Signal_SubConfig_Order) => boolean
}

export const esignal_new_debug = function(src: ESignal, config: SignalDebug_EConfig): ESignalDebug {
    const attachment = attachment_new_lazy({
        connection_new: order => {
            const src_sub: Signal_Sub = () => {
                if (config.print?.actions?.emit ?? config.print?.actions_fallback ?? true) {
                    console.log(
                        withstate(
                            {
                                name: `SignalDebug. Name ${config.name}. Operation: emit. Order ${order}`,
                            },
                            config,
                            () => ({
                                attachments: attachment.active_list()
                            })
                        )
                    )
                }

                attachment.emit(order)
            }

            return {
                attach: () => {
                    if (config.print?.actions?.attach ?? config.print?.actions_fallback ?? true) {
                        console.log(
                            withstate(
                                {
                                    name: `SignalDebug. Name ${config.name}. Operation: attach. Order ${order}`,
                                },
                                config,
                                () => ({
                                    attachments: attachment.active_list()
                                })
                            )
                        )
                    }

                    src.addsub(src_sub, { order })
                },

                detach: () => {
                    if (config.print?.actions?.detach ?? config.print?.actions_fallback ?? true) {
                        console.log(
                            withstate(
                                {
                                    name: `SignalDebug. Name ${config.name}. Operation: detach. Order ${order}`,
                                },
                                config,
                                () => ({
                                    attachments: attachment.active_list()
                                })
                            )
                        )
                    }

                    src.rmsub(src_sub)
                },
            }
        },
    })

    return {
        id: src.id.bind(src),

        debug_active: attachment.active,
        debug_active_list: attachment.active_list,

        debug_subidx: attachment.subidx,
        debug_ordermap: attachment.ordermap,

        rmsub: sub => {
            if (config.print?.actions?.addsub ?? config.print?.actions_fallback ?? true) {
                console.log(
                    withstate(
                        {
                            name: `SignalDebug. Name ${config.name}. Operation: rmsub`,
                        },
                        config,
                        () => ({
                            attachments: attachment.active_list(),
                        })
                    )
                )
            }

            attachment.rmsub(sub)
        },

        addsub: (sub, sub_config) => {
            if (config.print?.actions?.rmsub ?? config.print?.actions_fallback ?? true) {
                console.log(
                    withstate(
                        {
                            name: `SignalDebug. Name ${config.name}. Operation: addsub`,
                        },
                        config,
                        () => ({
                            attachments: attachment.active_list(),
                        })
                    )
                )
            }

            attachment.addsub(sub, sub_config)
        },
    }
}
