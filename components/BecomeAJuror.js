import React from 'react'
import styled from 'styled-components'
import { breakpoint } from 'lib/microsite-logic'

import background from './assets/become-a-juror-background.png'
import content from './assets/become-a-juror-content.svg'

const medium = css => breakpoint('medium', css)

const BecomeAJuror = () => (
  <BecomeAJurorSection>
    <img src={content} alt="" />
  </BecomeAJurorSection>
)

const BecomeAJurorSection = styled.section`
  background-image: url(${background});
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-size: cover;
  background-position: center;
  overflow: hidden;

  .container {
    text-align: center;
  }
  img {
    margin: 0 auto;
    max-width: 90%;
    ${medium('max-width: 750px;')};
  }
  ${medium('height: 600px;')};
`

export default BecomeAJuror
