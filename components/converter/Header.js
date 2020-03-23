import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { animated, useTransition } from 'react-spring'
import { breakpoint } from 'lib/microsite-logic'
import Token from './Token'
import AccountModule from './AccountModule'

const large = css => breakpoint('large', css)
const medium = css => breakpoint('medium', css)
const AnimDiv = animated.div

const tokens = [
  <Token symbol="ANT" badge />,
  <Token symbol="DAI" badge />,
  <Token symbol="ETH" badge />,
  <Token symbol="USDC" badge />,
]

const HeaderSection = () => {
  const [selectedSymbol, setSelectedSymbol] = useState(0)

  useEffect(() => {
    const interval = setInterval(
      () => setSelectedSymbol(symbol => (symbol + 1) % 4),
      3000
    )
    return () => clearInterval(interval)
  })

  const transitions = useTransition(selectedSymbol, p => p, {
    from: { opacity: 0, transform: 'translateY(50%)' },
    enter: { opacity: 1, transform: 'translateY(0%)' },
    leave: { opacity: 0, transform: 'translateY(-50%)' },
  })

  return (
    <Header>
      <h1>
        Convert{'  '}
        <AnimContainer>
          {transitions.map(({ item, props, key }) => {
            const token = tokens[item]
            return (
              <AnimDiv
                style={{ ...props, position: 'absolute', top: 0, left: 0 }}
                key={key}
              >
                {token}
              </AnimDiv>
            )
          })}
        </AnimContainer>
        to <Token symbol="ANJ" badge />
      </h1>
      <AccountModule />
    </Header>
  )
}

const AnimContainer = styled.div`
  position: relative;
  display: block;
  width: 100px;
  height: 35px;
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  height: 120px;
  padding: 15px 20px;
  border-bottom: solid 1px #ededed;
  flex-direction: column;

  h1 {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 28px;
    line-height: 1.1;
    color: #1c1c1c;
    margin: 0;
    flex-wrap: wrap;
    ${medium('font-size: 38px; max-width: 84%;')};
  }
  ${medium(
    'align-items: center; justify-content: space-between; flex-direction: row; height: 100px;'
  )};
  ${large(
    'align-items: center; justify-content: space-between; flex-direction: row; padding: 35px; height: 100px;'
  )};
`

export default HeaderSection
