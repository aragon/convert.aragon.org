import React, { useCallback } from 'react'
import styled from 'styled-components'
import { breakpoint } from 'lib/microsite-logic'
import ErrorScreen from './Error'
import LegalScreen from './Legal'
import PendingScreen from './Pending'
import ProcessingScreen from './Processing'
import SuccessScreen from './Success'
import { CONVERTER_STATUSES, useConverterStatus } from './converter-status'

const large = css => breakpoint('large', css)

function Converter({
  amountRequested,
  backToSplit,
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
          backToSplit={backToSplit}
          handleConvert={handleConvert}
          isFinal={isFinal}
          toAnj={toAnj}
          transactionHash={transactionHash}
        />
      </ConverterSection>
    </div>
  )
}

function ConverterIn({
  amountRequested,
  backToSplit,
  handleConvert,
  isFinal,
  toAnj,
  transactionHash,
}) {
  const { status, setStatus } = useConverterStatus()
  const backToForm = useCallback(() => {
    setStatus(CONVERTER_STATUSES.FORM)
    backToSplit()
  }, [setStatus])

  if (status === CONVERTER_STATUSES.SUCCESS) {
    return (
      <SuccessScreen
        amountRequested={amountRequested}
        final={isFinal}
        onDone={backToForm}
        toAnj={toAnj}
        transactionHash={transactionHash}
      />
    )
  }
  if (status === CONVERTER_STATUSES.ERROR) {
    return <ErrorScreen onDone={backToForm} />
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
