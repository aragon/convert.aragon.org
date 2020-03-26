import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ErrorScreen from './Error'
import LegalScreen from './Legal'
import PendingScreen from './Pending'
import ProcessingScreen from './Processing'
import SuccessScreen from './Success'
import { CONVERTER_STATUSES, useConverterStatus } from './converter-status'
import { breakpoint } from 'lib/microsite-logic'

const large = css => breakpoint('large', css)

function Converter({
  amountRequested,
  handleConvert,
  isFinal,
  toAnj,
  transactionHash,
}) {
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        padding-bottom: 30px;
        width: 100vw;
        height: 100vh;
      `}
    >
      <ConverterSection>
        <ConverterIn
          amountRequested={amountRequested}
          handleConvert={handleConvert}
          isFinal={isFinal}
          toAnj={toAnj}
          transactionHash={transactionHash}
        />
      </ConverterSection>
    </div>
  )
}

Converter.propTypes = {
  handleConvert: PropTypes.func,
  isFinal: PropTypes.bool,
  toAnj: PropTypes.bool,
  transactionHash: PropTypes.string,
}

function ConverterIn({
  amountRequested,
  handleConvert,
  isFinal,
  toAnj,
  transactionHash,
}) {
  const { status, setStatus } = useConverterStatus()
  const handleBackToForm = useCallback(() => {
    setStatus(CONVERTER_STATUSES.FORM)
  }, [setStatus])

  if (status === CONVERTER_STATUSES.SUCCESS) {
    return (
      <SuccessScreen
        amountRequested={amountRequested}
        final={isFinal}
        onDone={handleBackToForm}
        toAnj={toAnj}
        transactionHash={transactionHash}
      />
    )
  }
  if (status === CONVERTER_STATUSES.ERROR) {
    return <ErrorScreen onDone={handleBackToForm} />
  }
  if (status === CONVERTER_STATUSES.PENDING) {
    return <PendingScreen final={isFinal} />
  }
  if (status === CONVERTER_STATUSES.SIGNING) {
    return (
      <ProcessingScreen isFinal={isFinal} transactionHash={transactionHash} />
    )
  }
  if (status === CONVERTER_STATUSES.LEGAL) {
    return <LegalScreen handleConvert={handleConvert} />
  }
  return null
}

const ConverterSection = styled.div`
  margin-top: 52px;
  background: transparent;
  border-radius: 8px;
  width: 100%;
  max-width: 1180px;
  max-width: 95%;
  p {
    font-weight: 400;
    font-size: 24px;
    line-height: 32px;
    color: #8a96a0;
  }
  ${large('max-width: 1180px;')};
  @media screen and (max-width: 414px) {
    margin-top: 20px;
    p {
      font-size: 20px;
    }
  }
`

export default Converter
