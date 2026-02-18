# @qyu/signal-core

Definition and implementation of signals + some utility functions

## Signal definition

Package defines three types of signals:
- Event Signal: does not hold any value, but allows adding and removing subsciber callbacks
- Output Signal: extends Event Signal, but also holds value, wich is readonly
- Normal Signal: extends Output Signal, but also allows sending messages

```typescript
type Signal_Sub = VoidFunction

type Signal_SubConfig = {
    // default is 0
    // execution order of subs in a batcher
    // if false - executes instantely
    order?: number | false
    // called before the execution of a sub to determain wether it should be executed
    blocked_new?: () => boolean
}

interface ESignal {
    // id of a signal, expected to change every time the value changes
    id(): Symbol
    // remove subscriber from signal
    rmsub(sub: Signal_Sub): void
    // add subscriber to signal
    addsub(sub: Signal_Sub, config?: Signal_SubConfig): void
}

interface OSignal<O> extends ESignal {
    // get signal value
    output(): O
}

interface Signal<I, O> extends OSignal {
    // input a message
    input(message: I): void
}
```

## Normally your root signal will be created with signal_new_value

```typescript
const root = signal_new_value(0)

const root_sub = () => {
    console.log(root.output())
}

root.addsub(root_sub)

// prints 10
root.input(10)

// prints 20
root.input(20)

root.rmsub(root_sub)
```

## Another common scenario is using esignal_new_manual

```typescript
const [esignal, esignal_emit] = esignal_new_manual()

esignal.addsub(() => {
    console.log("Event")
})

// prints Event
esignal_emit()
```

## Package also provides some utility functions to transform signals

### Fallback for signal value

```typescript
// signal of number | null
const root_1 = signal_new_value(Math.random() > 0.5 ? null : 0)

// signal of number
const signal_fallback = signal_new_fallback(root_1, () => 0)
```

### Merge Signals

```typescript
const root_1 = signal_new_value(0)
const root_2 = signal_new_value(0)
const root_3 = signal_new_value(0)

// signal of [number, number, number, null, undefined]
const signal_merged = signal_new_merge([root_1, root_2, root_3, null, undefined] as const)
// signal of [number, "HELLOWORLD"]
const signal_merged_pick = signal_new_merge_pick([{ pick: true, value: root_1 }, { pick: false, value: "HELLO WORLD" }] as const)
```

### Merge Map of Signals

```typescript
const root_1 = signal_new_value(0)
const root_2 = signal_new_value(0)
const root_3 = signal_new_value(0)

// signal of { root_1: number, root_2: number, root_3: number, root_4: null, root_5: undefined }
const signal_mergedmap = signal_new_mergemap({
    root_1,
    root_2,
    root_3,
    root_4: null,
    root_5: undefined 
})
// signal of { root_1: number, root_2: "HELLOWORLD" }
const signal_mergedmap = signal_new_mergemap({
    root_1: {
        pick: true,
        value: root_1 
    },
    root_2: {
        pick: false,
        value: "HELLOWORLD" 
    } 
})
```

### Transform Signal

```typescript
const root_1 = signal_new_value(0)
const root_2 = signal_new_value(0)
const root_3 = signal_new_value(0)

// transform output of signal
// also has variants of pipei to transform input and pipe to transform both
// signal of undefined or signal of number
const signal_opipe = signal_new_pipeo(root_1, d => {
    if (d > 50) {
        return root_2
    }

    if (d < 0) {
        return root_3
    }

    return undefined
})
```

### Flat nested Signals

```typescript
const root_1 = signal_new_value(0)
const root_2 = signal_new_value(0)

const signal_opipe = signal_new_pipeo(root_1, d => {
    if (d > 100) {
        return undefined
    }

    return root_2
})

const signal_opipe_pick = signal_new_pipeo(root_1, d => {
    if (d > 100) {
        return {
            pick: false,
            value: "HELLOWORLD"
        }
    }

    return {
        pick: true,
        value: root_2
    }
})

// signal of number or undefined, will update based on current target, input will be redirected to current target
const signal_flat = signal_new_flat(signal_opipe)
// this one will be signal of number | "HELLOWORLD"
const signal_flat_pick = signal_new_flat_pick(signal_opipe_pick)
```

### List pipe that only updates values that have changed

```typescript
const root = signal_new_value([0, 1, 2, 3])

const signal_listpipe = signal_new_listpipe(root, n => ({ value: n }))

const transformed_head_before = signal_listpipe.output()[0]!

signal_listpipe.input([0, 1, 2, 3, 4])

const transformed_head_after = signal_listpipe.output()[0]!

// transformer function will only be called for new unique members (in this case 4), old ones will be reused from cache
// true
console.log(transformed_head_before === transformed_head_after)
```

### Prevent unnecessary updates

```typescript
const root_1 = signal_new_value(0)

// do not update if value is the same as it was
// comparator is optional, if not provided - will update every time source is changed
// memo without comparator is useful when you just want to stabilise the value
const signal_memoed = signal_new_memo(root_1, Object.is)

// normally would always provide diferent object
const piped = osignal_new_pipe(root_1, value => {
    return {
        value
    }
})

// usage of memo without comparator
// will still trigger every time root_1 changes, but will return stable output between changes
const piped_memoed = osignal_new_memo(piped)

// false
console.log(piped.output() === piped.output())
// true
console.log(piped_memoed.output() === piped_memoed.output())
```

