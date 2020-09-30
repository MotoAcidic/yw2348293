import React, { useCallback, useEffect, useState, useMemo } from 'react'
import {
	Route,
	Switch,
	useRouteMatch,
} from 'react-router-dom'
import { useWallet } from 'use-wallet'
import styled from 'styled-components'
import { provider } from 'web3-core'

import Logo from '../../assets/img/logo.png'

import Button from '../../components/Button'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import useModal from '../../hooks/useModal'
import { getStats } from './utils'
import useYam from '../../hooks/useYam'
import { OverviewData } from './types'
import useEarnings from '../../hooks/useEarnings'
import useReward from '../../hooks/useReward'


import Icon from '../../assets/img/icon.png'
import Landscape from '../../assets/img/landscapebig.png'
import TallSky from '../../assets/img/tallsky.png'
import Sky from '../../assets/img/skybig.png'
import StakeModal from './StakeModal'
import UnstakeModal from './UnstakeModal'

import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'
import { getContract } from '../../utils/erc20'
import { getDisplayBalance } from '../../utils/formatBalance'
import useAllowance from '../../hooks/useAllowance'
import useApprove from '../../hooks/useApprove'
import useStake from '../../hooks/useStake'
import useStakedBalance from '../../hooks/useStakedBalance'
import useTokenBalance from '../../hooks/useTokenBalance'
import useUnstake from '../../hooks/useUnstake'
import useFarms from '../../hooks/useFarms'
import { getBattleAPR } from '../../yamUtils'


function isMobile() {
	if (window.innerWidth < window.innerHeight) {
		return true
	}
	else {
		return false
	}
}

