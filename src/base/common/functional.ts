/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function once<T extends Function>(this: any, fn: T): T {
  const _this = this
  let didCall = false
  let result: any

  return (function() {
    if (didCall) {
      return result
    }

    didCall = true
    result = fn.apply(_this, arguments)

    return result
  } as any) as T
}

export function switcher<A>(
  base: A,
  multimatch?: boolean
): <F, B extends A>(target: B, exec: F) => F extends () => infer V ? V : any
export function switcher<A>(
  base: A,
  compare?: (base: A, target: any) => boolean,
  multimatch?: boolean
): <F>(target: any, exec: F) => F extends () => infer V ? V : any
export function switcher(...args: any[]) {
  let [base, compare, multimatch] = args

  if (typeof compare === 'function') {
    if (typeof multimatch !== 'boolean') multimatch = false
  } else if (typeof compare === 'boolean') {
    multimatch = compare
    compare = (a, b) => a === b
  } else {
    multimatch = false
    compare = (a, b) => a === b
  }

  let matched = false
  let matchedValue: any = undefined
  function when(target, exec) {
    if (matched && !multimatch) return matchedValue
    const pass = compare(base, target)
    if (pass) {
      matched = true
      matchedValue = exec()
      return matchedValue
    }
  }

  return when
}
