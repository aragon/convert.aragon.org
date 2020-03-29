import React from 'react'
import { ConverterProvider } from 'components/ConvertSteps/converter-status'
import ConversionForm from 'components/ConversionForm/ConversionForm'

export default () => {
  return (
    <ConverterProvider>
      <ConversionForm />
    </ConverterProvider>
  )
}
