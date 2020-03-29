import React, {
  useEffect,
  useContext,
  useState,
} from 'components/converter/node_modules/react'
import { useKnownContract } from 'components/converter/node_modules/lib/web3-contracts'
import { useWeb3Connect } from 'components/converter/node_modules/lib/web3-connect'
import { bigNum } from 'components/converter/node_modules/lib/utils'

export const CONVERTER_STATUSES = {
  FORM: Symbol('STATE_FORM'),
  LEGAL: Symbol('STATE_LEGAL'),
  STEPPER: Symbol('STATE_STEPPER'),
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
