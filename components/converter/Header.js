import React from 'react'
import styled from 'styled-components'
import { breakpoint } from 'lib/microsite-logic'
import AccountModule from './AccountModule'

const large = css => breakpoint('large', css)
const medium = css => breakpoint('medium', css)

const HeaderSection = () => {
  return (
    <Header>
      <AccountModule />
    </Header>
  )
}

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
