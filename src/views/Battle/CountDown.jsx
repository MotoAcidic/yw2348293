import React from 'react'
import moment from 'moment'
import styled from 'styled-components'

class CountDown extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			inBetween: false,
		}
	}

	componentDidMount() {

		let endTime;
		const format = 'hh:mm:ss';
		if (moment.utc().isBetween(moment.utc('15:00:00', format), moment.utc('16:00:00', format))) {
			this.setState({inBetween: true})
			endTime = moment.utc().startOf('hour').hours(16)
		} else {
			if (moment.utc().isBetween(moment.utc('16:00:00', format), moment.utc('23:59:59', format))) {
				endTime = moment.utc().add(1, 'days').startOf('hour').hours(15)
			} else {
				endTime = moment.utc().startOf('hour').hours(15)
			}
		}

		let diffTime = endTime - moment.utc();
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
			<Desc>
				{this.state.inBetween ? "Next vote starts in" : "Voting ends in"}
				<Countdown>
					<Item>
						{this.state.hours.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
						{/* <TimerText>Hours</TimerText> */}
					</Item>
					<div>:</div>
					<Item>
						{this.state.minutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
						{/* <TimerText>Minutes</TimerText> */}
					</Item>
					<div>:</div>
					<Item>
						{this.state.seconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
						{/* <TimerText>Seconds</TimerText> */}
					</Item>
				</Countdown>
			</Desc>
		)
	}
}

const Item = styled.div`
text-align: center;
`

const Desc = styled.div`
display: flex;
align-items: center;
font-family: "Gilroy";
  font-size: 20px;
	font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
	color: #ffffff;
	margin-bottom: 20px;
`;

const TimerText = styled.div`
text-align: center;
width: 100%;
margin-top: 1vh;
font-family: "Gilroy";
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #ffffff;
`

const Countdown = styled.div`
display: flex;
margin-left: 5px;
font-family: "Gilroy";
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 2px;
  color: #ffb700;
`


export default CountDown