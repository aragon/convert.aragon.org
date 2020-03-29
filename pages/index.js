import React from 'react'
import { ConverterProvider } from 'components/Converter/converter-status'
import ConversionForm from 'components/ConversionForm/ConversionForm'

export default () => {
  return (
    <ConverterProvider>
      <ConversionForm />
    </ConverterProvider>
  )
}
