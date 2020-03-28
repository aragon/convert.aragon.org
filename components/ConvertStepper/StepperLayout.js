import React, {useMemo} from 'react'
import Button from './Button'
import PropTypes from 'prop-types'
import { css } from 'styled-components'

const smallCaps = css`
  font-size: 32px;
`

function getTitle(anjCount, antCount, stage, toAnj) {
  const anjToAntTitle = (<>Convert {anjCount} <span css={smallCaps}>ANJ</span> to <span css={smallCaps}>ANT</span></>)
  const antToAnjTitle = (<>Convert {antCount} <span css={smallCaps}>ANT</span> to <span css={smallCaps}>ANJ</span></>)
  const antToAnjCompletedTitle = (<>You successfully converted <br/>{antCount} <span css={smallCaps}>ANT</span> to {anjCount} <span css={smallCaps}>ANJ</span></>)
  const anjToAntCompletedTitle = (<>You successfully converted <br/>{antCount} <span css={smallCaps}>ANT</span> to {anjCount} <span css={smallCaps}>ANJ</span></>)

  if (stage === 'working' || 'error') {
    return (
      <>
        {toAnj ? antToAnjTitle : anjToAntTitle}
      </>
    )
  } else if (stage === 'completed') {
    return (
      <>
        {toAnj ? antToAnjCompletedTitle : anjToAntCompletedTitle}
      </>
    )
  } 
}

function Convert({children, anjCount, antCount, stage, toAnj}) {
  const title = useMemo(() => getTitle(anjCount, antCount, stage, toAnj), [anjCount, antCount, stage, toAnj])

  return (
    <div css={`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
      background-color: #F9FAFC;
    `}>
      
      <div css={`
        display: flex;
        flex: 1;
        align-items: flex-end;
      `}>
        <h1 css={`
          margin-bottom: 100px;
          color: #20232C;
          text-align: center;
        `}>
          {title}
        </h1>
      </div>

      <div>
        {children}
      </div>

      <div css={`
        flex: 1;
        width: 100%;
      `}>
        <div css={`padding-top: 90px;`}>

          {stage === 'working' &&
            <p css={`color: #6D7693; text-align: center;`}>This process might take up to a few minutes. Do not close this window until the process is&nbsp;finished.</p>
          }

          {stage === 'error' &&
            <div css={`
              display: grid;
              grid-gap: 12px;
              grid-template-columns: repeat(2, 1fr);
            `}>
              <div css={`
                display: flex;
                justify-content: flex-end;
              `}>
                <Button mode="secondary">Abandon process</Button>
              </div>

              <div>
                <Button>Repeat transaction</Button>
              </div>
            </div>
          }

          {stage === 'completed' &&
            <div css={`
              display: flex;
              justify-content: center;
            `}>
              <Button>Start new conversion</Button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  anjCount: PropTypes.number,
  antCount: PropTypes.number,
  toAnj: PropTypes.bool,
  stage: PropTypes.oneOf([
    'working',
    'completed',
    'error'
  ]),
}

export default Convert
