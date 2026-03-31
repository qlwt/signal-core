import { osignal_new_listpipe, signal_new_value } from "#src/index.js"
import { osignal_new_listpipe_pick } from "#src/osignal/new/listpipe_pick.js"
import { assert, test } from "vitest"

const uider_new = function() {
    let i = 0

    const map = new Map<unknown, number>()

    return (v: any) => {
        if (map.has(v)) {
            return map.get(v)!
        }

        map.set(v, ++i)

        return i
    }
}

test("listpipe", () => {
    const outputs = new Array<any>()
    const expectations = new Array<any>()

    const uider = uider_new()
    const root = signal_new_value([1, 2, 3])

    const piped = osignal_new_listpipe(root, n => ({
        value: n
    }))

    const sub = () => {
        outputs.push(piped.output().map(uider))
    }

    piped.addsub(sub)

    sub()
    expectations.push([1, 2, 3])

    root.input([2, 3, 1])
    expectations.push([2, 3, 1])

    root.input([1, 2, 4])
    expectations.push([1, 2, 4])

    root.input([1, 2, 3])
    expectations.push([1, 2, 5])

    assert.deepStrictEqual(outputs, expectations)
})

test("listpipe_pick", () => {
    const outputs = new Array<any>()
    const expectations = new Array<any>()

    const uider = uider_new()
    const root = signal_new_value([1, 2, null, 3, null])

    const piped = osignal_new_listpipe_pick(root, n => {
        if (n === null) {
            return {
                pick: false
            }
        }

        return {
            pick: true,

            value: {
                value: n
            }
        }
    })

    const sub = () => {
        outputs.push(piped.output().map(uider))
    }

    piped.addsub(sub)

    sub()
    expectations.push([1, 2, 3])

    root.input([2, 3, null, 1])
    expectations.push([2, 3, 1])

    root.input([1, 2, 4, null, null])
    expectations.push([1, 2, 4])

    root.input([1, 2, null, 3])
    expectations.push([1, 2, 5])

    assert.deepStrictEqual(outputs, expectations)
})
