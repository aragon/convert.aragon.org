import React from 'react'
import { ConverterProvider } from 'components/converter/converter-status'
import Convert from 'components/Convert/Convert'

export default () => {
  return (
    <ConverterProvider>
      {/* <ConversionForm /> */}

      <Convert />
    </ConverterProvider>
  )
}
