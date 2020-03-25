import React, { useCallback } from 'react'
import styled from 'styled-components/macro'
import { breakpoint } from 'lib/microsite-logic'
import Header from './Header'
import ConverterContent from './ConverterContent'
import ErrorScreen from './Error'
import ProcessingScreen from './Processing'
import SuccessScreen from './Success'
import {
  CONVERTER_STATUSES,
  ConverterProvider,
  useConverterStatus,
} from './converter-status'

const large = css => breakpoint('large', css)

function Converter() {
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
        <ConverterIn />
      </ConverterSection>
    </div>
  )
}

function ConverterIn() {
  const { status, setStatus } = useConverterStatus()
  const backToForm = useCallback(() => {
    setStatus(CONVERTER_STATUSES.FORM)
  }, [setStatus])

  if (status === CONVERTER_STATUSES.SUCCESS) {
    return <SuccessScreen onDone={backToForm} />
  }
  if (status === CONVERTER_STATUSES.ERROR) {
    return <ErrorScreen onDone={backToForm} />
  }
  if (
    status === CONVERTER_STATUSES.PENDING ||
    status === CONVERTER_STATUSES.SIGNING
  ) {
    return <ProcessingScreen signing={status === CONVERTER_STATUSES.SIGNING} />
  }
  return null
}

const ConverterSection = styled.div`
  margin-top: 52px;
  background: #ffffff;
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
