import React from 'react'
import { ConverterProvider } from 'components/converter/converter-status'
import ConvertStepper from 'components/ConvertStepper/ConvertStepper'

export default () => {
  return (
    <ConverterProvider>
      {/* <ConversionForm /> */}

      <ConvertStepper />
    </ConverterProvider>
  )
}
