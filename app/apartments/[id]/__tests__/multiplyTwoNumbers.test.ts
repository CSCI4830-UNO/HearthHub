import { expect, test } from 'vitest'
import { advancedPayment } from '../page'

test('multiplies 1500 * 2 to equal 3000', () => {
  expect(advancedPayment(1500, 2)).toBe(3000)
})

test('multiplies 2300 * 3 to equal 6900', () => {
  expect(advancedPayment(2300, 3)).toBe(6900)
})