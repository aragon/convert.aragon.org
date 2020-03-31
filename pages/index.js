import React from 'react'
import { ConverterProvider } from 'components/ConvertSteps/converter-status'
import ConvertForm from 'components/ConvertForm/ConvertForm'

export default () => {
  return (
    <ConverterProvider>
      <ConvertForm />
    </ConverterProvider>
  )
}
