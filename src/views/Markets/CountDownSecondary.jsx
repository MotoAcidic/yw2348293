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
			text = "Betting Ends:";
			endTime = battle.bettingEnd;
		} else if (now > battle.bettingEnd && now < battle.battleEnd) {
			text = "Tracking Ends:";
			endTime = battle.battleEnd;
		} else if (now > battle.battleEnd) {
			console.log(3)
			endTime = null;
		}
		if (!endTime) return;

		endTime *= 1000;
		let diffTime = endTime - moment.utc();
		let duration = moment.duration(diffTime);
		setInterval(() => {
			duration = moment.duration(duration - 1000);
			this.setState({
				days: duration.days(),
				hours: duration.hours(),
				minutes: duration.minutes(),
				seconds: duration.seconds(),
				endTime,
				text,
			})
		}, 1000);
	}

	render() {
		if (!this.state.endTime) return null;
		return (
			<Container>
				<Text>{this.state.text}</Text>
				{this.state.endTime > moment.utc() ?
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
					:
					<Countdown>
						Now!
				</Countdown>
				}
			</Container>
		)
	}
}

const Container = styled.div`
position: relative;
left: -50%;
border: 2px solid black;
    padding: 5px;
    border-radius: 0px 0px 4px 4px;
		background-color: rgba(0,0,0,0.5);
		top: 2px;
		border-top: none;
`

const Item = styled.div`
text-align: center;
`

const Text = styled.div`
font-family: "Gilroy";
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: #ffffff;
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
justify-content: center;
font-family: 'SF Mono Semibold';
	font-size: 12px;
  color: rgb(255, 204, 160);
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
	letter-spacing: 1px;
`


export default MarketsCountDown