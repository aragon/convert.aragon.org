import React from 'react'
import { ConverterProvider } from 'components/converter/converter-status'
import ConversionForm from 'components/ConversionForm/ConversionForm'

export default () => {
  return (
    <ConverterProvider>
      <ConversionForm />
    </ConverterProvider>
  )
}
