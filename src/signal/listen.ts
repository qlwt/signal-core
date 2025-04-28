import type { ESignal } from "#src/esignal/type/ESignal.js";
import type { Signal_Sub, Signal_SubConfig } from "#src/type/signal/Sub.js";

export type Signal_Listen_Sub<Target extends ESignal> = {
    (target: Target): VoidFunction | void | undefined
}

export type Signal_Listen_Config = {
    readonly emit?: boolean
    readonly sub_config?: Signal_SubConfig
}

export type Signal_Listen_Params<Target extends ESignal> = {
    readonly target: Target
    readonly listener: Signal_Listen_Sub<Target>
    readonly config?: Signal_Listen_Config
}

export const signal_listen = function <Target extends ESignal>(params: Signal_Listen_Params<Target>): VoidFunction {
    let cleanup: void | undefined | VoidFunction

    const target_sub: Signal_Sub = () => {
        cleanup?.()

        cleanup = params.listener(params.target)
    }

    {
        params.target.addsub(target_sub, params.config?.sub_config)

        if (params.config?.emit) {
            target_sub()
        }
    }

    return () => {
        if (cleanup) {
            cleanup()

            cleanup = undefined
        }

        params.target.rmsub(target_sub)
    }
}
