import React from 'react'
import styled from 'styled-components'
import { breakpoint } from 'lib/microsite-logic'
import { FIRST_TERM } from 'lib/utils'
import Timer from '../Timer'

import content from '../assets/convert-module.png'
import lock from '../assets/lock.svg'
import contentMobile from '../assets/convert-module-mobile.png'

const medium = css => breakpoint('medium', css)

const LockedConverter = () => (
  <LockedConverterSection id="get-anj">
    <Content className="medium" src={content} />
    <Content className="mobile" src={contentMobile} />
    <a href="#how-it-works">
      <img src={lock} alt="" />
      <div>
        <p>The world's first digital jurisdiction opens in </p>
        <Timer date={FIRST_TERM} />
      </div>
    </a>
  </LockedConverterSection>
)

const LockedConverterSection = styled.section`
  background: linear-gradient(
    to top,
    #fff 0%,
    #fff 83.5%,
    #1c1c1c 83.5%,
    #1c1c1c 100%
  ) !important;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  a {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 328px;
    background: #ffffff;
    border: 2px solid rgba(212, 220, 227, 0.5);
    box-sizing: border-box;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 20px 12px;
    div {
      padding-right: 10px;
      ${medium('padding-right: 28px;')};
    }
    p {
      font-family: 'FontRegular', sans-serif;
      font-size: 18px;
      line-height: 1.43;
      display: flex;
      align-items: center;
      color: #8a96a0;
      margin: 0;
      padding-bottom: 8px;
      ${medium('font-size: 23px;')};
    }
    ${medium('width: 376px;')};
  }
  a img {
    max-width: 94px;
    padding-right: 10px;
    ${medium('padding-right: 16px;')};
  }
  .mobile {
    display: inline;
    ${medium('display: none;')};
  }
  .medium {
    display: none;
    ${medium('display: inline;')};
  }
`
const Content = styled.img`
  margin: 0 auto;
  max-width: 90%;
  ${medium('max-width: calc(80% + 30px);')};
`

export default LockedConverter
