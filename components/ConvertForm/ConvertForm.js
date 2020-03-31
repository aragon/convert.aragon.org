import React, { useState, useCallback, useMemo } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import styled from 'styled-components'
import AmountInput from 'components/AmountInput/AmountInput'
import Anchor from 'components/Anchor/Anchor'
import ConvertSteps from 'components/ConvertSteps/ConvertSteps'
import LegalScreen from 'components/ConvertSteps/Legal'
import NavBar from 'components/NavBar/NavBar'
import Balance from 'components/SplitScreen/Balance'
import SplitScreen from 'components/SplitScreen/SplitScreen'
import { useWeb3Connect } from 'lib/web3-connect'
import { useTokenBalance } from 'lib/web3-contracts'
import { formatUnits } from 'lib/web3-utils'
import { useConvertInputs } from './useConvertInputs'

import question from './assets/question.svg'

const options = ['ANT', 'ANJ']

const CONVERTER_STATUSES = {
  FORM: Symbol('STATE_FORM'),
  LEGAL: Symbol('STATE_LEGAL'),
  STEPPER: Symbol('STATE_STEPPER'),
}

function ConvertForm() {
  const [formStatus, setFormStatus] = useState(CONVERTER_STATUSES.FORM)
  const [selectedOption, setSelectedOption] = useState(1)
  const [inverted, setInverted] = useState(true)
  const toAnj = useMemo(() => !inverted, [inverted])
  const {
    amountSource,
    amountRecipient,
    bindOtherInput,
    bondingPriceLoading,
    handleManualInputChange,
    inputValueRecipient,
    inputValueSource,
    resetInputs,
  } = useConvertInputs(options[selectedOption], toAnj)
  const tokenBalance = useTokenBalance(options[selectedOption])

  const { account } = useWeb3Connect()
  const inputDisabled = useMemo(() => !Boolean(account), [account])
  const inputError = useMemo(() => Boolean(tokenBalance.lt(amountSource)), [
    amountSource,
    tokenBalance,
  ])

  const handleInvert = useCallback(() => {
    setInverted(inverted => !inverted)
    setSelectedOption(option => (option + 1) % 2)
  }, [])
  const handleConvertMax = useCallback(() => {
    handleManualInputChange(
      formatUnits(tokenBalance, { truncateToDecimalPlace: 3 }),
      toAnj
    )
  }, [handleManualInputChange, toAnj, tokenBalance])

  const handleConvert = useCallback(() => {
    setFormStatus(CONVERTER_STATUSES.STEPPER)
  }, [])

  const handleLegalTerms = useCallback(() => {
    setFormStatus(CONVERTER_STATUSES.LEGAL)
  }, [])

  const handleReturnHome = useCallback(() => {
    resetInputs()
    setFormStatus(CONVERTER_STATUSES.FORM)
  }, [resetInputs])

  const submitButtonDisabled = Boolean(!account || bondingPriceLoading)

  const navbarLogoMode = useMemo(() => {
    if (formStatus !== CONVERTER_STATUSES.FORM) {
      return 'normal'
    }
    return inverted ? 'anj' : 'ant'
  }, [formStatus, inverted])

  return (
    <div
      css={`
        position: relative;
        height: 100vh;
      `}
    >
      <NavBar logoMode={navbarLogoMode} />
      <SplitScreen
        inverted={inverted}
        onInvert={handleInvert}
        primary={
          <div
            css={`
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            <AmountInput
              error={inputError}
              symbol={inverted ? 'ANJ' : 'ANT'}
              color={false}
              value={inputValueSource}
              disabled={inputDisabled}
              {...bindOtherInput}
            />
            <Balance
              tokenBalance={tokenBalance}
              tokenAmountToConvert={amountSource}
            />
            {account && (
              <MaxButton
                css={`
                  margin-top: 12px;
                `}
                onClick={handleConvertMax}
              >
                Convert all
              </MaxButton>
            )}
          </div>
        }
        secondary={
          <div
            css={`
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            <AmountInput
              symbol={inverted ? 'ANT' : 'ANJ'}
              color={true}
              value={inputValueRecipient}
              onChange={() => null}
            />
            <LabelWithOverlay
              label="The conversion amount is an estimate"
              description="This tool uses a bonding curve to convert ANT into ANJ and
                      back at a pre-defined rate. The price is calculated by an
                      automated market maker smart contract that defines a
                      relationship between token price and token supply. You can
                      also convert ANT into other tokens such as ETH or DAI on
                      various exchanges like
                      Uniswap.
"
              overlayPlacement="top"
            />
            <div
              css={`
                position: relative;
                width: 100vw;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              `}
            >
              <Button
                disabled={submitButtonDisabled}
                onClick={handleLegalTerms}
                css={`
                  width: 90%;
                `}
              >
                Convert
              </Button>
              <Docs />
            </div>
          </div>
        }
        reveal={
          formStatus === CONVERTER_STATUSES.FORM ? null : (
            <>
              {formStatus === CONVERTER_STATUSES.LEGAL ? (
                <LegalScreen handleConvert={handleConvert} />
              ) : (
                <ConvertSteps
                  toAnj={toAnj}
                  amountSource={amountSource}
                  amountRecipient={amountRecipient}
                  onReturnHome={handleReturnHome}
                />
              )}
            </>
          )
        }
      />
    </div>
  )
}

function LabelWithOverlay({ label, description, overlayPlacement }) {
  return (
    <OverlayTrigger
      delay={{ hide: 400 }}
      overlay={props => (
        <Tooltip {...props} show="true">
          {description}
        </Tooltip>
      )}
      placement={overlayPlacement}
    >
      <Label>
        {label}
        <img src={question} alt="" />
      </Label>
    </OverlayTrigger>
  )
}

function Docs() {
  return (
    <ul
      css={`
        position: absolute;
        bottom: 0px;
        right: 8px;
        list-style: none;
        color: #a0a8c2;
        font-size: 16px;
        padding: 0;
        li {
          display: inline;
          margin: 0 32px;
          a {
            color: #a0a8c2;
          }
        }
        @media screen and (max-width: 1024px) {
          position: relative;
          bottom: -32px;
        }
      `}
    >
      <li>
        <Anchor href="https://anj.aragon.org/">About</Anchor>
      </li>
      <li>
        <Anchor href="https://help.aragon.org/article/41-aragon-court">
          Docs
        </Anchor>
      </li>
      <li>
        <Anchor href="https://court.aragon.org/dashboard">Court</Anchor>
      </li>
    </ul>
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

const Label = styled.label`
  font-size: 16px;
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

const MaxButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 32px;
  margin-top: 8px;
  line-height: 32px;
  text-align: center;
  font-size: 16px;
  font-weight: 800;
  text-align: center;
  color: #fff;
  background: transparent;
  border: 1px solid #fff;
  border-radius: 3px;
  cursor: pointer;
  outline: 0 !important;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);

  &:hover,
  &:active {
    outline: 0 !important;
  }
  &:focus,
  &:active {
    padding: 0;
    transform: translateY(0.5px);
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.05);
  }
`

export default ConvertForm
