import { useState, useEffect, useCallback } from 'react'
import { utils as EthersUtils } from 'ethers'
import * as Sentry from '@sentry/browser'
import { request } from 'graphql-request'
import { toBN } from 'web3-utils'
import { useWeb3Connect } from './web3-connect'
import env from './environment'

const GQL_ENDPOINT =
  'https://api.thegraph.com/subgraphs/name/aragon/aragon-court'

const SLIPPAGE_PERCENTAGE = bigNum(95)
const FETCH_RETRY_DELAY = 1000

export function noop() {}

export function bigNum(value) {
  return new EthersUtils.BigNumber(value)
}

export function calculateSlippageAmount(value) {
  return value.mul(SLIPPAGE_PERCENTAGE).div(100)
}

export function useAnJurors() {
  const [jurors, setJurors] = useState(0)
  const [activeAnj, setActiveAnj] = useState('0')

  useEffect(() => {
    let retryTimer

    async function fetchJurors() {
      let response

      try {
        response = await request(
          GQL_ENDPOINT,
          `
            {
              jurors(first: 1000, where: { activeBalance_gt: 0 }) {
                activeBalance
              }
            }
          `
        )
        if (!response.jurors) {
          throw new Error('Wrong response')
        }
      } catch (err) {
        retryTimer = setTimeout(fetchJurors, FETCH_RETRY_DELAY)
        return
      }

      const { jurors } = response

      const anjActivated = jurors.reduce(
        (acc, { activeBalance }) => acc.add(toBN(activeBalance)),
        toBN(0)
      )

      setJurors(jurors.length)
      setActiveAnj(anjActivated)
    }

    fetchJurors()

    return () => {
      clearTimeout(retryTimer)
    }
  }, [])

  return [jurors, activeAnj]
}

export function useNow(updateEvery = 1000) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, updateEvery)
    return () => {
      clearInterval(timer)
    }
  }, [updateEvery])
  return now
}

export function usePostEmail() {
  const { account } = useWeb3Connect() || ''
  return useCallback(
    async email => {
      try {
        const response = await fetch(env('SUBSCRIPTIONS_URL'), {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, address: account }),
        })
        if (!response.ok) {
          throw new Error(
            `Received a wrong status when trying to subscribe: ${response.status}.`
          )
        }
      } catch (err) {
        console.error(`Error while trying to subscribe ${email}`, err)

        if (
          process.env.NODE_ENV !== 'production' &&
          err instanceof TypeError &&
          err.message === 'Failed to fetch'
        ) {
          // Ignore CORS issues with the email request on development
          console.log('Ignoring failed subscribe request on development')
          return
        }

        Sentry.withScope(scope => {
          scope.setUser({ email, username: account })
          Sentry.captureException(err)
        })
        throw err
      }
    },
    [account]
  )
}

export const CSS_UNSELECTABLE = `
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`

export const FIRST_TERM = new Date('February 10, 2020 16:00:00 GMT+0000')
export const PREACTIVATION_END = new Date('February 10, 2020 00:00:00 GMT+0000')
export const PREACTIVATION_START = new Date('January 7, 2020 18:00:00 GMT+0000')
