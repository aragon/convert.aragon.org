import React from 'react'
import styled from 'styled-components'
import error from './assets/error.svg'
import repeat from './assets/repeat.svg'

function ErrorSection({ onDone }) {
  return (
    <Error>
      <div>
        <img src={error} alt="" />
        <p className="red">Something went wrong</p>
        <p>An error occurred with the transaction.</p>
        <Button onClick={onDone}>
          <img src={repeat} alt="" />
          Repeat transaction
        </Button>
      </div>
    </Error>
  )
}

const Error = styled.div`
  min-width: 1109px;
  height: 530px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  img {
    margin-bottom: 15px;
  }
  p {
    max-width: 410px;
    margin: 0;
  }
  p.red {
    color: #ff7c7c;
  }
`

const Button = styled.button`
  background: linear-gradient(198.02deg, #ffb36d 6.08%, #ff8888 93.18%);
  border: 0px solid transparent;
  color: white;
  box-sizing: border-box;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
  margin-top: 30px;
  border-radius: 4px;
  width: 227px;
  height: 52px;
  text-align: center;
  font-size: 20px;
  line-height: 31px;
  text-align: center;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
  }
  img {
    padding-right: 10.5px;
    margin: 0;
  }
`

export default ErrorSection
