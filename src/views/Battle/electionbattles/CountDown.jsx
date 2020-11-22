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

		let endTime = this.props.endTime;
		// const format = 'hh:mm:ss';
		// if (moment.utc().isBetween(moment.utc('18:00:00', format), moment.utc('19:00:00', format))) {
		// 	this.setState({inBetween: true})
		// 	endTime = moment.utc().startOf('hour').hours(19)
		// } else {
		// 	if (moment.utc().isBetween(moment.utc('19:00:00', format), moment.utc('23:59:59', format))) {
		// 		endTime = moment.utc().add(1, 'days').startOf('hour').hours(18)
		// 	} else {
		// 		endTime = moment.utc().startOf('hour').hours(18)
		// 	}
		// }

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

			<Countdown>
				<Text>Betting Ends:</Text>
				<Item>
					{this.state.days.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
					{/* <TimerText>Hours</TimerText> */}
				</Item>
				<div>:</div>
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
		)
	}
}

const Item = styled.div`
text-align: center;
`

const Text = styled.div`
font-family: "Gilroy";
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #ffffff;
  margin-right: 3px;
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
  letter-spacing: normal;
  color: #ffffff;
`

const Countdown = styled.div`
display: flex;
margin-left: 5px;
font-family: "Gilroy";
	font-size: 20px;
  color: rgb(255, 204, 160);
	
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: 2px;
`


export default CountDown