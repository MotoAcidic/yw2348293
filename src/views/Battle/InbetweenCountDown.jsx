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
		}
	}

	componentDidMount() {

		let endTime;
		const format = 'hh:mm:ss';
		if (moment.utc().isBetween(moment.utc('18:00:00', format), moment.utc('23:59:59', format))) {
			endTime = moment.utc().add(1, 'days').startOf('hour').hours(18)
		} else {
			endTime = moment.utc().startOf('hour').hours(18)
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
				<Title>
					Current battle ending in
					</Title>
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

const Title = styled.div`
font-family: "Gilroy";
  font-size: 30px;
	font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
	color: #ffffff;
	margin-bottom: 20px;
`

const Item = styled.div`
text-align: center;
`

const Desc = styled.div`
display: flex;
flex-direction: column;
align-items: center;
font-family: "Gilroy";
  font-size: 20px;
	font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
	color: #ffffff;
	margin-bottom: 20px;
`;

const Countdown = styled.div`
display: flex;
margin-left: 5px;
font-family: "Gilroy";
  font-size: 60px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 2px;
  color: #ffb700;
`


export default CountDown