import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import Battle from '../Battle/electionbattles/Battle'

class MarketsCountDown extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			endTime: null,
			text: "",
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
		}
	}

	componentDidMount() {
		let now = Date.now() / 1000
		const battle = this.props.battle;
		console.log("timer battle, ", battle)
		let endTime = null;
		let text = "";
		if (now < battle.bettingEnd) {
			console.log(1)
			text = "Betting Ends:";
			endTime = battle.bettingEnd;
		} else if (now > battle.bettingEnd && now < battle.battleEnd) {
			console.log(2)
			text = "Tracking Ends:";
			endTime = battle.battleEnd;
		} else if (now > battle.battleEnd) {
			console.log(3)
			endTime = null;
		}
		this.setState({ endTime, text });
		if (!endTime) return;
		let diffTime = endTime - moment.utc().unix();
		let duration = moment.duration(diffTime);
		console.log("here:\n", endTime, "\n", moment.utc().unix(), "\n", diffTime)
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
		if (!this.state.endTime) return null;
		console.log(4);
		return (
			<Container>
				<Text>{this.state.text}</Text>
				<Countdown>
					{this.state.days > 0 &&
						<>
							<Item>
								{this.state.days.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}
							</Item>
							<div>:</div>
						</>
					}
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
			</Container>
		)
	}
}

const Container = styled.div`
position: relative;
left: -50%;
top: 20px;
border: 2px solid black;
    padding: 5px;
	border-radius: 4px;
		background-color: rgba(0,0,0,0.5);
		// background-color: rgba(256,256,256,0.3);
`

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
	// color: black;
	margin-bottom: 3px;
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
font-family: 'SF Mono Semibold';
	font-size: 26px;
  color: rgb(255, 204, 160);
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
	letter-spacing: 1px;
`


export default MarketsCountDown