import React from 'react'
import styled from 'styled-components'
import 'styled-components/macro'
import Fade from 'react-reveal/Fade'
import { breakpoint } from 'lib/microsite-logic'
import { bigNum, useAnJurors } from 'lib/utils'
import { useAntStaked } from 'lib/web3-contracts'
import { formatUnits, useTokenBalanceToUsd } from 'lib/web3-utils'

import anj from './assets/anj-token.svg'
import ant from './assets/ant-token.svg'
import jurors from './assets/juror-total.svg'

const medium = css => breakpoint('medium', css)

function formatAndSplitAmount(value) {
  const formatted = formatUnits(value, { replaceZeroBy: '0' })
  let [whole, decimal] = formatted.split('.')

  // Round and keep the last two digits
  decimal = Math.round(parseInt((decimal || '0').slice(0, 4)) / 100)

  return [whole || '0', decimal ? String(decimal) : '']
}

const Stats = () => {
  const antStaked = useAntStaked()
  const [numOfjurors, activeAnj] = useAnJurors()

  const [wholeAnt, decimalAnt] = formatAndSplitAmount(antStaked)
  const [wholeAnj, decimalAnj] = formatAndSplitAmount(activeAnj)

  const usdAnt = useTokenBalanceToUsd('ANT', 18, bigNum(antStaked))
  const unratedAnj = bigNum(activeAnj.toString()).div(100)
  const usdAnj = useTokenBalanceToUsd('ANT', 18, unratedAnj)

  return (
    <StatsSection>
      <StatsDiv>
        <Fade bottom duration={1200} delay={300}>
          <Stat>
            <TokenImg src={ant} alt="" />
            <h2>Staked ANT</h2>
            <NumberWrapper>
              <h2 className="pink number">
                {wholeAnt}
                {decimalAnt && (
                  <span>
                    .<span className="decimal">{decimalAnt}</span>
                  </span>
                )}
              </h2>
              <h3 className="denomination">ANT</h3>
            </NumberWrapper>
            <h3>{`$${usdAnt} USD`}</h3>
          </Stat>
        </Fade>
        <Fade bottom duration={1200} delay={300}>
          <Stat>
            <TokenImg src={anj} alt="" />
            <h2>Active ANJ</h2>
            <NumberWrapper>
              <h2 className="pink number">
                {wholeAnj}
                {decimalAnj && (
                  <span>
                    .<span className="decimal">{decimalAnj}</span>
                  </span>
                )}
              </h2>
              <h3 className="denomination">ANJ</h3>
            </NumberWrapper>
            <h3>{`$${usdAnj} USD`}</h3>
          </Stat>
        </Fade>
        <Fade bottom duration={1200} delay={300}>
          <Stat
            css={`
              @media screen and (max-width: 1024px) {
                margin-bottom: 114px;
              }
            `}
          >
            <TokenImg src={jurors} alt="" />
            <h2>Total Jurors</h2>
            <NumberWrapper jurors>
              <h2 className="pink number">{numOfjurors}</h2>
              <h3 className="denomination">ACTIVE JURORS</h3>
            </NumberWrapper>
          </Stat>
        </Fade>
      </StatsDiv>
    </StatsSection>
  )
}

const TokenImg = styled.img`
  width: 50px;
  height: 56px;
  margin-bottom: 24px;
  @media screen and (max-width: 1024px) {
    margin: auto;
    margin-bottom: 24px;
  }
`
const NumberWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${props => (props.jurors ? '34px' : '')};
  @media screen and (max-width: 1024px) {
    margin: auto;
    text-align: center;
  }
`
const Stat = styled.div`
  width: 278px;
  min-height: 191px;
  display: flex;
  flex-direction: column;

  h2 {
    color: white;
    font-size: 27px;
  }

  h3 {
    color: white;
    font-size: 20px;
  }
  .number {
    font-size: 48px;
  }

  .decimal {
    padding-top: 8px;
    font-size: 36px;
  }

  .denomination {
    margin-left: 8px;
    padding-top: 19px;
    font-size: 22px;
    color: #8a96a0;
  }

  .pink {
    font-weight: bold;
    letter-spacing: -0.45px;
    color: rgba(1, 191, 227);
    background: linear-gradient(
      to right,
      #ff7c7c 20%,
      #ffc58f 40%,
      #ffc58f 60%,
      #ff7c7c 80%
    );
    background-size: 200% auto;
    background-clip: text;
    text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    animation: shine 4s linear infinite;
    display: block;
    ${medium('display: inline;')};
  }
  @media screen and (max-width: 1024px) {
    text-align: center;
    margin-bottom: 32px;
  }
`
const StatsSection = styled.section`
  position: relative;
  z-index: 1;
  background: #1c1c1c;
  min-height: 200px;
`

const StatsDiv = styled.div`
  width: 80%;
  max-width: 1180px;
  margin: auto;
  margin-bottom: 120px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  @media screen and (max-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    margin: auto;
  }
`

export default Stats
