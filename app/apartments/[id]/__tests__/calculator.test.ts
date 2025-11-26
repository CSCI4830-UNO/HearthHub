import { expect, test } from 'vitest'
import { paymentSum } from '../page'

test('adds 5 + 6 to equal 11', () => {
  expect(paymentSum(5, 6)).toBe(11)
})