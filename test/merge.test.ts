import { signal_new_merge, signal_new_value } from "#src/index.js"
import { test, assert } from "vitest"

test("merge by outputs", () => {
    const outputs = new Array<any>()

    const root_a = signal_new_value(0)
    const root_b = signal_new_value(0)
    const root_c = signal_new_value(0)

    const merged = signal_new_merge([root_a, root_b, root_c] as const)

    const merged_sub = () => {
        outputs.push(merged.output())
    }

    merged.addsub(merged_sub)

    root_a.input(1)
    root_b.input(2)
    root_c.input(3)

    merged.rmsub(merged_sub)

    assert.deepEqual(outputs, [[1, 0, 0], [1, 2, 0], [1, 2, 3]])
})
