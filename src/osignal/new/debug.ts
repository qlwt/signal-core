import type { OSignal } from "#src/osignal/type/OSignal.js"
import type { SignalDebug_OConfig } from "#src/type/signal/debug/Config.js"
import type { SignalDebug_OState } from "#src/type/signal/debug/State.js"
import type { Signal_Sub, Signal_SubConfig } from "#src/type/signal/Sub.js"
import { attachment_new_lazy_debug } from "#src/util/attachment/new/lazy_debug.js"

type Msg<O> = {
    name: string
    state?: SignalDebug_OState<O>
}

type Msg_Data<O> = {
    output: O
    attached: boolean
}

const withstate = function <O>(msg: Msg<O>, config: SignalDebug_OConfig, data_new: () => Msg_Data<O>): Msg<O> {
    if (!config.print?.state) {
        return msg
    }

    const data = data_new()

    return {
        ...msg,

        state: {
            time: new Date(),
            output: data.output,
            attached: data.attached,
        }
    }
}

export interface OSignalDebug<O> extends OSignal<O> {
    readonly debug_attached: () => boolean
    readonly debug_submap_get: () => Map<Signal_Sub, Signal_SubConfig>
}

export const osignal_new_debug = function <O>(src: OSignal<O>, config: SignalDebug_OConfig): OSignalDebug<O> {
    const src_sub: Signal_Sub = () => {
        if (config.print?.actions?.emit ?? config.print?.actions_fallback ?? true) {
            console.log(
                withstate(
                    {
                        name: `SignalDebug. Name ${config.name}. Operation: emit`,
                    },
                    config,
                    () => ({
                        attached: attachment.active(),
                        output: src.output(),
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
                            output: src.output(),
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
                            output: src.output(),
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
                            output: src.output(),
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
                            output: src.output(),
                            attached: attachment.active()
                        })
                    )
                )
            }

            attachment.addsub(sub, sub_config)
        },

        output: () => {
            const output = src.output()

            console.log(
                withstate(
                    {
                        name: `SignalDebug. Name ${config.name}. Operation: output`,
                    },
                    config,
                    () => ({
                        output,

                        attached: attachment.active(),
                    })
                )
            )

            return output
        },

        debug_attached: () => attachment.active(),
        debug_submap_get: () => attachment.debug_submap_get()
    }
}
