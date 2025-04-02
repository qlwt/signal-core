export type Batcher = {
    /**
        * schedules callback to microtask with Promise.resolve().then()
        * on microtask - call batch_sync with all scheduled callbacks
    */
    batch_microtask(callback: VoidFunction): void
    /**
        * sync executes callback in batch mode 
        * then sync executes queue
    */
    batch_sync(callback: VoidFunction): void
    /** if in batch mode - adds callback to queue, else - sync execute callback */
    schedule(callback: VoidFunction): void
}

const batcher_new = (): Batcher => {
    let batchmode: boolean = false

    const schedule_queue = new Array<VoidFunction>()
    const microtask_queue = new Array<VoidFunction>()

    const queue_emit = () => {
        while (schedule_queue.length > 0) {
            const sub = schedule_queue.shift()!

            sub()
        }
    }

    const result: Batcher = {
        schedule: effect => {
            if (batchmode) {
                {
                    const sub_index = schedule_queue.indexOf(effect)

                    if (sub_index !== -1) {
                        schedule_queue.splice(sub_index, 1)
                    }
                }

                schedule_queue.push(effect)
            } else {
                effect()
            }
        },

        batch_sync: effect => {
            if (batchmode) {
                effect()

                return
            }

            batchmode = true

            effect()

            {
                batchmode = false

                queue_emit()
            }
        },

        batch_microtask: effect => {
            microtask_queue.push(effect)

            if (microtask_queue.length === 1) {
                Promise.resolve().then(() => {
                    const callbacks = microtask_queue.splice(0)

                    result.batch_sync(() => {
                        for (const callback of callbacks) {
                            callback()
                        }
                    })
                })
            }
        }
    }

    return result
}

export const batcher = batcher_new()
