import React, { useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-bootstrap/Modal'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Button from 'react-bootstrap/Button'

function MenuModal() {
  const [show, setShow] = useState(false)

  const close = () => setShow(false)
  const toggle = () => setShow(show => !show)

  return (
    <ButtonToolbar>
      <Button
        className={
          show
            ? 'hamburger hamburger-spin is-active'
            : 'hamburger hamburger-spin'
        }
        type="button"
        onClick={toggle}
      >
        <span className="hamburger-box">
          <span className="hamburger-inner" />
        </span>
      </Button>
      <StyledModal size="lg" aria-labelledby="title" show={show} onHide={close}>
        <LinksBox>
          <div className="links">
            <ul>
              <li>
                <a href={'./#get-anj'} onClick={close}>
                  Get ANJ
                </a>
              </li>
              <li>
                <a href={'./#learn'} onClick={close}>
                  Learn
                </a>
              </li>

              <li>
                <a href={'./#subscribe'} onClick={close}>
                  Subscribe
                </a>
              </li>
            </ul>
          </div>
        </LinksBox>
      </StyledModal>
    </ButtonToolbar>
  )
}

const LinksBox = styled.div`
  width: 100%;
  .links {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
    background-size: 126% 124%;
    position: relative;
  }
  a {
    color: white !important;
    text-decoration: none !important;
  }
`

const StyledModal = styled(Modal)`
  background: #1c1c1c;
  transition: all 0.25s linear;
  .modal-dialog {
    max-width: 80%;
    width: 1000px;
    min-width: 50%;
    margin: 100px auto;
  }
  .modal-content {
    background: #1c1c1c;
    display: flex;
    flex-direction: row;
    align-items: stretch;

    ul {
      list-style-type: none;
      padding: 60px 0;
    }
    li {
      font-family: 'HKGrotesk';
      font-weight: 800;
      font-size: 2.92rem;
      line-height: 4.42rem;
    }
  }
`

export default MenuModal
