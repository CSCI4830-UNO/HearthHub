import { expect, test } from 'vitest'
import { paymentSum } from '../page'

test('adds 5 + 6 to equal 11', () => {
  expect(paymentSum(5, 6)).toBe(11)
})

test('adds 2 + 26 to equal 28', () => {
  expect(paymentSum(2, 26)).toBe(28)
})