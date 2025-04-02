import { signal_new_flat } from "#src/signal/new/flat.js"
import { signal_new_pipeo } from "#src/signal/new/pipeo.js"
import { signal_new_value } from "#src/signal/new/value.js"
import { test, assert } from "vitest"

enum RootSwitch {
    Number,
    String,
    Undefined
}

test("flat by outputs", () => {
    const outputs = new Array<any>()

    const root = signal_new_value(RootSwitch.Number)
    const root_a = signal_new_value(0)
    const root_b = signal_new_value("b")

    const flatten = signal_new_flat(
        signal_new_pipeo(
            root,
            root_o => {
                switch (root_o) {
                    case RootSwitch.Number:
                        return root_a
                    case RootSwitch.String:
                        return root_b
                    case RootSwitch.Undefined:
                        return undefined
                }
            }
        )
    )

    const flatten_sub = () => {
        outputs.push(flatten.output())
    }

    flatten.addsub(flatten_sub)

    // sends update
    root_a.input(1)
    root_a.input(2)
    // does nothing
    root_b.input("b")
    root_b.input("c")

    root.input(RootSwitch.String)

    // does nothing
    root_a.input(3)
    root_a.input(4)
    // sends update
    root_b.input("d")
    root_b.input("e")

    root.input(RootSwitch.Undefined)

    // does nothing
    root_a.input(5)
    root_a.input(6)
    root_b.input("f")
    root_b.input("g")

    flatten.rmsub(flatten_sub)

    assert.deepStrictEqual(outputs, [1, 2, "c", "d", "e", undefined])
})
