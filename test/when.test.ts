import { osignal_new_pipe, signal_new_value, type PickWrapper_Fail, type PickWrapper_Fallback, type PickWrapper_Success } from "#src/index.js"
import { osignal_when } from "#src/osignal/when.js"
import { osignal_when_pick } from "#src/osignal/when_pick.js"
import { test, assert } from "vitest"

test("osignal_when empty", () => {
    const outputs: any[] = []
    const expectations: any[] = []

    const root = signal_new_value(0)

    osignal_when(
        osignal_new_pipe(root, n => n === 0 ? null : n),
        n => outputs.push(n)
    )

    root.input(0)

    assert.deepStrictEqual(outputs, expectations)
})

test("osignal_when trigger", () => {
    const outputs: any[] = []
    const expectations: any[] = []

    const root = signal_new_value(0)

    osignal_when(
        osignal_new_pipe(root, n => n === 0 ? null : n),
        n => outputs.push(n)
    )

    root.input(0)

    root.input(1)
    expectations.push(1)

    root.input(2)

    assert.deepStrictEqual(outputs, expectations)
})

test("osignal_when noemit", () => {
    const outputs: any[] = []
    const expectations: any[] = []

    const root = signal_new_value(-1)

    osignal_when(
        osignal_new_pipe(root, n => n === 0 ? null : n),
        n => outputs.push(n),
        {
            noemit: true,
        }
    )

    root.input(0)

    root.input(1)
    expectations.push(1)

    root.input(2)

    assert.deepStrictEqual(outputs, expectations)
})

test("osignal_when_pick empty", () => {
    const outputs: any[] = []
    const expectations: any[] = []

    const root = signal_new_value(0)

    osignal_when_pick(
        osignal_new_pipe(root, n => ({
            pick: n !== 0, value: n
        } satisfies PickWrapper_Success<number> | PickWrapper_Fallback<number>)),
        n => outputs.push(n)
    )

    root.input(0)

    assert.deepStrictEqual(outputs, expectations)
})

test("osignal_when trigger", () => {
    const outputs: any[] = []
    const expectations: any[] = []

    const root = signal_new_value(0)

    osignal_when_pick(
        osignal_new_pipe(root, n => ({
            pick: n !== 0, value: n
        } satisfies PickWrapper_Success<number> | PickWrapper_Fallback<number>)),
        n => outputs.push(n)
    )

    root.input(0)

    root.input(1)
    expectations.push(1)

    root.input(2)

    assert.deepStrictEqual(outputs, expectations)
})

test("osignal_when_pick noemit", () => {
    const outputs: any[] = []
    const expectations: any[] = []

    const root = signal_new_value(-1)

    osignal_when_pick(
        osignal_new_pipe(root, n => ({
            pick: n !== 0, value: n
        } satisfies PickWrapper_Success<number> | PickWrapper_Fallback<number>)),
        n => outputs.push(n),
        {
            noemit: true,
        }
    )

    root.input(0)

    root.input(1)
    expectations.push(1)

    root.input(2)

    assert.deepStrictEqual(outputs, expectations)
})
