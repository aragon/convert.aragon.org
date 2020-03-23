import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Contract as EthersContract } from 'ethers'
import { getKnownContract } from './known-contracts'
import { useWeb3Connect } from './web3-connect'
import { bigNum } from './utils'

const CONNECTOR_WEIGHT = 250000
const RETRY_EVERY = 1000

const contractsCache = new Map()
const tokenDecimals = new Map([
  ['ANT', 18],
  ['ANJ', 18],
  ['ETH', 18],
  ['DAI', 18],
  ['USDC', 6],
])

export function useContract(address, abi, signer = true) {
  const { ethersProvider } = useWeb3Connect()

  if (!address || !ethersProvider) {
    return null
  }
  // TODO: clear the cache when the provider changes
  if (contractsCache.has(address)) {
    return contractsCache.get(address)
  }

  const contract = new EthersContract(
    address,
    abi,
    signer ? ethersProvider.getSigner() : ethersProvider
  )

  contractsCache.set(address, contract)

  return contract
}

export function useKnownContract(name, signer = true) {
  const [address, abi] = getKnownContract(name)
  return useContract(address, abi, signer)
}

export function useTokenDecimals(symbol) {
  return tokenDecimals.get(symbol)
}

export function useAnjTotalSupply() {
  const [loading, setLoading] = useState(false)
  const [totalSupply, setTotalSupply] = useState(bigNum(-1))
  // Manually getting the contract to avoid the cached ANJ one
  const anjContract = useKnownContract('TOKEN_ANJ')
  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (!anjContract) {
      setTotalSupply(bigNum(-1))
      setLoading(false)
      return
    }

    const updateTotalSupply = async () => {
      try {
        setLoading(true)

        const totalSupply = await anjContract.totalSupply()

        if (!cancelled) {
          setLoading(false)
          setTotalSupply(totalSupply)
        }
      } catch (err) {
        if (!cancelled) {
          retryTimer = setTimeout(updateTotalSupply, RETRY_EVERY)
        }
      }
    }

    updateTotalSupply()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [anjContract])

  return useMemo(() => ({ loading, totalSupply }), [loading, totalSupply])
}

export function useEthBalance() {
  const { account, web3ReactContext } = useWeb3Connect()
  const [balance, setBalance] = useState(bigNum(-1))

  const cancelBalanceUpdate = useRef(null)

  const updateBalance = useCallback(() => {
    let cancelled = false

    if (cancelBalanceUpdate.current) {
      cancelBalanceUpdate.current()
      cancelBalanceUpdate.current = null
    }

    if (!account || !web3ReactContext) {
      setBalance(bigNum(-1))
      return
    }

    cancelBalanceUpdate.current = () => {
      cancelled = true
    }

    web3ReactContext.library.getBalance(account).then(balance => {
      if (!cancelled) {
        setBalance(balance)
      }
    })
  }, [account, web3ReactContext])

  useEffect(() => {
    // Always update the balance if updateBalance() has changed
    updateBalance()

    if (!web3ReactContext || !account) {
      return
    }

    const onTransfer = (from, to, value) => {
      if (from === account || to === account) {
        updateBalance()
      }
    }
    web3ReactContext.library.on('Transfer', onTransfer)

    return () => {
      web3ReactContext.library.removeListener('Transfer', onTransfer)
    }
  }, [account, web3ReactContext, updateBalance])

  return balance
}

export function useTokenBalance(symbol, address = '') {
  const { account } = useWeb3Connect()
  const [balance, setBalance] = useState(bigNum(-1))
  const tokenContract = useKnownContract(`TOKEN_${symbol}`)

  const cancelBalanceUpdate = useRef(null)

  const updateBalance = useCallback(() => {
    let cancelled = false

    if (cancelBalanceUpdate.current) {
      cancelBalanceUpdate.current()
      cancelBalanceUpdate.current = null
    }

    if ((!account && !address) || !tokenContract) {
      setBalance(bigNum(-1))
      return
    }

    cancelBalanceUpdate.current = () => {
      cancelled = true
    }
    const requestedAddress = address || account
    tokenContract.balanceOf(requestedAddress).then(balance => {
      if (!cancelled) {
        setBalance(balance)
      }
    })
  }, [account, address, tokenContract])

  useEffect(() => {
    // Always update the balance if updateBalance() has changed
    updateBalance()

    if ((!account && !address) || !tokenContract) {
      return
    }

    const onTransfer = (from, to, value) => {
      if (
        from === account ||
        to === account ||
        from === address ||
        to === address
      ) {
        updateBalance()
      }
    }
    tokenContract.on('Transfer', onTransfer)

    return () => {
      tokenContract.removeListener('Transfer', onTransfer)
    }
  }, [account, address, tokenContract, updateBalance])

  return balance
}

export function useBondingCurvePrice(amount, forwards = true) {
  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState(bigNum(-1))

  const bancorContract = useKnownContract('BANCOR_FORMULA')
  const [treasuryAddress] = getKnownContract('BONDING_CURVE_TREASURY')
  const antTreasuryBalance = useTokenBalance('ANT', treasuryAddress)
  const { loading: supplyLoading, totalSupply } = useAnjTotalSupply()
  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (
      antTreasuryBalance.eq(-1) ||
      !bancorContract ||
      supplyLoading ||
      totalSupply.eq(-1)
    ) {
      return
    }
    const getSalePrice = async () => {
      try {
        setLoading(true)
        const salePrice = await (forwards
          ? bancorContract.calculatePurchaseReturn(
              totalSupply,
              antTreasuryBalance,
              CONNECTOR_WEIGHT,
              amount
            )
          : bancorContract.calculateSaleReturn(
              totalSupply,
              antTreasuryBalance,
              CONNECTOR_WEIGHT,
              amount
            ))
        if (!cancelled) {
          setLoading(false)
          setPrice(salePrice)
        }
      } catch (err) {
        if (!cancelled) {
          retryTimer = setTimeout(useBondingCurvePrice, RETRY_EVERY)
        }
      }
    }

    getSalePrice()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [
    amount,
    antTreasuryBalance,
    bancorContract,
    forwards,
    supplyLoading,
    totalSupply,
  ])

  return useMemo(() => ({ loading, price }), [loading, price])
}

// Convert ANT to ANJ action
export function useConvertAntToAnj() {
  const antContract = useKnownContract('TOKEN_ANT')
  const [wrapperAddress] = getKnownContract('WRAPPER')

  return useCallback(
    async antAmount => {
      if (!antContract || !wrapperAddress) {
        return false
      }

      return antContract.approveAndCall(wrapperAddress, antAmount, '0x00', {
        gasLimit: 1000000,
      })
    },
    [antContract, wrapperAddress]
  )
}
