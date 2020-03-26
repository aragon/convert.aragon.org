import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import * as Sentry from '@sentry/browser'
import { bigNum } from 'lib/utils'
import { breakpoint, GU } from 'lib/microsite-logic'
import {
  useBondingCurvePrice,
  useClaimOrder,
  useOpenOrder,
  useTokenBalance,
  useTokenDecimals,
} from 'lib/web3-contracts'
import { formatUnits, parseUnits } from 'lib/web3-utils'
import { useConverterStatus, CONVERTER_STATUSES } from './converter-status'
import ComboInput from './ComboInput'
import Token from './Token'

const large = css => breakpoint('large', css)
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

// Convert the two input values as the user types.
// The token which it is converted from is referred to as “other”.
function useConvertInputs(otherSymbol, forwards) {
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
    setInputValueAnj(formatUnits(amount, { digits: anjDecimals }))
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
        ? 'Loading...'
        : inputValueAnj,
    inputValueOther,
  }
}

function FormSection() {
  const [selectedOption, setSelectedOption] = useState(0)
  const tokenBalance = useTokenBalance(options[selectedOption])
  const openOrder = useOpenOrder()
  const claimOrder = useClaimOrder()
  const selectedTokenDecimals = useTokenDecimals(options[selectedOption])

  const converterStatus = useConverterStatus()

  const forwards = options[selectedOption] === 'ANT'

  const {
    amountOther,
    bindAnjInput,
    bindOtherInput,
    inputValueAnj,
    inputValueOther,
  } = useConvertInputs(options[selectedOption], forwards)

  const handleSubmit = async event => {
    event.preventDefault()
    converterStatus.setStatus(CONVERTER_STATUSES.SIGNING)

    try {
      const tx = await openOrder(amountOther, forwards)
      converterStatus.setStatus(CONVERTER_STATUSES.PENDING)
      await tx.wait()
      const finalTx = await claimOrder(tx.hash, forwards)
      await finalTx.wait()
      converterStatus.setStatus(CONVERTER_STATUSES.SUCCESS)
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        Sentry.captureException(err)
      }
      converterStatus.setStatus(CONVERTER_STATUSES.ERROR)
    }
  }

  const tokenBalanceError = useMemo(() => {
    if (
      amountOther &&
      amountOther.gte(0) &&
      amountOther.gt(tokenBalance) &&
      !tokenBalance.eq(-1)
    ) {
      return 'Amount is greater than balance held.'
    }

    return null
  }, [amountOther, tokenBalance])

  const disabled = Boolean(
    !inputValueOther.trim() ||
      !inputValueAnj.trim() ||
      tokenBalanceError ||
      converterStatus.status !== CONVERTER_STATUSES.FORM
  )

  const handleSelect = useCallback(
    optionIndex => setSelectedOption(optionIndex),
    []
  )

  const formattedTokenBalance = tokenBalance.eq(-1)
    ? 'Fetching…'
    : `${formatUnits(tokenBalance, {
        digits: selectedTokenDecimals,
        replaceZeroBy: '0',
      })} ${options[selectedOption]}.`

  return (
    <Form onSubmit={handleSubmit}>
      <div
        css={`
          margin-bottom: ${3 * GU}px;
        `}
      >
        <div>
          <Label>Amount of {options[selectedOption]} you want to convert</Label>
          <ComboInput
            inputValue={inputValueOther}
            options={options.map(symbol => (
              <Token symbol={symbol} />
            ))}
            onSelect={handleSelect}
            selectedOption={selectedOption}
            {...bindOtherInput}
          />
          <Info>
            <span>Balance:{` ${formattedTokenBalance}`}</span>
            {tokenBalanceError && (
              <span className="error"> {tokenBalanceError} </span>
            )}
          </Info>
        </div>
        <div>
          <InputBox>
            <Label>Amount of {forwards ? 'ANJ' : 'ANT'} you will receive</Label>
            <AdornmentBox>
              <Input value={inputValueAnj} {...bindAnjInput} />
              <Adornment>
                <Token symbol={forwards ? 'ANJ' : 'ANT'} />
              </Adornment>
            </AdornmentBox>
          </InputBox>
        </div>
      </div>

      <Button type="submit" disabled={disabled}>
        Obtain {forwards ? 'ANJ' : 'ANT'}
      </Button>
    </Form>
  )
}

const Form = styled.form`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-direction: column;
  margin-top: 130px;
  width: 100%;
  ${large('padding-right: 30px; margin-top: 0;')};
`

const Label = styled.label`
  font-size: 24px;
  line-height: 38px;
  color: #8a96a0;
  margin-bottom: 6px;

  span {
    color: #08bee5;
  }
  img {
    padding-left: 10px;
  }
`
const Info = styled.div`
  margin-top: 3px;
  margin-bottom: 12px;
  color: #212b36;
  .error {
    color: #ff6969;
  }
  .warning {
    color: #f5a623;
  }
  .insight {
    color: #516dff;
  }
`

const InputBox = styled.div`
  margin-bottom: 20px;
`
const Input = styled.input`
  width: 100%;
  height: 50px;
  padding: 6px 12px 0;
  background: #ffffff;
  border: 1px solid #dde4e9;
  color: #212b36;
  border-radius: 4px;
  appearance: none;
  font-size: 20px;
  font-weight: 400;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  -moz-appearance: textfield;
  &:focus {
    outline: none;
    border-color: #08bee5;
  }
  &::placeholder {
    color: #8fa4b5;
    opacity: 1;
  }
  &:invalid {
    box-shadow: none;
  }
`

const Button = styled.button`
  background: linear-gradient(189.76deg, #ffb36d 6.08%, #ff8888 93.18%);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border: solid 0px transparent;
  border-radius: 6px;
  color: white;
  width: 100%;
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

const Adornment = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  height: 50px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const AdornmentBox = styled.div`
  display: inline-flex;
  position: relative;
  width: 100%;
  input {
    padding-right: 39px;
  }
`

export default FormSection
