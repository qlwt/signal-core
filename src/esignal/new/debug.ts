import type { ESignal } from "#src/esignal/type/ESignal.js"
import type { SignalDebug_EConfig } from "#src/type/signal/debug/Config.js"
import type { SignalDebug_EState } from "#src/type/signal/debug/State.js"
import type { Signal_Sub, Signal_SubConfig } from "#src/type/signal/Sub.js"
import { attachment_new_lazy_debug } from "#src/util/attachment/new/lazy_debug.js"

type Msg = {
    name: string
    state?: SignalDebug_EState
}

type Msg_Data = {
    attached: boolean
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
            attached: data.attached,
        }
    }
}

export interface ESignalDebug extends ESignal {
    readonly debug_attached: () => boolean
    readonly debug_submap_get: () => Map<Signal_Sub, Signal_SubConfig>
}

export const esignal_new_debug = function(src: ESignal, config: SignalDebug_EConfig): ESignalDebug {
    const src_sub: Signal_Sub = () => {
        if (config.print?.actions?.emit ?? config.print?.actions_fallback ?? true) {
            console.log(
                withstate(
                    {
                        name: `SignalDebug. Name ${config.name}. Operation: emit`,
                    },
                    config,
                    () => ({
                        attached: attachment.active()
                    })
                )
            )
        }

        attachment.emit()
    }

    const attachment = attachment_new_lazy_debug(
        () => {
            if (config.print?.actions?.attach ?? config.print?.actions_fallback ?? true) {
                console.log(
                    withstate(
                        {
                            name: `SignalDebug. Name ${config.name}. Operation: attach`,
                        },
                        config,
                        () => ({
                            attached: attachment.active()
                        })
                    )
                )
            }

            src.addsub(src_sub, { instant: true })
        },
        () => {
            if (config.print?.actions?.detach ?? config.print?.actions_fallback ?? true) {
                console.log(
                    withstate(
                        {
                            name: `SignalDebug. Name ${config.name}. Operation: detach`,
                        },
                        config,
                        () => ({
                            attached: attachment.active()
                        })
                    )
                )
            }

            src.rmsub(src_sub)
        }
    )

    return {
        rmsub: sub => {
            if (config.print?.actions?.addsub ?? config.print?.actions_fallback ?? true) {
                console.log(
                    withstate(
                        {
                            name: `SignalDebug. Name ${config.name}. Operation: rmsub`,
                        },
                        config,
                        () => ({
                            attached: attachment.active()
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
                            attached: attachment.active()
                        })
                    )
                )
            }

            attachment.addsub(sub, sub_config)
        },

        debug_attached: () => attachment.active(),
        debug_submap_get: () => attachment.debug_submap_get()
    }
}