### Osignal and ESignal also have their own transformers

```typescript
const root_1 = signal_new_value(0)
const root_2 = signal_new_value(0)
const root_3 = signal_new_value(0)

// osignal and esignal also have those function variants where it makes sense
const osignal_pipe = osignal_new_pipe(root_1, d => d * 2)
```

## In some cases you would need signal_listen utility function

```typescript
const root = signal_new_value(0)

const unlisten = signal_listen({
    target: root,

    // optional
    config: {
        // false by default
        emit: true
    },

    listener: target => {
        console.log("effect", target.output())

        return () => {
            console.log("cleanup", target.output())
        }
    }
})
```

## You may need to create custom signals for specific needs

### Package exports some API for doing so

```typescript
const emitter = emitter_new()
// will attach with provided function when there are subs listening
// will deattach when there is none
const attachment = attachment_new_lazy({
    connection_new: (order) => {
        let id: number | null = null

        const emit = () => {
            emitter.emit(order)
        }

        return {
            attach: () => {
                console.log("Attachment activation")

                id = setInterval(() => {
                    signal_sub_emit(emit, { order: false })
                }, 1000)
            },
            detach: () => {
                console.log("Attachment cleanup")

                if (id !== null) {
                    cancelInterval(id)
                }
            }
        }
    }
})

interface Emitter {
    emit_all(): void
    emit(order: Signal_SubConfig_Order): void

    // index of subs to the order
    idxmap(): Map<Signal_Sub, Signal_SubConfig_Order>
    // index of order to the index of subs
    ordermap(): Map<Signal_SubConfig_Order, Map<Signal_Sub, Signal_SubConfig>>

    // returns order if it have been emptied (should detach)
    rmsub(sub: Signal_Sub): Signal_SubConfig_Order | null
    // returns order if it have been created (should attach)
    addsub(sub: Signal_Sub, config?: Signal_SubConfig): Signal_SubConfig_Order | null
}

interface AttachmentLazy {
    emit_all(): void
    emit(order: Signal_SubConfig_Order): void

    conmap(): Map<Signal_SubConfig_Order, AttachmentLazy_Connection>

    // get if any of the orders active
    active_any(): boolean
    // get if attachment of given order is active
    active(order: Signal_SubConfig_Order): boolean
    // get list of all currently attached orders
    active_list(): Signal_SubConfig_Order[] 

    rmsub(sub: Signal_Sub): void
    addsub(sub: Signal_Sub, config?: Signal_SubConfig): void
}
```

```typescript
// special signal that adds lazy sub to source
const osignal_new_special = function <O>(src: OSignal<O>): OSignal<O> {
    const src_lazysub = () => {
        console.log("lazysub")
    }

    const attachment = attachment_new_lazy({
        connection_new: order => {
            const src_sub = () => {
                attachment.emit(order)
            }

            return {
                attach: () => {
                    src.addsub(src_sub, { order })

                    if (attachment.conmap().size === 1) {
                        src.addsub(src_lazysub, { order: false })
                    }
                },

                detach: () => {
                    src.rmsub(src_sub)

                    if (attachment.conmap().size === 0) {
                        src.rmsub(src_lazysub)
                    }
                }
            }
        },
    })

    return {
        rmsub: attachment.rmsub,
        addsub: attachment.addsub,
        output: src.output.bind(src)
    }
}
```

### Also some debug api is exposed to test things

```typescript
const root = signal_new_value()

// will print on actions, has some additional functions that expose internal state
const debug = signal_new_debug(root, {
    // will be shown at console
    name: "root:debug",

    print: {
        // print state with actions
        state: true,
        // print on action unless marked as false
        actions_fallback: true,

        // print on action
        actions: {
            input: false,
            output: false,
        },
    }
})
```

## Updates are batched to prevent unnecessary calls

```typescript
const root_1 = signal_new_value(0)
const root_2 = signal_new_value(0)

const merged_1 = signal_new_merge([root_1, root_2] as const)
const merged_2 = signal_new_merge([root_1, merged_1] as const)

const merged_sub = () => {
    console.log("Batch Test")
}

merged_1.addsub(merged_sub)
merged_2.addsub(merged_sub)

// Batch Test will only be printed once
root_1.input(5)
```

## Batcher itself is accessable through batcher import

```typescript
import { batcher } from "@qyu/signal-core"

type Batcher_Config = {
    readonly blocked_new?: () => boolean
    readonly order?: Signal_SubConfig_Order
}

interface Batcher {
    // emits callback in batch mode, emits queue syncronously
    batch_sync(callback: VoidFunction): void
    // schedules callback to microtask (Promise.resolve().then())
    // on microtask - emit all schedulled callback in batch_sync
    // calling batch_microtask(() => signal.input(1)) will not update signal.output() immediately
    batch_microtask(callback: VoidFunction): void
    // if in batch mode - add callback to queue, else - emit callback
    schedule(callback: VoidFunction, config?: Batcher_Config): void
    // expected to be used for any effect, that changes values, on which signals rely
    change(callback: VoidFunction): void

    // the id of batched, changes every time change() is used
    id: () => Symbol
    // get if you are currently in a batch mode, only useful for debug
    modecheck_batch: () => boolean
}
```
