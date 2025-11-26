import { expect, test } from 'vitest'
import { paymentIDToInt } from '../page'

test('converts string "3" to integer 3', () => {
  expect(paymentIDToInt("3")).toBe(3)
})

test('converts string "9" to integer 9', () => {
  expect(paymentIDToInt("9")).toBe(9)
})