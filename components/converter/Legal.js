import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Anchor from '../Anchor/Anchor'
import processing from './assets/loader.gif'

function Legal({ handleConvert }) {
  const [legalChecked, setLegalChecked] = useState(false)
  return (
    <PendingIn>
      <div>
        <img src={processing} alt="" />
        <p className="black">These actions require multiple transactions</p>
        <p>
          Please sign them one after another and do not close this window until
          the process is finished.
        </p>
        <Button onClick={handleConvert} disabled={!legalChecked}>
          Create transaction
        </Button>
        <Conditions>
          <label>
            <input
              type="checkbox"
              onChange={() => setLegalChecked(legalChecked => !legalChecked)}
              checked={legalChecked}
            />
            By clicking on “Create transaction” you are accepting our{' '}
            <Anchor href="https://anj.aragon.org/legal/terms-general.pdf">
              legal terms
            </Anchor>
            .
          </label>
        </Conditions>
      </div>
    </PendingIn>
  )
}

Legal.propTypes = {
  handleConvert: PropTypes.func,
}
const PendingIn = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;
  text-align: center;
  img {
    margin-bottom: 15px;
    height: 100px;
  }
  p {
    max-width: 410px;
    margin: 0;
  }
  p.black {
    color: #000;
  }
`

const Button = styled.button`
  background: linear-gradient(198.02deg, #ffb36d 6.08%, #ff8888 93.18%);
  border: 0px solid transparent;
  color: white;
  box-sizing: border-box;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
  margin-top: 16px;
  border-radius: 4px;
  width: 227px;
  height: 52px;
  text-align: center;
  font-size: 16px;
  line-height: 31px;
  text-align: center;
  cursor: pointer;
  &:disabled,
  &[disabled] {
    opacity: 0.5;
    cursor: inherit;
  }
`

const Conditions = styled.p`
  margin: 24px 0;

  label {
    display: block;
    font-size: 16px;
    line-height: 1.3;
    margin-bottom: 0;
    margin-top: 8px;
  }

  input {
    margin-right: 8px;
    vertical-align: text-top;
  }
`

export default Legal
