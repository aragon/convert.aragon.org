import React, { useCallback } from 'react'
import styled from 'styled-components'
import { breakpoint } from 'lib/microsite-logic'
import { useWeb3Connect } from 'lib/web3-connect'
import { identifyProvider } from 'lib/web3-utils'

import metamask from './assets/metamask.svg'
import frame from './assets/frame.svg'
import portis from './assets/portis.svg'
import fortmatic from './assets/fortmatic.svg'

const large = css => breakpoint('large', css)
const medium = css => breakpoint('medium', css)

function Providers() {
  const { activate, connectors, ethersProvider } = useWeb3Connect()

  const isMetamask =
    ethersProvider && identifyProvider(ethersProvider.provider) === 'metamask'

  const activateAndTrack = useCallback(
    async providerId => {
      const ok = await activate(providerId)
      if (ok && window._paq && window._paq.push) {
        window._paq.push(['trackEvent', 'Web3', 'connect', providerId])
      }
    },
    [activate]
  )

  return (
    <Content>
      <Title>Enable your account</Title>
      <div>
        <Button onClick={() => activateAndTrack('injected')}>
          <img src={metamask} alt="" />
          <p>{isMetamask ? 'Metamask' : 'Ethereum wallet'}</p>
        </Button>
        <Button onClick={() => activateAndTrack('frame')}>
          <img src={frame} alt="" />
          <p>Frame</p>
        </Button>
        {connectors.has('fortmatic') && (
          <Button onClick={() => activateAndTrack('fortmatic')}>
            <img src={fortmatic} alt="" />
            <p>Fortmatic</p>
          </Button>
        )}
        {connectors.has('portis') && (
          <Button onClick={() => activateAndTrack('portis')}>
            <img src={portis} alt="" />
            <p>Portis</p>
          </Button>
        )}
      </div>
    </Content>
  )
}

const Button = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 137px;
  ${medium('min-width: 170px;')};
  margin: 5px;
  padding: 15px 15px 10px 15px;
  background: #ffffff;
  outline: 0;
  border: 0;
  border-radius: 4px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  &::-moz-focus-inner {
    border: 0;
  }
  &:hover,
  &:focus {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
    outline: 0;
  }
  &:active {
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
    outline: 0;
  }

  p {
    font-weight: 400;
    color: #1c1c1c;
    font-size: 20px;
    line-height: 25px;
    margin: 0;
  }
  img {
    margin: 0 20px 10px 0;
  }
`

const Content = styled.div`
  min-height: 450px;
  width: 100%;
  flex-direction: column;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 130px;
  ${large('padding-right: 30px; margin-top: 0;')};

  div {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
`
const Title = styled.p`
  font-size: 22px;
  font-weight: 400;
  color: #1c1c1c;
  line-height: 38px;
  padding: 0 0 20px 0;
  margin: 0;
  max-width: 90vw;
`

export default Providers
