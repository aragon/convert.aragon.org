import React from 'react'
import styled from 'styled-components'

class Timer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
    }
  }

  componentDidMount() {
    // update every second
    this.interval = setInterval(() => {
      const date = this.calculateTimer(this.props.date)
      date ? this.setState(date) : this.stop()
    }, 1000)
  }

  componentWillUnmount() {
    this.stop()
  }

  calculateTimer(endDate) {
    let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000

    // clear countdown when date is reached
    if (diff <= 0) return false

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      min: 0,
      sec: 0,
      millisec: 0,
    }

    // calculate time difference between now and expected date
    if (diff >= 365.25 * 86400) {
      // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400))
      diff -= timeLeft.years * 365.25 * 86400
    }
    if (diff >= 86400) {
      // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400)
      diff -= timeLeft.days * 86400
    }
    if (diff >= 3600) {
      // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600)
      diff -= timeLeft.hours * 3600
    }
    if (diff >= 60) {
      timeLeft.min = Math.floor(diff / 60)
      diff -= timeLeft.min * 60
    }
    timeLeft.sec = diff

    return timeLeft
  }

  stop() {
    clearInterval(this.interval)
  }

  addLeadingZeros(value) {
    value = String(value)
    while (value.length < 2) {
      value = '0' + value
    }
    return value
  }

  render() {
    const countDown = this.state
    const hasDays = countDown.days > 0

    return (
      <Container>
        {hasDays && (
          <div>
            <p>
              <span>{this.addLeadingZeros(countDown.days)}</span> D
            </p>
          </div>
        )}
        <div>
          <p>
            <span>{this.addLeadingZeros(countDown.hours)}</span> H
          </p>
        </div>
        <div>
          <p>
            <span>{this.addLeadingZeros(countDown.min)}</span> M
          </p>
        </div>
        {!hasDays && (
          <div>
            <p>
              <span>{this.addLeadingZeros(countDown.sec)}</span> S
            </p>
          </div>
        )}
      </Container>
    )
  }
}

const Container = styled.div`
  position: relative;
  display: flex;
  margin: 0 -10px;
  div {
    padding: 0 10px;
    span {
      color: black;
    }
  }
`

Timer.defaultProps = {
  date: new Date(),
}

export default Timer
