import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Contract as EthersContract } from 'ethers'
import environment from 'lib/environment'
import { getKnownContract } from './known-contracts'
import { useWeb3Connect } from './web3-connect'
import { bigNum } from './utils'

// See https://fundraising.aragon.black/components/bonding-curve#pricing-algorithm
const CONNECTOR_WEIGHT = 250000
const RINKEBY_CONNECTOR_WEIGHT = 33333
const RETRY_EVERY = 1000

const contractsCache = new Map()
const tokenDecimals = new Map([
  ['ANT', 18],
  ['ANJ', 18],
])

function getConnectorWeight() {
  const chainId = environment('CHAIN_ID')
  return chainId === '1' ? CONNECTOR_WEIGHT : RINKEBY_CONNECTOR_WEIGHT
}

export function useContract(address, abi, signer = true) {
  const { ethersProvider } = useWeb3Connect()

  if (!address || !ethersProvider) {
    return null
  }
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
  const anjContract = useKnownContract('TOKEN_ANJ')
  const bancorContract = useKnownContract('BANCOR_FORMULA')

  const [treasuryAddress] = getKnownContract('BONDING_CURVE_TREASURY')
  const antTreasuryBalance = useTokenBalance('ANT', treasuryAddress)
  const connectorWeight = getConnectorWeight()
  useEffect(() => {
    let cancelled = false
    let retryTimer

    if (!anjContract || antTreasuryBalance.eq(-1) || !bancorContract) {
      return
    }

    const getSalePrice = async () => {
      try {
        setLoading(true)
        const anjTotalSupply = await anjContract.totalSupply()
        const salePrice = await (forwards
          ? bancorContract.calculatePurchaseReturn(
              anjTotalSupply,
              antTreasuryBalance,
              connectorWeight,
              amount
            )
          : bancorContract.calculateSaleReturn(
              anjTotalSupply,
              antTreasuryBalance,
              connectorWeight,
              amount
            ))
        if (!cancelled) {
          setLoading(false)
          setPrice(salePrice)
        }
      } catch (err) {
        if (!cancelled) {
          retryTimer = setTimeout(getSalePrice, RETRY_EVERY)
        }
      }
    }

    getSalePrice()

    return () => {
      cancelled = true
      clearTimeout(retryTimer)
    }
  }, [amount, anjContract, antTreasuryBalance, bancorContract, forwards])

  return useMemo(() => ({ loading, price }), [loading, price])
}

// Convert ANT to ANJ action
export function useOpenOrder() {
  const { account } = useWeb3Connect()
  const antContract = useKnownContract('TOKEN_ANT')
  const fundraisingContract = useKnownContract('FUNDRAISING')

  const [antAddress] = getKnownContract('TOKEN_ANT')
  const [marketMakerAddress] = getKnownContract('MARKET_MAKER')

  return useCallback(
    async (amount, forwards = true) => {
      if (!antContract || !fundraisingContract) {
        return false
      }
      // Interacting with the bonding curve involves 3 transactions (or two,
      // depending on the direction):
      // 1. Approval (if there's not enough allowance and we're converting ANT -> ANJ)
      // 2. Open a buy order (and wait for the transaction to be mined)
      // 3. Claim the order (done in useClaimOrder)

      // We first check for allowance if the direction is correct,
      // and if we need more, approve
      if (forwards) {
        const allowance = await antContract.allowance(
          account,
          marketMakerAddress
        )
        if (allowance.lt(bigNum(amount))) {
          try {
            await antContract.approve(marketMakerAddress, amount)
            // Don't wait for the approval to be mined before showing second transaction
          } catch (err) {
            throw new Error('User did not approve transaction')
          }
        }
      }

      // Then, we open a buy or sell order. The next step will be handled after the
      // transaction gets mined, in useClaimOrder()
      return await (forwards
        ? fundraisingContract.openBuyOrder(antAddress, amount, {
            gasLimit: 650000,
            value: 0,
          })
        : fundraisingContract.openSellOrder(antAddress, amount, {
            gasLimit: 850000,
          }))
    },
    [account, antAddress, antContract, fundraisingContract, marketMakerAddress]
  )
}

export function useClaimOrder() {
  const { account, ethersProvider } = useWeb3Connect()
  const fundraisingContract = useKnownContract('FUNDRAISING')
  const [antAddress] = getKnownContract('TOKEN_ANT')

  return useCallback(
    async (openOrderTransactionHash, forwards = true) => {
      const { blockNumber: batchId } = await ethersProvider.getTransaction(
        openOrderTransactionHash
      )
      // We claim the buy order, with the blockNumber of the emitted open order
      return await (forwards
        ? fundraisingContract.claimBuyOrder(account, batchId, antAddress, {
            gasLimit: 500000,
          })
        : fundraisingContract.claimSellOrder(account, batchId, antAddress, {
            gasLimit: 500000,
          }))
    },
    [account, antAddress, ethersProvider, fundraisingContract]
  )
}
