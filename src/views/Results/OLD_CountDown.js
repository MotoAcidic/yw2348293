import React from 'react'
import moment from 'moment'
import styled from 'styled-components'

class CountDown extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			launchDate: 1609459200,
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0
		}
	}

	componentDidMount() {
		let diffTime = this.props.launchDate - parseInt(Math.round(new Date().getTime()));
		let duration = moment.duration(diffTime);
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

const Countdown = styled.div`
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
`

const Timer = styled.div`
width: 480px;
height: 50%;
margin: auto;
margin-top: 3vh;
`


export default CountDown