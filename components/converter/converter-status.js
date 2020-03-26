import React, { useEffect, useContext, useState } from 'react'
import { useKnownContract } from 'lib/web3-contracts'
import { useWeb3Connect } from 'lib/web3-connect'
import { bigNum } from 'lib/utils'

export const CONVERTER_STATUSES = {
  FORM: Symbol('STATE_FORM'),
  SIGNING_STAGE_1: Symbol('STATE_SIGNING_STAGE-1'),
  SIGNING_STATE_2: Symbol('STATE_SIGNING_STAGE_2'),
  SIGNING_SUCCESS: Symbol('STATE_SIGNING_SUCCESS'),
  PENDING: Symbol('STATE_PENDING'),
  ERROR: Symbol('STATE_ERROR'),
  SUCCESS: Symbol('STATE_SUCCESS'),
}

const ConverterContext = React.createContext()

export function useConverterStatus() {
  return useContext(ConverterContext)
}

export function ConverterProvider({ children }) {
  const [status, setStatus] = useState(CONVERTER_STATUSES.FORM)
  const [lastAnjBought, setLastAnjBought] = useState(bigNum(-1))

  const { account } = useWeb3Connect()
  const wrapperContract = useKnownContract('WRAPPER')

  useEffect(() => {
    if (status !== CONVERTER_STATUSES.PENDING || !wrapperContract || !account) {
      return
    }

    const onBought = (from, to, value) => {
      if (from === account) {
        setLastAnjBought(value)
        setStatus(CONVERTER_STATUSES.SUCCESS)
      }
    }

    wrapperContract.on('Bought', onBought)

    return () => {
      wrapperContract.removeListener('Bought', onBought)
    }
  }, [status, wrapperContract, account])

  return (
    <ConverterContext.Provider value={{ lastAnjBought, status, setStatus }}>
      {children}
    </ConverterContext.Provider>
  )
}
