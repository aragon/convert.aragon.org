import React from 'react'
import styled from 'styled-components/macro'

function Token({ symbol, badge }) {
  return (
    <TokenSection className={badge ? 'badge' : undefined}>
      <div>
        <img src={require(`./assets/${symbol.toLowerCase()}.svg`)} alt="" />
        <span>{symbol}</span>
      </div>
    </TokenSection>
  )
}

const TokenSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 38px;
  padding: 0 8px;
  &.badge {
    top: -5px;
    margin: 0 5px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15);
    border-radius: 100px;
  }
  > div {
    flex-shrink: 1;
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 22px;
    color: #8a96a0;
    margin: 0;
  }
  img {
    flex-grow: 0;
    flex-shrink: 0;
    margin: 0 6px 0 2px;
  }
  span {
    position: relative;
    top: 3px;
    padding-right: 4px;
  }
`

export default Token
