import { useEffect, useState } from 'react'
import { utils as EthersUtils } from 'ethers'
import { bigNum } from './utils'

const ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/

export function isAddress(address) {
  return ADDRESS_REGEX.test(address)
}

export function shortenAddress(address, charsLength = 4) {
  const prefixLength = 2 // "0x"
  if (!address) {
    return ''
  }
  if (address.length < charsLength * 2 + prefixLength) {
    return address
  }
  return (
    address.slice(0, charsLength + prefixLength) +
    '…' +
    address.slice(-charsLength)
  )
}

export function getNetworkName(chainId) {
  chainId = String(chainId)

  if (chainId === '1') return 'Mainnet'
  if (chainId === '4') return 'Rinkeby'

  return 'Unknown'
}

export function identifyProvider(provider) {
  if (provider && provider.isMetaMask) {
    return 'metamask'
  }
  return 'unknown'
}

// Converts a token value from its integer form
// into its decimal form, both as strings.
export function fromTokenInteger(value, decimals) {
  if (decimals === undefined) {
    throw new Error('Please specify the number of decimals')
  }

  value = String(value).padStart(decimals, '0')
  const decPart = value.slice(-decimals).replace(/0+$/, '')

  return (value.slice(0, -decimals) || '0') + (decPart ? `.${decPart}` : '')
}

/**
 * Convert a token into a USD price
 *
 * @param {String} symbol The symbol of the token to convert from.
 * @param {Number} decimals The amount of decimals for the token.
 * @param {BigNumber} balance The balance to convert into USD.
 */
export function useTokenBalanceToUsd(symbol, decimals, balance) {
  const [usd, setUsd] = useState('-')
  useEffect(() => {
    let cancelled = false

    fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`
    )
      .then(res => res.json())
      .then(price => {
        if (cancelled || !balance || !(parseFloat(price.USD) > 0)) {
          return
        }

        const usdDigits = 2
        const precision = 6

        const usdBalance = balance
          .mul(bigNum(parseInt(price.USD * 10 ** (precision + usdDigits), 10)))
          .div(10 ** precision)
          .div(bigNum(10).pow(decimals))

        setUsd(formatUnits(usdBalance, { digits: usdDigits }))
      })

    return () => {
      cancelled = true
    }
  }, [balance, decimals, symbol])

  return usd
}

/**
 * Parse a unit set for an input and return it as a BigNumber.
 *
 * @param {String} value Value to parse into an amount of units.
 * @param {Number} options.digits Amount of digits on the token.
 * @return {BigNumber}
 */
export function parseUnits(value, { digits = 18 } = {}) {
  value = value.replace(/,/g, '').trim()
  try {
    return EthersUtils.parseUnits(value || '0', digits)
  } catch (err) {
    return bigNum(-1)
  }
}

/**
 * Format an amount of units to be displayed.
 *
 * @param {BigNumber|String} value Amount of units to format.
 * @param {Number} options.digits Amount of digits on the token.
 * @param {Boolean} options.commas Use comma-separated groups.
 * @param {Boolean} options.replaceZeroBy The string to be returned when value is zero.
 * @param {Number} options.truncateToDecimalPlace Number of decimal places to show.
 */
export function formatUnits(
  value,
  {
    digits = 18,
    commas = true,
    replaceZeroBy = '',
    truncateToDecimalPlace,
  } = {}
) {
  if (typeof value === 'string') {
    value = bigNum(value)
  }

  if (value.lt(0) || digits < 0) {
    return ''
  }

  let valueBeforeCommas = EthersUtils.formatUnits(value.toString(), digits)

  // Replace 0 by an empty value
  if (valueBeforeCommas === '0.0') {
    return replaceZeroBy
  }

  // EthersUtils.formatUnits() adds a decimal even when 0, this removes it.
  valueBeforeCommas = valueBeforeCommas.replace(/\.0$/, '')

  if (typeof truncateToDecimalPlace === 'number') {
    const [whole = '', dec = ''] = valueBeforeCommas.split('.')
    if (dec) {
      const truncatedDec = dec
        .slice(0, truncateToDecimalPlace)
        .replace(/0*$/, '')
      valueBeforeCommas = truncatedDec ? `${whole}.${truncatedDec}` : whole
    }
  }

  return commas ? EthersUtils.commify(valueBeforeCommas) : valueBeforeCommas
}
