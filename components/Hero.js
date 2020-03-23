import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { breakpoint } from 'lib/microsite-logic'

import background from './assets/hero-background.svg'

const medium = css => breakpoint('medium', css)
const large = css => breakpoint('large', css)

const Hero = () => (
  <HeroSection>
    <TextContainer>
      <Fade bottom duration={1200} delay={300}>
        <h1>
          Become a juror <span className="mobile">for</span>{' '}
        </h1>
        <div>
          <h1>
            <span className="medium">for</span>{' '}
            <span className="pink">Aragon Court</span>
          </h1>
        </div>
      </Fade>
      <Fade bottom duration={1200} delay={600}>
        <h2>
          Aragon Court handles subjective disputes that require the judgment of
          human jurors. These jurors stake a token called ANJ which allows them
          to be drafted into juries and earn fees for successfully adjudicating
          disputes.
        </h2>
      </Fade>
    </TextContainer>
  </HeroSection>
)

const HeroSection = styled.section`
  position: relative;
  z-index: 1;
  background: #1c1c1c;
  padding-top: 64px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  overflow: hidden;
  padding-bottom: 0px;
  min-height: 600px;
  background-image: url(${background});
  background-position: 100% center;
  background-repeat: no-repeat;
`

const TextContainer = styled.div`
  width: 80%;
  max-width: 1180px;
  margin: auto;
  padding-top: 40px;

  h1 {
    font-family: 'HKGrotesk';
    font-weight: 800;
    font-size: 50px;
    line-height: 1;
    margin: 0;
    text-align: left;
    letter-spacing: -0.447059px;
    color: #ffffff;
    ${medium('font-size: 76px;')};
    ${large('font-size: 86px;')};
  }
  ${medium('padding-top: 0;')};
  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
  .pink {
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
  h2 {
    font-weight: 400;
    font-size: 20px;
    ${medium('font-size: 24px;')};
    line-height: 1.58;
    text-align: left
    color: white;
    max-width: 750px;
    margin-top: 20px;
  }
  span.mobile {
    display: inline;
    ${medium('display: none;')};
  }
  span.medium {
    display: none;
    ${medium('display: inline;')};
  }
`
export default Hero
