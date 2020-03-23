import React from 'react'
import styled from 'styled-components'
import background from './assets/subscribe-background.svg'

const Subscribe = () => (
  <SubscribeSection id="subscribe">
    <Container>
      <div>
        <h3>Want to use Aragon Court for your organization?</h3>
        <p>
          Prevent and resolve disputes more efficiently than traditional courts.
          <br /> Leave your email and we'll be in touch!
        </p>
        <form
          action="https://aragon.us15.list-manage.com/subscribe/post?u=a590aa3843a54b079d48e6e18&amp;id=9c51454655"
          method="post"
          name="mc-embedded-subscribe-form"
          target="_blank"
          noValidate
        >
          <div className="email-field">
            <input
              type="email"
              name="EMAIL"
              placeholder="Enter Email Address"
              className="required email"
              id="mce-EMAIL"
            />
            <div
              aria-hidden="true"
              style={{ position: 'absolute', left: '-5000px' }}
            >
              <input
                type="text"
                name="b_a590aa3843a54b079d48e6e18_e81a44c4bd"
                tabIndex="-1"
              />
            </div>
            <div className="button-div">
              <button
                type="submit"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="button"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </Container>
  </SubscribeSection>
)

const SubscribeSection = styled.section`
  padding: 50px 15px 100px 15px;
  z-index: 3;
  min-height: 463px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    207.23deg,
    rgba(255, 179, 109) 6.08%,
    rgba(255, 136, 136) 93.18%
  );
  background-image: url(${background});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  .email-field {
    display: inline-flex;
    ::placeholder {
      color: #707291;
      font-weight: bold;
    }
  }
  input {
    height: auto;
    max-height: 54px;
    width: 404px;
    max-width: calc(80vw - 160px);
    padding: 12px 20px 5px 20px;
    background: #ffffff;
    background-color: #ffffff;
    border-radius: 8px 0 0 8px;
    border: solid white;
    outline: none;
    font-size: 18px;
  }
  .button-div {
    height: 54px;
    background: white;
    border-radius: 0 8px 8px 0;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    button {
      padding: 12px 20px 5px 20px;
      background: linear-gradient(
        207.23deg,
        rgba(255, 179, 109) 6.08%,
        rgba(255, 136, 136) 93.18%
      );
      opacity: 0.4;
      border-radius: 8px;
      border: solid 0 transparent;
      color: white;
      height: 44px;
      width: 140px;
      outline: none;
      font-size: 18px;
    }
    button:hover {
      opacity: 1;
    }
  }
`
const Container = styled.div`
  text-align: center;
  p {
    font-weight: 400;
    text-align: center;
    margin: 0 auto 30px auto;
    color: #ffffff;
    font-size: 24px;
    line-height: 34px;
    max-width: 860px;
  }
  h3 {
    font-weight: 800;
    font-size: 37px;
    line-height: 38px;
    color: #ffffff;
    text-align: center;
    margin: 50px auto 15px;
    display: block;
  }
`

export default Subscribe
