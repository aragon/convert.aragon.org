import React from 'react'
import styled from 'styled-components'
import guide from './assets/juror-guide.svg'
import howto from './assets/howto-anj.svg'
import tech from './assets/tech-breakdown.svg'

const CourtGuides = () => (
  <GuidesSection id="learn">
    <Card>
      <img src={guide} alt="" />
      <div className="info">
        <h2>Juror Dashboard User Guide</h2>
        <br />
        <h3>
          Rewards &amp; responsibilities,
          <br /> Step by Step guide
        </h3>
        <br />
        <a href="https://help.aragon.org/article/41-aragon-court">
          Read more
        </a>
      </div>
    </Card>
    <Card>
      <img src={howto} alt="" />{' '}
      <div className="info">
        <h2>Precedence Campaign</h2>
        <br />
        <h3>
          Learn more about the first disputes to be tried
          <br />
        </h3>
        <br />
        <a href="https://blog.aragon.org/precedence-campaign-primer/">Read more</a>
      </div>
    </Card>
    <Card>
      <img src={tech} alt="" />{' '}
      <div className="info">
        <h2>Technical Breakdown</h2>
        <br />
        <h3>
          Deep technical dive on Aragon Court
          <br />
        </h3>
        <br />
        <a href="https://blog.aragon.one/aragon-court-v1-technical-details/">
          Read more
        </a>
      </div>
    </Card>
  </GuidesSection>
)

const Card = styled.div`
  width: 80%;
  max-width: 350px;
  position: relative;
  height: 392px;
  border-radius: 8px;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  margin: 8px 8px 8px 8px;

  img {
    grid-row-start: 1;
  }

  .info {
    padding: 24px 24px 24px 24px;
    grid-row-start: 2;
    h2 {
      font-weight: normal;
      font-size: 27px;
      margin: 0;
    }

    h3 {
      color: #8a96a0;
      font-size: 20px;
      margin: 0;
    }

    a {
      font-size: 20px;
      font-weight: medium;
      color: #ff9780;
      position: absolute;
      bottom: 5%;
    }
  }
`
const GuidesSection = styled.section`
  padding: 16px 0px 16px 0px;
  position: relative;
  z-index: 1;
  background: #f9fafc;
  min-height: 588px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  @media screen and (max-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    margin: auto;
  }
`

export default CourtGuides
