import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import * as Sentry from '@sentry/browser'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { bigNum, usePostEmail } from 'lib/utils'
import { breakpoint, GU } from 'lib/microsite-logic'
import {
  useConvertTokenToAnj,
  useEthBalance,
  useJurorRegistryAnjBalance,
  useTokenBalance,
  useTokenDecimals,
} from 'lib/web3-contracts'
import {
  UNISWAP_PRECISION,
  formatUnits,
  parseUnits,
  useAnjRate,
  useTokenReserve,
} from 'lib/web3-utils'
import { useConverterStatus, CONVERTER_STATUSES } from './converter-status'
import ComboInput from './ComboInput'
import Token from './Token'
import Anchor from '../Anchor'

import question from './assets/question.svg'

const large = css => breakpoint('large', css)
const options = ['ANT', 'DAI', 'ETH', 'USDC']
const ANJ_MIN_REQUIRED = bigNum(10)
  .pow(18)
  .mul(10000)

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
function useConvertInputs(otherSymbol) {
  const [inputValueAnj, setInputValueAnj] = useState('')
  const [inputValueOther, setInputValueOther] = useState('')
  const [amountAnj, setAmountAnj] = useState(bigNum(0))
  const [amountOther, setAmountOther] = useState(bigNum(0))
  const [editing, setEditing] = useState(null)

  const anjDecimals = useTokenDecimals('ANJ')
  const otherDecimals = useTokenDecimals(otherSymbol)

  // convertFromAnj is used as a toggle to execute a conversion to or from ANJ.
  const [convertFromAnj, setConvertFromAnj] = useState(false)
  const anjRate = useAnjRate(
    otherSymbol,
    (convertFromAnj ? amountAnj : amountOther).toString(),
    convertFromAnj
  )

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
      anjRate.loading ||
      convertFromAnj ||
      editing === 'anj'
    ) {
      return
    }

    const amount = amountOther
      .mul(bigNum(10).pow(anjDecimals - otherDecimals))
      .mul(anjRate.rate)
      .div(bigNum(10).pow(UNISWAP_PRECISION))

    setAmountAnj(amount)
    setInputValueAnj(formatUnits(amount, { digits: anjDecimals }))
  }, [
    amountOther,
    anjDecimals,
    anjRate,
    convertFromAnj,
    editing,
    otherDecimals,
  ])

  // Calculate the other amount from the ANJ amount
  useEffect(() => {
    if (
      anjDecimals === -1 ||
      otherDecimals === -1 ||
      anjRate.loading ||
      !convertFromAnj ||
      editing === 'other'
    ) {
      return
    }

    const amount = amountAnj
      .div(bigNum(10).pow(anjDecimals - otherDecimals))
      .mul(anjRate.rate)
      .div(bigNum(10).pow(UNISWAP_PRECISION))

    setAmountOther(amount)
    setInputValueOther(formatUnits(amount, { digits: otherDecimals }))
  }, [amountAnj, anjDecimals, anjRate, convertFromAnj, editing, otherDecimals])

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
      anjRate.loading && !convertFromAnj && editing !== 'anj'
        ? 'Loading…'
        : inputValueAnj,

    inputValueOther:
      anjRate.loading && convertFromAnj && editing !== 'other'
        ? 'Loading…'
        : inputValueOther,

    rateSlippage: anjRate.rateSlippage,
  }
}

