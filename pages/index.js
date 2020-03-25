import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { ConverterProvider } from 'components/converter/converter-status'
import SplitForm from 'components/SplitScreen/SplitForm'

export default () => {
  return (
    <ConverterProvider>
      <SplitForm />
    </ConverterProvider>
  )
}
