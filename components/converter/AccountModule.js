import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/macro'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import { useWeb3Connect } from 'lib/web3-connect'
import { useTokenBalance, useTokenDecimals } from 'lib/web3-contracts'
import { shortenAddress } from 'lib/web3-utils'
import EthIdenticon from './EthIdenticon'

import fortmatic from './assets/fortmatic.svg'
import frame from './assets/frame.svg'
import metamask from './assets/metamask.svg'
import portis from './assets/portis.svg'
import lightning from '../assets/lightning.svg'

function AccountModule() {
  const { account } = useWeb3Connect()
  return account ? <ConnectedMode /> : <DisconnectedMode />
}

AccountModule.propTypes = {
  compact: PropTypes.bool,
}

function DisconnectedMode() {
  const { activate } = useWeb3Connect()

  const activateAndTrack = useCallback(
    async providerId => {
      const ok = await activate(providerId)
      if (ok && window._paq && window._paq.push) {
        window._paq.push(['trackEvent', 'Web3', 'connect', providerId])
      }
    },
    [activate]
  )

  const containerRef = useRef()

  return (
    <ButtonBase
      ref={containerRef}
      css={`
        position: relative;
        width: 179px;
        height: 40px;
        background: rgba(255, 255, 255, 0.5);
        border: 1px solid rgba(223, 227, 232, 0.75);
        box-sizing: border-box;
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
        border-radius: 3px;
        &:active {
          top: 1px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}
    >
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="bottom"
        overlay={
          <StyledPopover
            css={`
              position: absolute;
              left: 0;
            `}
          >
            <div
              css={`
                position: relative;
                width: 100%;
                height: 32px;
                border-bottom: 0.5px solid #dde4e8;
                text-transform: uppercase;
                color: #637381;
              `}
            >
              <span
                css={`
                  display: block;
                  width: 100%;
                  padding-top: 8px;
                  padding-left: 16px;
                  padding-bottom: 8px;
                  font-size: 12px;
                `}
              >
                Ethereum Providers
              </span>
              <div
                css={`
                  display: grid;
                  grid-gap: 10px;
                  grid-auto-flow: row;
                  grid-template-columns: repeat(2, 1fr);
                  padding: 16px;
                `}
              >
                <ProviderButton
                  name="Metamask"
                  onActivate={() => activateAndTrack('injected')}
                  image={metamask}
                />
                <ProviderButton
                  name="Frame"
                  onActivate={() => activateAndTrack('frame')}
                  image={frame}
                />
                <ProviderButton
                  name="Fortmatic"
                  onActivate={() => activateAndTrack('fortmatic')}
                  image={fortmatic}
                />
                <ProviderButton
                  name="Portis"
                  onActivate={() => activateAndTrack('portis')}
                  image={portis}
                />
              </div>
            </div>
          </StyledPopover>
        }
      >
        <div
          css={`
            margin-top: 4px;
            font-size: 16px;
            font-weight: medium;
            background: transparent;
          `}
        >
          <img
            src={lightning}
            alt=""
            css={`
              margin-right: 12px;
              margin-bottom: 4px;
            `}
          />
          Enable Account
        </div>
      </OverlayTrigger>
    </ButtonBase>
  )
}

function ProviderButton({ name, onActivate, image }) {
  return (
    <ButtonBase
      onClick={onActivate}
      css={`
        position: relative;
        display: flex;
        flex-direction: column;
        color: #1c1c1c;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 96px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        text-transform: capitalize;
        &:active {
          top: 1px;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}
    >
      <img src={image} alt="" height="42px" />
      <div
        css={`
          margin-top: 8px;
        `}
      >
        {name}
      </div>
    </ButtonBase>
  )
}

function ConnectedMode() {
  const { account, deactivate } = useWeb3Connect()
  const containerRef = useRef()

  return (
    <Container ref={containerRef}>
      <ButtonBase
        css={`
          position: relative;
          background: rgba(255, 255, 255, 0.5);
          &:active {
            top: 1px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}
        onClick={deactivate}
      >
        <div
          css={`
            position: relative;
          `}
        >
          <EthIdenticon address={account} scale={1} radius={4} />
        </div>
        <Address>{shortenAddress(account)}</Address>
      </ButtonBase>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  height: 40px;
`
const StyledPopover = styled(Popover)`
  overflow: hidden;
  background: #fff;
  box-shadow: 0px 7px 24px rgba(0, 0, 0, 0.25);
  border: 0 solid transparent;
  width: 410px;
  max-width: 90vw;
  height: 313px;
  left: 982px;
  top: 103px;

  &.bs-popover-bottom .arrow::after {
    border-bottom-color: #f9fafc;
  }
  &.bs-popover-bottom .arrow::before {
    border-bottom-color: transparent;
  }

  div.header {
    background: #f9fafc;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1 {
      line-height: 32px;
      padding: 0;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      text-align: right;
      color: #7fdfa6;
      margin: 0;
    }
    button {
      background: transparent;
      border: 0;
      cursor: pointer;
      color: #637381;
    }
    button:hover {
      color: #212b36;
    }
  }
  span {
    top: 0px;
  }
`
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 15px 15px 0;
  border-top: 1px solid #dde6ed;
  div {
    text-align: right;
  }
  p {
    font-size: 18px;
    color: #1c1c1c;
    margin: 0;
  }
  p + p {
    margin: 0;
    font-size: 12px;
    color: #8a95a0;
    font-weight: 400;
  }
`

const Address = styled.div`
  font-size: 18px;
  line-height: 31px;
  color: #1c1c1c;
  padding-left: 8px;
  padding-right: 4px;
  font-family: 'FontMono', monospace;
`
const ButtonBase = styled.div`
  display: flex;
  align-items: center;
  text-align: left;
  padding: 0 8px 0 16px;
  background: #ffffff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  cursor: pointer;
`

export default AccountModule
