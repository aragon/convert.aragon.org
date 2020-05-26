import { useState, useEffect, useCallback, useMemo } from 'react'
import { bigNum } from 'lib/utils'
import { useBondingCurvePrice, useTokenDecimals } from 'lib/web3-contracts'
import { formatUnits, parseUnits } from 'lib/web3-utils'

// Filters and parse the input value of a token amount.
// Returns a BN.js instance and the filtered value.
function parseInputValue(inputValue, decimals) {
  if (decimals === -1) {
    return null
  }

  inputValue = inputValue.trim()

  // amount is the parsed value (BN.js instance)
  const amount = parseUnits(inputValue, { digits: decimals })

  if (amount.lt(0)) {
    return null
  }

  return { amount, inputValue }
}

export function useConvertInputs(otherSymbol, toAnj = true) {
  const [inputValueRecipient, setInputValueRecipient] = useState('')
  const [inputValueSource, setInputValueSource] = useState('0.0')
  const [amountRecipient, setAmountRecipient] = useState(bigNum(0))
  const [amountSource, setAmountSource] = useState(bigNum(0))
  const [editing, setEditing] = useState(null)
  const {
    loading: bondingPriceLoading,
    price: bondingCurvePrice,
  } = useBondingCurvePrice(amountSource, toAnj)
  const anjDecimals = useTokenDecimals('ANJ')
  const otherDecimals = useTokenDecimals(otherSymbol)

  // convertFromAnj is used as a toggle to execute a conversion to or from ANJ.
  const [convertFromAnj, setConvertFromAnj] = useState(false)

  const resetInputs = useCallback(() => {
    setInputValueSource('')
    setInputValueRecipient('')
    setAmountRecipient(bigNum(0))
    setAmountSource(bigNum(0))
  }, [])

  // Reset the inputs anytime the selected token changes
  useEffect(() => {
    resetInputs()
  }, [otherSymbol, resetInputs])

  // Calculate the ANJ amount from the other amount
  useEffect(() => {
    if (
      anjDecimals === -1 ||
      otherDecimals === -1 ||
      convertFromAnj ||
      bondingPriceLoading ||
      editing === 'anj'
    ) {
      return
    }

    const amount = bondingCurvePrice

    setAmountRecipient(amount)
    setInputValueRecipient(
      formatUnits(amount, { digits: anjDecimals, truncateToDecimalPlace: 8 })
    )
  }, [
    amountSource,
    anjDecimals,
    bondingCurvePrice,
    bondingPriceLoading,
    convertFromAnj,
    editing,
    otherDecimals,
  ])

  // Alternate the comma-separated format, based on the fields focus state.
  const setEditModeOther = useCallback(
    editMode => {
      setEditing(editMode ? 'other' : null)
      setInputValueSource(
        formatUnits(amountSource, {
          digits: otherDecimals,
          commas: !editMode,
        })
      )
    },
    [amountSource, otherDecimals]
  )

  const setEditModeAnj = useCallback(
    editMode => {
      setEditing(editMode ? 'anj' : null)
      setInputValueRecipient(
        formatUnits(amountRecipient, {
          digits: anjDecimals,
          commas: !editMode,
        })
      )
    },
    [amountRecipient, anjDecimals]
  )

  const handleOtherInputChange = useCallback(
    event => {
      setConvertFromAnj(false)

      if (otherDecimals === -1) {
        return
      }

      const parsed = parseInputValue(event.target.value, otherDecimals)
      if (parsed !== null) {
        setInputValueSource(parsed.inputValue)
        setAmountSource(parsed.amount)
      }
    },
    [otherDecimals]
  )

  const handleAnjInputChange = useCallback(
    event => {
      setConvertFromAnj(true)

      if (anjDecimals === -1) {
        return
      }

      const parsed = parseInputValue(event.target.value, anjDecimals)
      if (parsed !== null) {
        setInputValueRecipient(parsed.inputValue)
        setAmountRecipient(parsed.amount)
      }
    },
    [anjDecimals]
  )

  const handleManualInputChange = useCallback(
    amount => {
      if (otherDecimals === -1) {
        return
      }

      const parsed = parseInputValue(amount, otherDecimals)
      if (parsed !== null) {
        setInputValueSource(parsed.inputValue)
        setAmountSource(parsed.amount)
      }
    },
    [otherDecimals]
  )

  const bindOtherInput = useMemo(
    () => ({
      onChange: handleOtherInputChange,
      onBlur: () => setEditModeOther(false),
      onFocus: () => setEditModeOther(true),
    }),
    [setEditModeOther, handleOtherInputChange]
  )

  const bindAnjInput = useMemo(
    () => ({
      onChange: handleAnjInputChange,
      onBlur: () => setEditModeAnj(false),
      onFocus: () => setEditModeAnj(true),
    }),
    [setEditModeAnj, handleAnjInputChange]
  )

  return {
    // The parsed amount
    amountSource,
    amountRecipient,
    // Event handlers to bind the inputs
    bindOtherInput,
    bindAnjInput,
    bondingPriceLoading,
    handleManualInputChange,
    // The value to be used for inputs
    inputValueRecipient,
    inputValueSource,
    resetInputs,
  }
}
