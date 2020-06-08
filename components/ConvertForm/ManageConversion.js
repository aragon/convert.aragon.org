import React, { useState, useEffect, useCallback } from 'react'
import {
  useOpenOrder,
  useClaimOrder,
  useApprove,
  useAllowance,
  useTransactionReceipt,
} from 'lib/web3-contracts'
import { bigNum } from 'lib/utils'
import ConvertSteps from 'components/ConvertSteps/ConvertSteps'
import processing from './assets/loader.gif'

function ManageConversion({ toAnj, fromAmount, handleReturnHome }) {
  const openOrder = useOpenOrder()
  const claimOrder = useClaimOrder()
  const transactionReceipt = useTransactionReceipt()
  const changeAllowance = useApprove()
  const getAllowance = useAllowance()
  const [conversionSteps, setConversionSteps] = useState([])
  const [convertedTotal, setConvertedTotal] = useState(bigNum(0))

  const updateConvertedValue = useCallback(
    async hash => {
      try {
        const receipt = await transactionReceipt(hash)
        const receiptValue = bigNum(receipt.logs[0].data)

        setConvertedTotal(receiptValue)
      } catch (err) {
        throw new Error(err)
      }
    },
    [transactionReceipt]
  )

  useEffect(() => {
    let cancelled = false

    // Interacting with the bonding curve involves 2, 3 or 4 transactions (depending on the direction and state of allowance):
    // 1. Reset approval (If we're converting ANT -> ANJ, an allowance was previously set but abandoned)
    // 2. Raise approval (If we're converting ANT -> ANJ, the current allowance is not high enough)
    // 3. Open a buy order
    // 4. Claim the order
    const createConvertSteps = async () => {
      let openOrderHash
      let steps = []

      // First we check for allowance if the direction is ANT -> ANJ
      if (toAnj) {
        const allowance = await getAllowance()

        // and if we need more, add a step to ask for an approval
        if (allowance.lt(bigNum(fromAmount))) {
          steps.unshift([
            'Raise approval',
            {
              createTx: () => changeAllowance(fromAmount),
            },
          ])

          // Then there's the case when a user has an allowance set to the market maker contract
          // but wants to convert even more tokens this time. When dealing with this case
          // we want to first prepend a transaction to reset the allowance back to zero
          // (before raising it in the next transaction from above).
          if (!allowance.isZero()) {
            steps.unshift([
              'Reset approval',
              {
                createTx: () => changeAllowance(0),
              },
            ])
          }
        }
      }

      // Next add the open order
      steps.push([
        `Create ${toAnj ? 'buy' : 'sell'} order`,
        {
          createTx: () => openOrder(fromAmount, toAnj),

          // We need to store a reference to the hash so we can use it in the following step
          hashCreated: hash => {
            openOrderHash = hash
          },
        },
      ])

      // And finally the claim order
      steps.push([
        'Claim order',
        {
          createTx: () => claimOrder(openOrderHash, toAnj),
          transactionComplete: hash => updateConvertedValue(hash),
        },
      ])

      // Update state to reflect the correct amount of steps
      // Show loader for a small amount of time to provide a smooth visual experience
      setTimeout(() => {
        if (!cancelled) {
          setConversionSteps(steps)
        }
      }, 900)
    }

    createConvertSteps()

    return () => {
      cancelled = true
    }
  }, [
    changeAllowance,
    claimOrder,
    fromAmount,
    getAllowance,
    openOrder,
    toAnj,
    updateConvertedValue,
  ])

  return (
    <>
      {conversionSteps.length > 0 ? (
        <ConvertSteps
          steps={conversionSteps}
          toAnj={toAnj}
          fromAmount={fromAmount}
          convertedTotal={convertedTotal}
          onReturnHome={handleReturnHome}
        />
      ) : (
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100vw;
            height: 100vh;
          `}
        >
          <img
            css={`
              max-width: 125px;
            `}
            src={processing}
            alt=""
          />
        </div>
      )}
    </>
  )
}

export default ManageConversion
