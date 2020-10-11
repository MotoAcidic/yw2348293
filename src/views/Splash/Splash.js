import React from 'react'
import moment from 'moment'
import styled from 'styled-components'
import Sky from '../../assets/img/skybig.png'
import Landscape from '../../assets/img/landscapebig.png'
import Logo from '../../assets/img/logo.png'

class Splash extends React.Component {
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
		let diffTime = this.state.launchDate - parseInt(Math.round(new Date().getTime()));
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
			<StyledCanvas>
				<StyledSky/>
				<StyledLandscape/>
				<ContentContainer>
					<img src={Logo} width="180px"></img>
					<Nav>
						<StyledLink href="https://discord.gg/8pppSYe">Discord</StyledLink>
						<StyledLink href="https://telegram.com">Telegram</StyledLink>
						<StyledLink href="https://github.com">Github</StyledLink>
						<StyledLink href="https://twitter.com">Twitter</StyledLink>
					</Nav>
					<Title>Humble Farmers, RISE UP!</Title>
					<TimerContainer>
						<Text>Coming Soon</Text>
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
					</TimerContainer>
				</ContentContainer>
			</StyledCanvas>
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

const Label = styled.div`
display: flex;
flex-direction: row;
justify-content: space-evenly;
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
  line-height: 1;
  letter-spacing: 5px;
  color: #ffffff;
`

const Timer = styled.div`
width: 90%;
height: 50%;
margin: auto;
margin-top: 3vh;
`

const TimerContainer = styled.div`
width: 700px;
height: 250px;
border: solid 4px #97d5ff;
background-color: #003677;
margin: auto;
margin-top: 8vh;

`

const Text = styled.div`
margin-top: 3vh;
font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const Title = styled.div`
margin-top: 8vh;
font-family: "Gilroy";
font-size: 50px;
font-weight: bold;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
color: #ffffff;
`

const StyledLink = styled.a`
  padding-left: ${props => props.theme.spacing[3]}px;
  padding-right: ${props => props.theme.spacing[3]}px;
  font-family: "Gilroy";
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  text-decoration: none;
`

const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  margin-top: 3vh;
`

const Nav = styled.div`
  margin-top: 5vh;
`

const StyledCanvas = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #154f9b;
  overflow: hidden;
`

const StyledSky = styled.div`
  position: absolute;
  width: 100%;
  height: 60%;
  background-image: url(${Sky});
  background-size: 100% 100%;
  background-repeat: repeat-x;
`

const StyledLandscape = styled.div`
  position: absolute;
  width: 100%;
  height: 45%;
  top: 55vh;
  background-image: url(${Landscape});
  background-size: cover;
`

export default Splash