const WarPool: React.FC = () => {
	const { account, connect, ethereum } = useWallet()
	const yam = useYam()


	const {
		contract,
		depositToken,
		depositTokenAddress,
		earnToken,
		name,
		icon,
	} = useFarm('BATTLEPOOL') || {
		contract: null,
		depositToken: '',
		depositTokenAddress: '',
		earnToken: '',
		name: '',
		icon: ''
	}

	const tokenContract = useMemo(() => {
		return getContract(ethereum as provider, depositTokenAddress)
	}, [ethereum, depositTokenAddress])


	const { onReward } = useReward(contract)
	const earnings = useEarnings(contract)
	const tokenBalance = useTokenBalance(depositTokenAddress)
	const stakedBalance = useStakedBalance(contract)
	const { onStake } = useStake(contract)
	const { onUnstake } = useUnstake(contract)
	const allowance = useAllowance(tokenContract, contract)
	const [requestedApproval, setRequestedApproval] = useState(false)
	const { onApprove } = useApprove(tokenContract, contract)
	const [apr, setAPR] = useState(0)

	const aprVal = useCallback(async () => {
		console.log(contract);

		const apr = await getBattleAPR(contract, yam)
		setAPR(apr)
	}, [contract, setAPR])

	useEffect(() => {
		if (contract && !apr && yam) {
			aprVal()
		}
	}, [contract, yam])

	const onClaimUnstake = () => {
		onPresentUnstake()
		onReward();
	}

	const [onPresentStake] = useModal(
		<StakeModal
			max={tokenBalance}
			onConfirm={onStake}
			tokenName={"WAR"}
		/>
	)

	const [onPresentUnstake] = useModal(
		<UnstakeModal
			max={stakedBalance}
			onConfirm={onUnstake}
			tokenName={"WAR"}
		/>
	)

	const handleApprove = useCallback(async () => {
		try {
			setRequestedApproval(true)
			const txHash = await onApprove()
			// user rejected tx or didn't go thru
			if (!txHash) {
				setRequestedApproval(false)
			}
		} catch (e) {
			console.log(e)
		}
	}, [onApprove, setRequestedApproval])

	if (isMobile()) {
		return (
			<MobileInfoContainer>
				<WarTopContainer>
					<Title>WAR Pool</Title>
					<StyledDetails>
						<StyledDetail>APR</StyledDetail>
						<StyledDetail>{apr.toFixed(2)}%</StyledDetail>
					</StyledDetails>
				</WarTopContainer>
				<InfoDivider />
				<MobileInfoLines>
					<Line>Your Balance: <ShadedLine>{getDisplayBalance(tokenBalance)} WAR</ShadedLine></Line>
					<Line>Currently Staked: <ShadedLine>{getDisplayBalance(stakedBalance)}</ShadedLine></Line>
					<Line>Rewards Available: <ShadedLine>{getDisplayBalance(earnings)} WAR</ShadedLine></Line>
				</MobileInfoLines>
				<BottomButtonContainer>
					{!allowance.toNumber() ? (
						<Button
							size="lg"
							disabled={account ? false : true}
							onClick={handleApprove}
							text={`Approve WAR`}
						/>
						// <Button
						// 	size="lg"
						// 	disabled={true}
						// 	onClick={handleApprove}
						// 	text={`Approve WAR`}
						// />
					) : (
							<MobileButtons>
								<Button size='lg' onClick={onPresentStake}>Stake Tokens</Button>
								<Button size='lg' onClick={onReward} disabled={!earnings.toNumber()}>Claim Rewards</Button>
								<Button size='lg' onClick={onPresentUnstake}>Unstake Tokens</Button>
								<Button size='lg' onClick={onClaimUnstake} disabled={!earnings.toNumber()}>Claim & Unstake</Button>
								{/* <Button size='lg' onClick={onPresentStake} disabled={true}>Stake Tokens</Button>
								<Button size='lg' onClick={onReward} disabled={true}>Claim Rewards</Button>
								<Button size='lg' onClick={onPresentUnstake} disabled={true}>Unstake Tokens</Button>
								<Button size='lg' onClick={onClaimUnstake} disabled={true}>Claim & Unstake</Button> */}
							</MobileButtons>
						)}
				</BottomButtonContainer>
			</MobileInfoContainer>
		)
	}

        const now = new Date().getTime() / 1000;

		const earningsBalance = getDisplayBalance(earnings);


	return (
		<InfoContainer>
			<WarTopContainer>
				<Title>WARchest</Title>
				<StyledDetails>
					<StyledDetail>APR</StyledDetail>
					<StyledDetail>{apr.toFixed(2)}%</StyledDetail>
				</StyledDetails>
			</WarTopContainer>
			<InfoDivider />
			<InfoLines>
				<Line>Your Balance: <ShadedLine>{getDisplayBalance(tokenBalance)} WAR</ShadedLine></Line>
				<Line>Currently Staked: <ShadedLine>{getDisplayBalance(stakedBalance)}</ShadedLine></Line>
				<Line>Past Battle Reward: <ShadedLine>{earningsBalance} WAR{earningsBalance === `0.000` ? ` (check back soon)` : ``}</ShadedLine></Line>
				<Line>Daily Rewards Available: <ShadedLine>56,000 WAR</ShadedLine></Line>
			</InfoLines>
			<BottomButtonContainer>
				{!allowance.toNumber() ? (
					<Button
						size="lg"
						disabled={account ? false : true}
						onClick={handleApprove}
						text={`Approve WAR`}
					/>
					// <Button
					// 	size="lg"
					// 	disabled={true}
					// 	onClick={handleApprove}
					// 	text={`Approve WAR`}
					// />
				) : (
						<>
							<Button size='lg' onClick={onPresentStake}>Stake Tokens</Button>
							<Button size='lg' onClick={onReward} disabled={!earnings.toNumber()}>Claim Rewards</Button>
							<Button size='lg' onClick={onPresentUnstake}>Unstake Tokens</Button>
							{/*<Button size='lg' onClick={onClaimUnstake} disabled={!earnings.toNumber()}>Claim & Unstake</Button>*/}
							{/* <Button size='lg' onClick={onPresentStake} disabled={true}>Stake Tokens</Button>
							<Button size='lg' onClick={onReward} disabled={true}>Claim Rewards</Button>
							<Button size='lg' onClick={onPresentUnstake} disabled={true}>Unstake Tokens</Button>
							<Button size='lg' onClick={onClaimUnstake} disabled={true}>Claim & Unstake</Button> */}
						</>
					)}
			</BottomButtonContainer>
		</InfoContainer>
	)
}

