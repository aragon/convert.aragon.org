import { formatUnits, parseUnits } from './web3-utils'
import { bigNum } from './utils'

test('formatUnits() formats the provided value', () => {
  const values = [
    ['1000000000000000000', '1'],
    ['12000000000000000000', '12'],
    ['123000000000000000000', '123'],
    ['12345000000000000000000', '12,345'],
    ['123000000000000000000', '123'],
    ['9999999999000000000000000000', '9,999,999,999'],
    ['123020000000000000000', '123.02'],
    ['123100000000000000000', '123.1'],
    ['123000000000000000000', '123'],
  ]
  values.forEach(([input, output]) => {
    expect(formatUnits(bigNum(input), { digits: 18 })).toBe(output)
  })
})

test('formatUnits() formats the provided value with decimal truncation', () => {
  const values = [
    ['1000000000000000000', '1'],
    ['123000000000000000000', '123'],
    ['9999999999000000000000000000', '9,999,999,999'],
    // Use default test truncation
    ['123100000000000000000', '123.1'],
    ['123023450000000000000', '123.023'],
    ['123000002345000000000', '123'],
    // Trucate to 0 decimals
    [['123100000000000000000', 0], '123'],
    [['123023450000000000000', 0], '123'],
    [['123000002345000000000', 0], '123'],
  ]
  values.forEach(([inputs, output]) => {
    const [input, truncate = 3] = Array.isArray(inputs) ? inputs : [inputs]
    expect(formatUnits(bigNum(input), { digits: 18, truncateToDecimalPlace: truncate })).toBe(output)
  })
})

test('parseUnits() creates a BigNumber from the provided value', () => {
  const values = [
    ['1', '1000000000000000000'],
    ['12', '12000000000000000000'],
    ['123', '123000000000000000000'],
    ['12345', '12345000000000000000000'],
    ['123,45', '12345000000000000000000'],
    ['123,', '123000000000000000000'],
    ['123 ', '123000000000000000000'],
    [' 123 ', '123000000000000000000'],
    [' 9999999999 ', '9999999999000000000000000000'],
    ['9,999,999,999', '9999999999000000000000000000'],
    ['123.02', '123020000000000000000'],
    ['123.', '123000000000000000000'],
    ['123.1', '123100000000000000000'],
    ['123.10', '123100000000000000000'],
    ['123.0', '123000000000000000000'],
    ['123.0', '12300000000000000', 14],
  ]
  values.forEach(([input, output, digits = 18]) => {
    expect(parseUnits(input, { digits }).toString()).toBe(
      bigNum(output).toString()
    )
  })
})
