import React, { useState, useCallback, useEffect } from 'react'
import {
  useOpenOrder,
  useClaimOrder,
  useApprove,
  useAllowance,
} from 'lib/web3-contracts'
import { bigNum } from 'lib/utils'
import ConvertSteps from 'components/ConvertSteps/ConvertSteps'
import processing from './assets/loader.gif'

function ManageConversion({ toAnj, fromAmount, toAmount, handleReturnHome }) {
  const openOrder = useOpenOrder()
  const claimOrder = useClaimOrder()
  const changeAllowance = useApprove()
  const getAllowance = useAllowance()
  const [conversionSteps, setConversionSteps] = useState()

  // Interacting with the bonding curve involves 2, 3 or 4 transactions (depending on the direction and state of allowance):
  // 1. Reset approval (If we're converting ANT -> ANJ, an allowance was previously set but abandoned)
  // 2. Raise approval (If we're converting ANT -> ANJ, the current allowance is not high enough)
  // 3. Open a buy order
  // 4. Claim the order
  const createConvertSteps = useCallback(async () => {
    let buyOrderHash
    let steps = []

    // We first check for allowance if the direction is correct
    if (toAnj) {
      const allowance = await getAllowance()

      // and if we need more, add a step to ask to approve more
      if (allowance.lt(bigNum(fromAmount))) {
        steps = [
          [
            'Raise approval',
            {
              createTx: () => changeAllowance(fromAmount),
            },
          ],
          ...steps,
        ]
      }

      // Then there's the case when an user has an allowance set to the market maker contract
      // but wants to convert even more tokens this time. When dealing with this case,
      // we want to reset the allowance back to zero, and then raise it.
      if (!allowance.isZero() && allowance.lt(bigNum(fromAmount))) {
        steps = [
          [
            'Reset approval',
            {
              createTx: () => changeAllowance(0),
            },
          ],
          ...steps,
        ]
      }
    }

    // Next add the buy and claim order steps which are needed for either direction
    steps = [
      ...steps,
      [
        'Create buy order',
        {
          createTx: () => openOrder(fromAmount, toAnj),

          // We need to store a reference to the "Buy order" hash so we can use it in the following "Claim order" step
          hashCreated: hash => {
            buyOrderHash = hash
          },
        },
      ],
      [
        'Claim order',
        {
          createTx: () => claimOrder(buyOrderHash, toAnj),
        },
      ],
    ]

    // Update state to reflect the correct amount of steps
    // Show loader for a small amount of time to provide a smooth visual experience
    setTimeout(() => {
      setConversionSteps(steps)
    }, 900)
  }, [claimOrder, fromAmount, getAllowance, openOrder, toAnj, changeAllowance])

  useEffect(() => {
    createConvertSteps()
  }, [createConvertSteps])

  return (
    <>
      {conversionSteps ? (
        <ConvertSteps
          steps={conversionSteps}
          toAnj={toAnj}
          fromAmount={fromAmount}
          toAmount={toAmount}
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
