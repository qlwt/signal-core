# @qyu/signal-core

Definition and implementation of Signals

## Signal definition

- `Signal` is an `Observable State`, that supports editing state, getting saved state and listening to changes
- `OSignal` is a readonly version of `Signal`, that does not support editing
- `ESignal` is a stateless version of `OSignal`, that only allows observing events
- `Signal` extends `OSignal` extends `ESignal`

### Basic Usage

- Use `signal_new_value` to create `Signal`
- Use `esignal_new_manual` to create a triggerable event

```typescript
import * as sc from "@qyu/signal-core"

const state = sc.signal_new_value(0)

// subscriptions accept no parameters and return no value
const sub = function () {
    // you retrieve the state inside of the sub instead of recieving it as a parameter
    console.log(state.output())
}

state.addsub(sub)

// does not execute sub on attach, so you do it youself
// prints "0"
sub()

// prints "1"
state.input(1)

state.rmsub(sub)
```

### Improving Experience

Using `signal_listen` or `signal_listen_controled` simplifies the process

```typescript
import * as sc from "@qyu/signal-core"

const state = sc.signal_new_value(0)

{
    // prints "Update: 0"
    const cleanup = sc.signal_listen({
        target: state,
        config: { emit: true, },

        listener: () => {
            const state_o = state.output()

            console.log(`Update: ${state_o}`)

            return () => {
                console.log(`Cleanup: ${state_o}`)
            }
        },
    })

    // prints "Cleanup: 0", "Update: 1"
    state.input(1)

    // prints "Cleanup: 1"
    cleanup()
}

{
    // in case you need more control over the cleanup
    // prints "Update: 0"
    const controls = sc.signal_listen_controled({
        target: state,
        config: { emit: true, },

        listener: () => {
            const state_o = state.output()

            console.log(`Update: ${state_o}`)

            return {
                payload: {
                    value: state_o,
                },

                cleanup_update: () => {
                    console.log(`Cleanup: ${state_o}`)
                },
            }
        },
    })

    // prints "Cleanup: 0", "Update: 1"
    state.input(1)

    // prints { value: 1 }
    console.log(controls.payload)

    // does not execute update-level cleanup, just detaches the listener
    controls.cleanup_target()

    // prints "Cleanup: 1"
    controls.cleanup_update?.()
}
```

## Transforming the State

- Naming Convention for all `Signal Constructors` is `{signal_kind}_new_{action_kind}`
- All `Transformer Signals` are lazy, meaning they do nothing until you add subscriptions

```typescript
import * as sc from "@qyu/signal-core"

const width = sc.signal_new_value(50)
const height = sc.signal_new_value(100)

// osignal_new accept Signal, as Signal extends OSignal
const area = sc.osignal_new_pipe(
    sc.osignal_new_merge([width, height] as const),
    ([width_o, height_o]) => {
        return width_o * height_o
    },
)

// prints "5000"
sc.signal_listen({
    target: area,
    config: { emit: true, },

    listener: () => {
        console.log(area.output()) 
    }, 
})

// prints "10000"
width.input(100)

// prints "5000"
height.input(50)
```

## List of Core Transformers

- Most transformers are implemented for all kinds of `Signals`
- `pipe` for `OSignal` transforms output, `pipe`, `pipei` and `pipeo` for `Signal` transform input and output
- `merge` merges `Signals` of the same kind together
- `mergemap` merges an Object of like-kinded `Signals` together
- `flat` transforms `OSignal<ChildSignal>` to just `ChildSignal`
- `memo` allows memorizing output and removing unnecessary subscription calls
- `listpipe` transforms a list, caching each values so it is not recalculated again later
- `merge_pick`, `mergemap_pick` uses conditional types to determine if value is a `Signal` or static
- `flat_pick` uses conditional type to determine wether it should flatten the output or leave it as is
- `listpipe_pick` uses conditional type to determine wether mapped value should be included in the resulting list

```typescript
import * as sc from "@qyu/signal-core"

const width = sc.signal_new_value(50)
const height = sc.signal_new_value(100)

const dimension_kind = sc.signal_new_value<"width" | "height">("width")

// OSignal<Signal<number>>
const dimension_raw = sc.osignal_new_pipe(dimension_kind, kind_o => {
    if (kind_o === "width") {
        return width
    }

    return height
})

// OSignal<number>
const dimension = sc.osignal_new_flat(dimension_raw)

dimension.addsub(() => {
    console.log(dimension.output())
})

// prints "50"
console.log(dimension.output())

// prints "100"
dimension_kind.input("height")

// prints "150"
height.input(150)
```

```typescript
import * as sc from "@qyu/signal-core"

const width = sc.signal_new_value(50)
const height = sc.signal_new_value(100)

const dimension_kind = sc.signal_new_value<"width" | "height" | "none">("width")

const dimension_raw = sc.osignal_new_pipe(dimension_kind, kind_o => {
    if (kind_o === "width") {
        return {
            pick: true,
            value: width,
        } as const
    }

    if (kind_o === "height") {
        return {
            pick: true,
            value: height,
        } as const
    }

    return {
        pick: false,
        value: null
    } as const
})

// OSignal<number | null>
const dimension = sc.osignal_new_flat_pick(dimension_raw)

dimension.addsub(() => {
    console.log(dimension.output())
})

// prints "50"
console.log(dimension.output())

// prints "100"
dimension_kind.input("height")

// prints "150"
height.input(150)

// prints "null"
dimension_kind.input("none")
```

## Memorizing

- `memo` accepts comparator to determine if value have changed, default comparator is `Object.is`
- Providing `null` prevent value from beeing recalculated when dependencies did not change
- When providing `null`, subs will stil fire on every change

```typescript
import * as sc from "@qyu/signal-core"

const state = sc.signal_new_value(0)

const data = sc.osignal_new_pipe(state, state_o => {
    return Array.from({ length: state_o, }, (_, i) => i)
})

// here data is changing each time state changes, so comparing it a waste of CPU
const data_memoed = sc.osignal_new_memo(data, null)

// true
console.log(data_memoed.output() === data_memoed.output())
```

## Batching

- `batcher` is exposed for batching purposes
- `.batch_sync(cb)` executes `cb`, will defer sub-calls until the end of batch-cycle and eliminate repeated calls
- `.batch_microtask(cb)` will defer execution of `cb` until next microtask and batch all scheduled callbacks

```typescript
import * as sc from "@qyu/signal-core"

const state = sc.signal_new_value(0)

sc.signal_listen({
    target: state,
    listener: () => console.log(state.output()), 
})

// prints "1"
state.input(1)
// prints "2"
state.input(2)

// prints "4" after callback
sc.batcher.batch_sync(() => {
    state.input(3)
    state.input(4)
})

// prints "6" as-soon-as-possible after syncronous code execution is finished
sc.batcher.batch_microtask(() => {
    state.input(5)
    state.input(6)
})

// prints "4"
// previous callback is not yet executed, because it is asynchronous
console.log(state.output())
```
