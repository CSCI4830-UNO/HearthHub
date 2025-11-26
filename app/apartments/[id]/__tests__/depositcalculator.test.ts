import { expect, test } from 'vitest'
import { depositFee } from '../page'

test('multiplies 2300 * .4 to equal 920, then adds 920 + 2300 to equal 3220', () => {
  expect(depositFee(2300, .4)).toBe(3220)
})