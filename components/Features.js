import React from 'react'
import styled from 'styled-components'
import Fade from 'react-reveal/Fade'
import { breakpoint } from 'lib/microsite-logic'

import feature1 from './assets/features1.svg'
import feature2 from './assets/features2.svg'
import feature3 from './assets/features3.svg'

const medium = css => breakpoint('medium', css)

const Features = () => (
  <FeaturesSection>
    <Container>
      <Fade bottom duration={1200} delay={300} distance={'50%'}>
        <div>
          <img src={feature1} alt="" />
          <h3>Earn income online</h3>
          <p>
            Earn juror rewards from anywhere with an internet connection by
            successfully adjudicating disputes
          </p>
        </div>
      </Fade>
      <Fade bottom duration={1200} delay={600} distance={'50%'}>
        <div>
          <img src={feature2} alt="" />
          <h3>Flexible scheduling</h3>
          <p>
            You decide when to make yourself available to rule on court cases or
            take a break and go offline
          </p>
        </div>
      </Fade>
      <Fade bottom duration={1200} delay={900} distance={'50%'}>
        <div>
          <img src={feature3} alt="" />
          <h3>Meaningful work</h3>
          <p>
            Help people around the world access justice with more convenience
            and lower costs than traditional courts
          </p>
        </div>
      </Fade>
    </Container>
  </FeaturesSection>
)

const FeaturesSection = styled.section`
  background: white;
  padding: 95px 0 85px 0;
`
const Container = styled.div`
  width: 80%;
  margin: auto;
  text-align: center;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  div {
    padding: 15px;
    text-align: left;
  }
  p {
    font-weight: 400;
    text-align: left;
    margin: 0;
    font-size: 20px;
    line-height: 31px;
    color: #8a96a0;
    max-width: 355px;
  }
  h3 {
    text-align: left;
    font-weight: 400;
    font-size: 27px;
    line-height: 38px;
    color: #000;
    margin: 25px 0 7px 0;
  }
  ${medium('flex-direction: row;')};
`

export default Features