const WarTopContainer = styled.div`
display: flex;
flex-direction: row;
justify-content: center;
`

const StyledDetails = styled.div`
position: absolute;
display: flex;
-webkit-box-pack: justify;
justify-content: space-between;
box-sizing: border-box;
border-radius: 8px;
background: rgb(20,91,170);
color: rgb(170, 149, 132);
width: 200px;
margin-top: 6px;
margin-left: 780px;
line-height: 32px;
font-size: 13px;
border: 1px solid rgb(230, 220, 213);
text-align: center;
padding: 0px 12px;
`

const StyledDetail = styled.div`
font-family: Alegreya;
line-height: 32px;
font-size: 18px;
font-weight: normal;
font-stretch: normal;
font-style: normal;
letter-spacing: normal;
color: #ffffff;
}
`

const MobileButtons = styled.div`
display: flex;
flex-direction: column;
`

const DisplayItem = styled.div`
color: white;
font-family: Alegreya;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const BottomButtonContainer = styled.div`
width: 84%;
margin-left: 8%;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
`

const ShadedLine = styled.div`
margin-left: 20px;
color: #97d5ff;
`

const Line = styled.div`
display: flex;
flex-direction: row;
`

const InfoLines = styled.div`
width: 100%;
height: 50%;
display: flex;
flex-direction: column;
justify-content: space-evenly;
text-align: left;
margin: 3%;
font-family: SFMono;
  font-size: 40px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1px;
  color: #ffffff;
`

const MobileInfoLines = styled.div`
width: 100%;
height: 50%;
display: flex;
flex-direction: column;
justify-content: space-evenly;
text-align: left;
margin: 3%;
font-family: SFMono;
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1px;
  color: #ffffff;
`

const Title = styled.div`
font-family: Alegreya;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
  margin-top: 1%;
`

const InfoDivider = styled.div`
margin-top: 1%;
  width: 100%;
  height: 5px;
  background-color: #97d5ff;
`

const InfoContainer = styled.div`
width: 1000px;
  height: 375px;
  border-radius: 8px;
  border: solid 4px #97d5ff;
  background-color: #003677;
  margin-top: 3vh;
  margin-bottom: 3vh;
`

const MobileInfoContainer = styled.div`
width: 300px;
  height: 450px;
  border-radius: 8px;
  border: solid 4px #97d5ff;
  background-color: #003677;
  margin-top: 6vh;
  margin-bottom: 6vh;
`

const CountDownText = styled.div`
margin-top: 6vh;
font-family: Alegreya;
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const SectionDivider = styled.div`
  width: 1100px;
  height: 2px;
  background-color: #00a1ff;
  margin-top: 6vh;
`

const LargeText = styled.div`
font-family: Alegreya;
  font-size: 30px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const SmallText = styled.div`
font-family: Alegreya;
  font-size: 20px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`

const TextContainer = styled.div`
width: 60%;
height: 20vh;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 3vh;
`

const TopDisplayContainer = styled.div`
width: 40%;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-evenly;
`

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
`

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  height: 35vh;
  justify-content: space-around
`

const TallStyledSky = styled.div`
  width: 100%;
  height: 270vh;
  background-image: url(${TallSky});
  background-size: 100% 100%;
  background-repeat: repeat-x;
`

const StyledSky = styled.div`
  width: 100%;
  height: 60vh;
  background-image: url(${Sky});
  background-size: 100% 100%;
  background-repeat: repeat-x;
`

const StyledLandscape = styled.div`
  width: 100vw;
  height: 45vh;
  background-image: url(${Landscape});
  background-size: cover;
  transform: translateY(-1px)
`

const BackgroundSection = styled.div`
  position: absolute;
  width: 100%;
  background-color: #154f9b;
`

const StyledCanvas = styled.div`
  position: absolute;
  width: 100%;
  background-color: #154f9b;
`
const ContentContainer = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
`

export default WarPool