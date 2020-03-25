import React, { useState, useEffect, useCallback, useMemo } from 'react'
import 'styled-components/macro'
import styled from 'styled-components'
import AccountModule from 'components/converter/AccountModule'
import Converter from 'components/converter/Converter'
import {
  useConverterStatus,
  CONVERTER_STATUSES,
} from 'components/converter/converter-status'
import Navbar from 'components/SplitScreen/Navbar'
import SplitScreen from 'components/SplitScreen/SplitScreen'
import Logo from 'components/Logo/Logo'
import AmountInput from 'components/AmountInput/AmountInput'
import {
  useBondingCurvePrice,
  useTokenDecimals,
  useOpenOrder,
  useClaimOrder,
} from 'lib/web3-contracts'
import { formatUnits, parseUnits } from 'lib/web3-utils'
import { useWeb3Connect } from 'lib/web3-connect'
import { bigNum } from 'lib/utils'

const options = ['ANT', 'ANJ']

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

function useConvertInputs(otherSymbol, forwards = true) {
  const [inputValueAnj, setInputValueAnj] = useState('')
  const [inputValueOther, setInputValueOther] = useState('')
  const [amountAnj, setAmountAnj] = useState(bigNum(0))
  const [amountOther, setAmountOther] = useState(bigNum(0))
  const [editing, setEditing] = useState(null)
  const {
    loading: bondingPriceLoading,
    price: bondingCurvePrice,
  } = useBondingCurvePrice(amountOther, forwards)
  const anjDecimals = useTokenDecimals('ANJ')
  const otherDecimals = useTokenDecimals(otherSymbol)

  // convertFromAnj is used as a toggle to execute a conversion to or from ANJ.
  const [convertFromAnj, setConvertFromAnj] = useState(false)

  // Reset the inputs anytime the selected token changes
  useEffect(() => {
    setInputValueOther('')
    setInputValueAnj('')
    setAmountAnj(bigNum(0))
    setAmountOther(bigNum(0))
  }, [otherSymbol])

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

    setAmountAnj(amount)
    setInputValueAnj(
      formatUnits(amount, { digits: anjDecimals, truncateToDecimalPlace: 8 })
    )
  }, [
    amountOther,
    anjDecimals,
    bondingCurvePrice,
    bondingPriceLoading,
    convertFromAnj,
    editing,
    otherDecimals,
  ])

  // Calculate the other amount from the ANJ amount
  useEffect(() => {
    if (
      anjDecimals === -1 ||
      otherDecimals === -1 ||
      !convertFromAnj ||
      editing === 'other'
    ) {
      return
    }

    const amount = amountOther

    setAmountOther(amount)
    setInputValueOther(formatUnits(amount, { digits: otherDecimals }))
  }, [
    amountAnj,
    amountOther,
    anjDecimals,
    convertFromAnj,
    editing,
    otherDecimals,
  ])

  // Alternate the comma-separated format, based on the fields focus state.
  const setEditModeOther = useCallback(
    editMode => {
      setEditing(editMode ? 'other' : null)
      setInputValueOther(
        formatUnits(amountOther, {
          digits: otherDecimals,
          commas: !editMode,
        })
      )
    },
    [amountOther, otherDecimals]
  )

  const setEditModeAnj = useCallback(
    editMode => {
      setEditing(editMode ? 'anj' : null)
      setInputValueAnj(
        formatUnits(amountAnj, {
          digits: anjDecimals,
          commas: !editMode,
        })
      )
    },
    [amountAnj, anjDecimals]
  )

  const handleOtherInputChange = useCallback(
    event => {
      setConvertFromAnj(false)

      if (otherDecimals === -1) {
        return
      }

      const parsed = parseInputValue(event.target.value, otherDecimals)
      if (parsed !== null) {
        setInputValueOther(parsed.inputValue)
        setAmountOther(parsed.amount)
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
        setInputValueAnj(parsed.inputValue)
        setAmountAnj(parsed.amount)
      }
    },
    [anjDecimals]
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
    amountOther,
    amountAnj,
    // Event handlers to bind the inputs
    bindOtherInput,
    bindAnjInput,
    // The value to be used for inputs
    inputValueAnj:
      bondingPriceLoading && !convertFromAnj && editing !== 'anj'
        ? 'Loading…'
        : inputValueAnj,
    inputValueOther,
  }
}
export default () => {
  const [selectedOption, setSelectedOption] = useState(0)
  const [inverted, setInverted] = useState(false)
  const forwards = useMemo(() => !inverted, [inverted])
  const openOrder = useOpenOrder()
  const claimOrder = useClaimOrder()
  const {
    amountOther,
    bindOtherInput,
    inputValueAnj,
    inputValueOther,
  } = useConvertInputs(options[selectedOption], forwards)

  const { account } = useWeb3Connect()
  const inputDisabled = useMemo(() => !Boolean(account), [account])

  const converterStatus = useConverterStatus()
  const handleInvert = useCallback(() => {
    setInverted(v => !v)
    setSelectedOption(option => (option + 1) % 2)
  }, [])

  const handleConvert = useCallback(async () => {
    converterStatus.setStatus(CONVERTER_STATUSES.SIGNING)

    // try {
    //   const tx = await openOrder(amountOther, forwards)
    //   converterStatus.setStatus(CONVERTER_STATUSES.PENDING)
    //   await tx.wait()
    //   const finalTx = await claimOrder(tx.hash, forwards)
    //   await finalTx.wait()
    //   converterStatus.setStatus(CONVERTER_STATUSES.SUCCESS)
    // } catch (err) {
    //   if (process.env.NODE_ENV === 'production') {
    //     Sentry.captureException(err)
    //   }
    //   console.log(err)
    //   converterStatus.setStatus(CONVERTER_STATUSES.ERROR)
    // }
    // }, [amountOther, forwards, converterStatus])
  }, [converterStatus])

  return (
    <div
      css={`
        position: relative;
        height: 100vh;
      `}
    >
      <Navbar inverted={inverted} />
      <SplitScreen
        inverted={inverted}
        opened={converterStatus.status !== CONVERTER_STATUSES.FORM}
        onConvert={handleConvert}
        onInvert={handleInvert}
        primary={
          inverted ? (
            <AmountInput
              symbol="ANJ"
              color={false}
              value={inputValueOther}
              disabled={inputDisabled}
              {...bindOtherInput}
            />
          ) : (
            <AmountInput
              symbol="ANT"
              color={false}
              value={inputValueOther}
              disabled={inputDisabled}
              {...bindOtherInput}
            />
          )
        }
        secondary={
          <div
            css={`
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            {inverted ? (
              <AmountInput
                symbol="ANT"
                color={true}
                value={inputValueAnj}
                onChange={() => null}
              />
            ) : (
              <AmountInput
                symbol="ANJ"
                color={true}
                value={inputValueAnj}
                onChange={() => null}
              />
            )}
            <Button
              onClick={handleConvert}
              css={`
                width: 90%;
              `}
            >
              Convert
            </Button>
          </div>
        }
        reveal={
          converterStatus.status === CONVERTER_STATUSES.FORM ? null : (
            <Converter />
          )
        }
      />
    </div>
  )
}

const Button = styled.button`
  background: linear-gradient(189.76deg, #ffb36d 6.08%, #ff8888 93.18%);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border: solid 0px transparent;
  border-radius: 6px;
  color: white;
  width: 100%;
  min-width: 330px;
  max-width: 470px;
  height: 52px;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  &:disabled,
  &[disabled] {
    opacity: 0.5;
    cursor: inherit;
  }
`
