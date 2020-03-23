import React from 'react'
import styled from 'styled-components'
import { breakpoint } from 'lib/microsite-logic'
import MenuModal from './MenuModal'

import logo from './assets/logo.svg'

const medium = css => breakpoint('medium', css)

function Navbar() {
  return (
    <Container>
      <CourtNavbar>
        <Left>
          <LogoLink to="/">
            <img src={logo} alt="" />
          </LogoLink>
          <LinksBox>
            <a href="./#get-anj">Become a Juror</a>
            <a href="./#learn">Learn</a>
            <a href="./#how-it-works">Dispute Example</a>
            <a href="./#subscribe">Subscribe</a>
          </LinksBox>
        </Left>
        <MenuModalBox>
          <MenuModal />
        </MenuModalBox>
      </CourtNavbar>
    </Container>
  )
}

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`
const LinksBox = styled.div`
  display: none;
  ${medium('display: block;')};
  a {
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    padding: 15px;
  }
`
const Container = styled.div`
  width: 100%;
  max-width: 1180px;
  height: 65px;
  background: #1c1c1c;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
`

const CourtNavbar = styled.div`
  width: 76%;
  max-width: 1180px;
  height: 65px;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3000;
`
const MenuModalBox = styled.div`
  display: block;
  ${medium('display: none;')};
`

const LogoLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100%;
  padding-right: 15px;
  img {
    height: 50px;
  }
`

export default Navbar
