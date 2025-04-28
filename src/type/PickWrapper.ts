export type PickWrapper_Success<SuccessValue = any> = {
    readonly pick: true
    readonly value: SuccessValue
}

export type PickWrapper_Fallback<FallbackValue = any> = {
    readonly pick: false
    readonly value: FallbackValue
}

export type PickWrapper_Fail = {
    readonly pick: false
}

export type PickWrapper_Success_Infer<Src extends PickWrapper> = (
    Src extends PickWrapper_Success ? Src["value"] : never
)

export type PickWrapper_Fallback_Infer<Src extends PickWrapper> = (
    Src extends PickWrapper_Fallback ? Src["value"] : never
)

export type PickWrapper<SuccessValue = any, FallbackValue = any> = (
    | PickWrapper_Success<SuccessValue>
    | PickWrapper_Fallback<FallbackValue>
)

export type PickWrapperExpected<SuccessValue = any> = (
    | PickWrapper_Fail
    | PickWrapper_Success<SuccessValue>
)
