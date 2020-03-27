import React from 'react'
import PropTypes from 'prop-types'

export const STEP_STATUS = {
  WAITING: 'WAITING',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
}

function Step({title, status}) {
  function statusDesc() {
    if (status === STEP_STATUS.WAITING) {
      return 'waiting'
    } else if (status === STEP_STATUS.IN_PROGRESS) {
      return 'in progress'
    } else if (status === STEP_STATUS.SUCCESS) {
      return 'success'
    } else if (status === STEP_STATUS.ERROR) {
      return 'error'
    }
  }

  return (
    <div css={`
      display: flex;
      flex-direction: column;
      align-items: center;
    `}>
      <div css={`
        background-color: red;
        height: 100px;
        width: 100px;
        margin-bottom: 30px;
      `}>

      </div>
      <h2 css={`
        text-align: center;
        margin-bottom: 10px;
        font-size: 20px;
      `}>
        {title}
      </h2>
      <p css={`
        text-align: center;
        margin-bottom: 0;
        font-size: 14px;
      `}>
        {statusDesc()}
      </p>
    </div>
  )
}


Step.propTypes = {
  title: PropTypes.string,
  status: PropTypes.oneOf([
    STEP_STATUS.WAITING,
    STEP_STATUS.IN_PROGRESS,
    STEP_STATUS.SUCCESS,
    STEP_STATUS.ERROR,
  ]),
}



export default Step
