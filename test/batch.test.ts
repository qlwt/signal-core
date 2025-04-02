import { batcher, signal_new_merge, signal_new_value } from "#src/index.js"
import { test, assert } from "vitest"

test("batch.shallow by outputs", () => {
    const outputs_a = new Array<any>()
    const outputs_b = new Array<any>()
    const outputs_shared = new Array<any>()

    const roota = signal_new_value(0)
    const rootb = signal_new_value("a")

    const sub_roota = () => {
        outputs_a.push(roota.output())
    }

    const sub_rootb = () => {
        outputs_b.push(rootb.output())
    }

    const sub_shared = () => {
        outputs_shared.push([roota.output(), rootb.output()])
    }

    roota.addsub(sub_roota)
    roota.addsub(sub_shared)
    rootb.addsub(sub_rootb)
    rootb.addsub(sub_shared)

    roota.input(1)
    rootb.input("b")

    batcher.batch_sync(() => {
        roota.input(2)
        rootb.input("c")
    })

    roota.rmsub(sub_roota)
    roota.rmsub(sub_shared)
    rootb.rmsub(sub_rootb)
    rootb.rmsub(sub_shared)

    assert.deepEqual(outputs_a, [1, 2])
    assert.deepEqual(outputs_b, ["b", "c"])
    assert.deepEqual(outputs_shared, [[1, "a"], [1, "b"], [2, "c"]])
})

test("batch.deep by outputs", () => {
    const outputs = new Array<any>()

    const root_a = signal_new_value(0)
    const root_b = signal_new_value(0)
    const merged_1 = signal_new_merge([root_a, root_b] as const)
    const merged_2 = signal_new_merge([root_a, merged_1] as const)

    const sub_merged2 = () => {
        outputs.push(merged_2.output())
    }

    merged_2.addsub(sub_merged2)

    // merged2 listens to roota directly and through merged1 so updating roota with no batch will cause extra update
    root_a.input(1)

    merged_2.rmsub(sub_merged2)

    assert.deepEqual(outputs, [[1, [1, 0]]])
})

test("batch_microtask.shallow by outputs", async () => {
    const outputs_a = new Array<any>()
    const outputs_b = new Array<any>()
    const outputs_shared = new Array<any>()

    const roota = signal_new_value(0)
    const rootb = signal_new_value("a")

    const sub_roota = () => {
        outputs_a.push(roota.output())
    }

    const sub_rootb = () => {
        outputs_b.push(rootb.output())
    }

    const sub_shared = () => {
        outputs_shared.push([roota.output(), rootb.output()])
    }

    roota.addsub(sub_roota)
    roota.addsub(sub_shared)
    rootb.addsub(sub_rootb)
    rootb.addsub(sub_shared)

    roota.input(1)
    rootb.input("b")

    batcher.batch_microtask(() => {
        roota.input(2)
        rootb.input("c")
    })

    assert.deepEqual(outputs_a, [1])
    assert.deepEqual(outputs_b, ["b"])
    assert.deepEqual(outputs_shared, [[1, "a"], [1, "b"]])

    await Promise.resolve().then(() => {
        roota.rmsub(sub_roota)
        roota.rmsub(sub_shared)
        rootb.rmsub(sub_rootb)
        rootb.rmsub(sub_shared)

        assert.deepEqual(outputs_a, [1, 2])
        assert.deepEqual(outputs_b, ["b", "c"])
        assert.deepEqual(outputs_shared, [[1, "a"], [1, "b"], [2, "c"]])
    })
})
