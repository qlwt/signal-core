export type Batcher_ScheduleConfig = {
    readonly id?: string
    readonly order?: number | false
    readonly blocked_new?: () => boolean
}

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
    batch_sync<T>(callback: () => T): T
    /** if in batch mode - adds callback to queue, else - sync execute callback */
    schedule(callback: VoidFunction, config?: Batcher_ScheduleConfig): void
    /** expected to be used for any effect, that changes values, on which signals rely */
    change(callback: VoidFunction): void

    id: () => Symbol
    modecheck_batch: () => boolean
}

type EffectNode = {
    readonly effect: VoidFunction
    readonly config?: Batcher_ScheduleConfig
}

type LinkList_Node<T> = {
    value: T
    deleted: boolean
    left: LinkList_Node<T> | null
    right: LinkList_Node<T> | null
}

type Schedule = {
    list_last: LinkList_Node<EffectNode> | null
    list_first: LinkList_Node<EffectNode> | null

    readonly priority: number
    readonly list_idx: WeakMap<VoidFunction, LinkList_Node<EffectNode>>
}

const batcher_new = (): Batcher => {
    let id = Symbol()
    let repeats = new WeakSet<VoidFunction>()

    let batchmode: boolean = false

    const sch_list = new Array<Schedule>()
    const microtask_queue = new Array<VoidFunction>()

    const queue_emit = () => {
        while (sch_list.length > 0) {
            const sch = sch_list[0]!

            if (sch.list_first) {
                const node = sch.list_first.value

                if (sch.list_first.right) {
                    const first = sch.list_first
                    const right = sch.list_first.right

                    right.left = null
                    first.deleted = true
                    sch.list_first = right

                    first.right = null
                } else {
                    sch_list.shift()
                }

                if (!repeats!.has(node.effect)) {
                    if (!node.config?.blocked_new?.()) {
                        repeats!.add(node.effect)

                        node.effect()
                    }
                }
            } else {
                sch_list.shift()
            }
        }
    }

    const result: Batcher = {
        modecheck_batch: () => {
            return batchmode
        },

        id: () => {
            return id
        },

        change: effect => {
            id = Symbol()
            repeats = new WeakSet()

            effect()
        },

        schedule: (effect, config) => {
            if (config?.order === false) {
                if (!repeats.has(effect) || !config.blocked_new?.()) {
                    repeats.add(effect)

                    effect()
                }

                return
            }

            if (batchmode) {
                const nconfig_priority = config?.order ?? 0

                let sch: Schedule | null = null

                for (let i = 0; i < sch_list.length; ++i) {
                    const i_sch = sch_list[i]!

                    if (nconfig_priority === i_sch.priority) {
                        sch = i_sch

                        break
                    } else if (nconfig_priority > i_sch.priority) {
                        sch = {
                            list_last: null,
                            list_first: null,
                            list_idx: new WeakMap(),
                            priority: nconfig_priority,
                        }

                        sch_list.splice(i, 0, sch)

                        break
                    }
                }

                if (sch === null) {
                    sch = {
                        list_last: null,
                        list_first: null,
                        list_idx: new WeakMap(),
                        priority: nconfig_priority,
                    }

                    sch_list.push(sch)
                }

                {
                    const target = sch.list_idx.get(effect)

                    if (target && !target.deleted) {
                        if (target === sch.list_last) {
                            return
                        }

                        if (target.left) {
                            target.left.right = target.right
                        } else {
                            sch.list_first = target.right
                        }

                        if (target.right) {
                            target.right.left = target.left
                        }
                    }

                    if (sch.list_last) {
                        sch.list_last.right = {
                            left: sch.list_last,
                            right: null,
                            deleted: false,
                            value: {
                                effect,
                                config,
                            },
                        }

                        sch.list_last = sch.list_last.right
                    } else {
                        sch.list_first = {
                            left: null,
                            right: null,
                            deleted: false,

                            value: {
                                effect,
                                config,
                            },
                        }

                        sch.list_last = sch.list_first
                    }

                    sch.list_idx.set(effect, sch.list_last)

                }
            } else {
                if (!config?.blocked_new?.()) {
                    effect()
                }
            }
        },

        batch_sync: effect => {
            if (batchmode) {
                return effect()
            }

            batchmode = true

            const result = effect()

            {
                queue_emit()

                batchmode = false
            }

            return result
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
