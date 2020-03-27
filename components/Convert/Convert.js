import React from 'react'
import ConvertSteps from './ConvertSteps'

function Convert() {
  return (
    <div css={`
      display: flex;

      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 100vh;
      background-color: grey;
    `}>

      <ConvertSteps />
    </div>
  )
}



export default Convert