function FormSection() {
  const [selectedOption, setSelectedOption] = useState(0)
  const tokenBalance = useTokenBalance(options[selectedOption])
  const ethBalance = useEthBalance()
  const [anjReserve, loadingAnjReserve] = useTokenReserve('ANJ')

  const {
    amountAnj,
    amountOther,
    bindAnjInput,
    bindOtherInput,
    inputValueAnj,
    inputValueOther,
    rateSlippage,
  } = useConvertInputs(options[selectedOption])

  const convertTokenToAnj = useConvertTokenToAnj(options[selectedOption])
  const postEmail = usePostEmail()

  const balanceAnj = useJurorRegistryAnjBalance()
  const selectedTokenDecimals = useTokenDecimals(options[selectedOption])

  const converterStatus = useConverterStatus()
  const [email, setEmail] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()

    try {
      await postEmail(email)
    } catch (err) {
      converterStatus.setStatus(CONVERTER_STATUSES.ERROR)
      return
    }

    const selectedToken = options[selectedOption]
    converterStatus.setStatus(
      selectedToken === 'DAI' || selectedToken === 'USDC'
        ? CONVERTER_STATUSES.SIGNING_ERC
        : CONVERTER_STATUSES.SIGNING
    )
    try {
      const tx = await convertTokenToAnj(amountOther, amountAnj)
      converterStatus.setStatus(CONVERTER_STATUSES.PENDING)
      await tx.wait(1)
      converterStatus.setStatus(CONVERTER_STATUSES.SUCCESS)
    } catch (err) {
      console.log(err)
      if (process.env.NODE_ENV === 'production') {
        Sentry.captureException(err)
      }
      converterStatus.setStatus(CONVERTER_STATUSES.ERROR)
    }
  }

  const [placeholder, setPlaceholder] = useState('')
  const selectedTokenBalance =
    options[selectedOption] === 'ETH' ? ethBalance : tokenBalance

  useEffect(() => {
    if (balanceAnj && balanceAnj.gte(bigNum('10000'))) {
      setPlaceholder('')
    } else {
      setPlaceholder('Min. 10,000 ANJ')
    }
  }, [balanceAnj])

  const tokenBalanceError = useMemo(() => {
    if (
      amountOther &&
      inputValueOther &&
      balanceAnj &&
      balanceAnj.lt(ANJ_MIN_REQUIRED) &&
      amountAnj.lt(ANJ_MIN_REQUIRED)
    ) {
      return 'You need to activate at least 10,000 ANJ.'
    }

    if (
      amountOther &&
      amountOther.gte(0) &&
      amountOther.gt(selectedTokenBalance) &&
      !selectedTokenBalance.eq(-1)
    ) {
      return 'Amount is greater than balance held.'
    }

    return null
  }, [
    amountOther,
    inputValueOther,
    balanceAnj,
    amountAnj,
    selectedTokenBalance,
  ])

  const disabled = Boolean(
    !inputValueOther.trim() ||
      !inputValueAnj.trim() ||
      tokenBalanceError ||
      converterStatus.status !== CONVERTER_STATUSES.FORM ||
      !/[^@]+@[^@]+/.test(email) ||
      !acceptTerms
  )

  const liquidityError = useMemo(() => {
    // Reserves are still loading, so we cannot
    // do any computation yet
    if (loadingAnjReserve || !anjReserve || inputValueAnj.includes('Loading')) {
      return false
    }

    return anjReserve.lt(amountAnj)
      ? `There is not enough liquidity in the market at this time to purchase ${formatUnits(
          amountAnj
        )} ANJ. The maximum amount available for a purchase order at the current price is ${formatUnits(
          anjReserve,
          { truncateToDecimalPlace: 3 }
        )} ANJ`
      : ''
  }, [amountAnj, anjReserve, loadingAnjReserve, inputValueAnj])

  const slippageWarning = useMemo(() => {
    const totalAmount = balanceAnj.add(amountAnj)

    const slippageWarning =
      totalAmount.gte(ANJ_MIN_REQUIRED) &&
      totalAmount
        .sub(
          totalAmount.mul(rateSlippage).div(bigNum(10).pow(UNISWAP_PRECISION))
        )
        .lt(ANJ_MIN_REQUIRED)

    return slippageWarning
  }, [amountAnj, balanceAnj, rateSlippage])

  const handleSelect = useCallback(
    optionIndex => setSelectedOption(optionIndex),
    []
  )

  const formattedTokenBalance = selectedTokenBalance.eq(-1)
    ? 'Fetching…'
    : `${formatUnits(
        options[selectedOption] === 'ETH' ? ethBalance : tokenBalance,
        {
          digits: selectedTokenDecimals,
          replaceZeroBy: '0',
        }
      )} ${options[selectedOption]}.`

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
            options={[
              <Token symbol="ANT" />,
              <Token symbol="DAI" />,
              <Token symbol="ETH" />,
              <Token symbol="USDC" />,
            ]}
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
            <Label>Amount of ANJ you will receive and activate</Label>
            <AdornmentBox>
              <Input
                value={inputValueAnj}
                placeholder={placeholder}
                {...bindAnjInput}
              />
              <Adornment>
                <Token symbol="ANJ" />
              </Adornment>
            </AdornmentBox>
            <Info style={{ minHeight: '24px' }}>
              {liquidityError && (
                <span className="error">
                  {liquidityError} <br />
                </span>
              )}
              {amountOther.gt(0) && (
                <>
                  {slippageWarning ? (
                    <span className="warning">
                      The transaction may fail if the price of ANJ increases.
                    </span>
                  ) : (
                    'This amount is an approximation.'
                  )}
                  <OverlayTrigger
                    show="true"
                    placement="top"
                    delay={{ hide: 400 }}
                    overlay={props => (
                      <Tooltip {...props} show="true">
                        As this transaction will use an external, decentralized
                        exchange, we will not know the final exchange rate until
                        your transaction is mined.{' '}
                        {slippageWarning && (
                          <p>
                            If the price of ANJ increases before you transaction
                            is mined, you will not reach the required 10,000 ANJ
                            to successfully activate as a juror and the
                            transaction will fail.
                          </p>
                        )}
                      </Tooltip>
                    )}
                  >
                    <span className="insight"> Why?</span>
                  </OverlayTrigger>
                </>
              )}
            </Info>
          </InputBox>
        </div>
        <OverlayTrigger
          placement="right"
          delay={{ hide: 400 }}
          overlay={props => (
            <Tooltip {...props} show="true">
              By entering your email address, we will notify you directly about
              any necessary actions you'll need to take as a juror in upcoming
              court cases. Since there are financial penalties for not
              participating in cases you are drafted in, we would like all
              jurors to sign up for court notifications via email.
            </Tooltip>
          )}
        >
          <Label>
            Notify me about actions I need to take as a juror
            <img src={question} alt="" />
          </Label>
        </OverlayTrigger>
        <Input type="email" onChange={event => setEmail(event.target.value)} />
      </div>

      <Conditions>
        <label>
          <input
            type="checkbox"
            onChange={() => setAcceptTerms(acceptTerms => !acceptTerms)}
            checked={acceptTerms}
          />
          By clicking on “Become a juror”, you are accepting the{' '}
          <Anchor href="https://anj.aragon.org/legal/terms-general.pdf">
            court terms
          </Anchor>{' '}
          and the{' '}
          <Anchor href="https://aragon.one/email-collection.md">
            email collection policy
          </Anchor>
          .
        </label>
      </Conditions>

      <Button type="submit" disabled={disabled}>
        Become a Juror
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
  ${large('padding-right: 30px; margin-top: 0;')};
`

const Conditions = styled.p`
  margin: 24px 0;

  label {
    display: block;
    font-size: 16px;
    line-height: 1.3;
    margin-bottom: 0;
  }

  input {
    margin-right: 8px;
    vertical-align: text-top;
  }
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
