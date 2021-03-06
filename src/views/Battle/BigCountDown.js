import React from 'react'
import moment from 'moment'
import styled from 'styled-components'

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

class CountDown extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0
		}
	}

	componentDidMount() {
		let diffTime = this.props.launchDate - moment.utc();
		let duration = moment.duration(diffTime);
		console.log("duration", duration)
		setInterval(() => {
			duration = moment.duration(duration - 1000);
			this.setState({
				days: duration.days(),
				hours: duration.hours(),
				minutes: duration.minutes(),
				seconds: duration.seconds()
			})
		}, 1000);
	}

	render() {
		return (
			<Timer>
				<Countdown>
					<Item>
						{this.state.days.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
						<TimerText>Days</TimerText>
					</Item>
					<div>:</div>
					<Item>
						{this.state.hours.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
						<TimerText>Hours</TimerText>
					</Item>
					<div>:</div>
					<Item>
						{this.state.minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
						<TimerText>Minutes</TimerText>
					</Item>
					<div>:</div>
					<Item>
						{this.state.seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
						<TimerText>Seconds</TimerText>
					</Item>
				</Countdown>
			</Timer>
		)
	}
}

const Item = styled.div`
text-align: center;
`

const TimerText = styled.div`
text-align: center;
width: 100%;
margin-top: 1vh;
font-family: "Gilroy";
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const Countdown = !isMobile() ? styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
font-family: "Gilroy";
  font-size: 80px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 80px;
  letter-spacing: 2px;
  color: #ffffff;
` : styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
font-family: "Gilroy";
  font-size: 60px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 80px;
  letter-spacing: 2px;
  color: #ffffff;
`

const Timer = !isMobile() ? styled.div`
width: 480px;
height: 50%;
margin: auto;
margin-top: 3vh;
` : styled.div`
width: 90vw;
height: 50%;
margin: auto;
margin-top: 3vh;
`


export default CountDown