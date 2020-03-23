import React, { useCallback } from 'react'
import styled from 'styled-components'
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
    <ConverterProvider>
      <OuterSection id="get-anj">
        <ConverterSection>
          <Header />
          <ConverterIn />
        </ConverterSection>
      </OuterSection>
    </ConverterProvider>
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
  if (status === CONVERTER_STATUSES.SIGNING_ERC) {
    return (
      <ProcessingScreen
        signing={status === CONVERTER_STATUSES.SIGNING_ERC}
        signTwice
      />
    )
  }
  if (
    status === CONVERTER_STATUSES.PENDING ||
    status === CONVERTER_STATUSES.SIGNING
  ) {
    return <ProcessingScreen signing={status === CONVERTER_STATUSES.SIGNING} />
  }
  return <ConverterContent />
}

const ConverterSection = styled.div`
  background: #ffffff;
  box-shadow: 0px 5px 13px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  width: 100%;
  max-width: 1180px;
  min-height: 642px;
  max-width: 95%;
  p {
    font-weight: 400;
    font-size: 24px;
    line-height: 38px;
    color: #8a96a0;
  }
  ${large('max-width: 1180px;')};
`

const OuterSection = styled.section`
  background: linear-gradient(
    to top,
    #fff 0%,
    #fff 83.5%,
    #1c1c1c 83.5%,
    #1c1c1c 100%
  ) !important;
  height: auto;
  min-height: 670px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-bottom: 30px;
`

export default Converter
