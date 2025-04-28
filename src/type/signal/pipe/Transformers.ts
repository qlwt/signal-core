export type SignalPipe_OTransformer<O, OT> = {
    (unprocessed: O): OT
}

export type SignalPipe_ITransformer<I, IT> = {
    (message: IT): I
}
