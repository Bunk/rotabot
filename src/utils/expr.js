import lodash from 'lodash'
import expr from 'expression-eval'

export function compile (str) {
  return expr.compile(str)
}

export function evaluate (str, ctx) {
  const fn = compile(str)
  return fn({ _: lodash, ...ctx })
}

export default { compile, evaluate }
