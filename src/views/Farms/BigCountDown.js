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
			milliseconds: 0,
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
				milliseconds: duration._milliseconds,
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
				<CountDownText href="https://yieldwars.medium.com/yieldwars-markets-are-coming-here-is-what-you-need-to-know-2a73fb7c1e18" target="_blank">Announcing... YieldWars Markets</CountDownText>
				{/* <CountDownText>Are You Ready for the Next Frontier?</CountDownText> */}
				{this.state.milliseconds > 0 &&
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
				}
			</Timer>
		)
	}
}

const CountDownText = styled.a`
margin-bottom: 20px;
width: 100%;
font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const Item = styled.div`
text-align: center;
width: 120px;
color: rgb(255, 204, 74);
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
margin-top: 20px;
flex-direction: row;
justify-content: space-evenly;
font-family: "Gilroy";
  font-size: 90px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 80px;
  letter-spacing: 2px;
  color: rgb(255, 204, 74);
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
width: 600px;
margin: 0 auto;
` : styled.div`
width: 90vw;
height: 50%;
margin: auto;
margin-top: 3vh;
`


export default CountDown