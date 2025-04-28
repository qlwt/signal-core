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
    // will ignore batching
    instant?: boolean
}

interface ESignal {
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

### Prevent unnecessary updates

```typescript
const root_1 = signal_new_value(0)

// do not update if value is the same as it was
const signal_memoed = signal_new_memo(root_1, Object.is)
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
const attachment = attachment_new_lazy(
    () => {
        console.log("Attachment activation")
    },
    () => {
        console.log("Attachment cleanup")
    }
)

interface Emitter {
    emit(): void
    submap(): Map<Signal_Sub, Signal_SubConfig>
    rmsub(sub: Signal_Sub): void
    addsub(sub: Signal_Sub, config?: Signal_SubConfig): void
}

interface Attachment {
    emit(): void
    active(): boolean
    rmsub(sub: Signal_Sub): void
    addsub(sub: Signal_Sub, config?: Signal_SubConfig): void
}
```

```typescript
// special signal that adds lazy sub to source
const osignal_new_special = function <O>(src: OSignal<O>): OSignal<O> {
    const src_sub = () => {
        attachment.emit()
    }

    const src_lazysub = () => {
        console.log("lazysub")
    }

    const attachment = attachment_new_lazy(
        () => {
            // instant: true to prevent batching. Expected for all child signals to do that
            src.addsub(src_sub, { instant: true })
            src.addsub(src_lazysub)
        },
        () => {
            src.rmsub(src_sub)
            src.rmsub(src_lazysub)
        }
    )

    return {
        addsub(sub, config) {
            attachment.addsub(sub, config)
        },
        
        rmsub(sub) {
            attachment.rmsub(sub)
        },

        output() {
            return src.output()
        }
    }
}
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

// Batch Test should only be printed once
root_1.input(5)
```

## Batcher itself is accessable through batcher import

```typescript
import { batcher } from "@qyu/signal-core"

interface Batcher {
    // emits callback in batch mode, emits queue syncronously
    batch_sync(callback: VoidFunction): void
    // schedules callback to microtask (Promise.resolve().then())
    // on microtask - emit all schedulled callback in batch_sync
    // calling batch_microtask(() => signal.input(1)) will not update signal.output() immediately
    batch_microtask(callback: VoidFunction): void
    // if in batch mode - add callback to queue, else - emit callback
    schedule(callback: VoidFunction): void
}
```
