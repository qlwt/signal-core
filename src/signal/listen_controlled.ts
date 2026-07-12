import type { ESignal } from "#src/esignal/type/ESignal.js";
import type { Signal_Sub, Signal_SubConfig } from "#src/type/signal/Sub.js";

type Mutable<T extends {}> = {
    -readonly [K in keyof T]: T[K]
}

export type Signal_ListenControled_SubReturn<Payload extends {}> = {
    readonly payload?: Payload
    readonly cleanup_update?: VoidFunction | null
}

export type Signal_ListenControled_Sub<Target extends ESignal, Payload extends {}> = {
    (target: Target): Signal_ListenControled_SubReturn<Payload>
}

export type Signal_ListenControled_Config<Payload extends {}> = {
    readonly init_payload?: Payload | null
    readonly init_cleanup_update?: VoidFunction | null

    readonly emit?: boolean
    readonly sub_config?: Signal_SubConfig
}

export type Signal_ListenControled_Controls<Payload extends {}> = {
    readonly payload: Payload | null
    readonly cleanup_target: VoidFunction
    readonly cleanup_update: VoidFunction | null
}

export type Signal_ListenControled_Params<Target extends ESignal, Payload extends {}> = {
    readonly target: Target
    readonly config?: Signal_ListenControled_Config<Payload>
    readonly listener: Signal_ListenControled_Sub<Target, Payload>
}

export const signal_listen_controled = function <Target extends ESignal, Payload extends {}>(
    params: Signal_ListenControled_Params<Target, Payload>
): Signal_ListenControled_Controls<Payload> {
    const controls: Mutable<Signal_ListenControled_Controls<Payload>> = {
        payload: params.config?.init_payload ?? null,
        cleanup_update: params.config?.init_cleanup_update ?? null,

        cleanup_target: () => {
            params.target.rmsub(target_sub)
        },
    }

    const target_sub: Signal_Sub = () => {
        if (controls.cleanup_update) {
            controls.cleanup_update()

            controls.cleanup_update = null
        }

        const sub_result = params.listener(params.target)

        controls.payload = sub_result.payload ?? null
        controls.cleanup_update = sub_result.cleanup_update ?? null
    }

    params.target.addsub(target_sub, params.config?.sub_config)

    if (params.config?.emit) {
        target_sub()
    }

    return controls
}
