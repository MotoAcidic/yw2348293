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
import { Contract } from 'web3-eth-contract'


import Icon from '../../assets/img/icon.png'
import Landscape from '../../assets/img/landscapebig.png'
import TallSky from '../../assets/img/tallsky.png'
import Sky from '../../assets/img/skybig.png'
import StakeModal from './StakeModal'
import UnstakeModal from './UnstakeModal'


import FarmCards from './components/FarmCards'
import CountDown from './components/CountDown'
import { Account } from '../../yam/lib/accounts'
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
	} = useFarm('UNIPOOL') || {
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

	// const [{
	//   circSupply,
	//   curPrice,
	//   // nextRebase,
	//   targetPrice,
	//   totalSupply,
	// }, setStats] = useState<OverviewData>({})

	// const fetchStats = useCallback(async () => {
	//   const statsData = await getStats(yam)
	//   setStats(statsData)
	// }, [yam, setStats])


	// useEffect(() => {
	//   if (yam && account) {
	//     fetchStats()
	//   }
	// }, [yam, account])

	const onClaimUnstake = () => {
		onPresentUnstake()
		onReward();
	}

	const [onPresentStake] = useModal(
		<StakeModal
			max={tokenBalance}
			onConfirm={onStake}
			tokenName={"ETH-WAR-UNI-V2"}
		/>
	)

	const [onPresentUnstake] = useModal(
		<UnstakeModal
			max={stakedBalance}
			onConfirm={onUnstake}
			tokenName={"ETH-WAR-UNI-V2"}
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
				<Title>Uniswap WAR/sUSD</Title>
				<InfoDivider />
				<MobileInfoLines>
					<Line>Your Balance: <ShadedLine>{getDisplayBalance(tokenBalance)} UsUSDBASED-V2</ShadedLine></Line>
					<Line>CurrentlyStaked: <ShadedLine>{getDisplayBalance(stakedBalance)}</ShadedLine></Line>
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

	return (
		<InfoContainer>
			<Title>Uniswap WAR/ETH</Title>
			<InfoDivider />
			<InfoLines>
				<Line>Your Balance: <ShadedLine>{getDisplayBalance(tokenBalance)} ETH-WAR-UNI-V2</ShadedLine></Line>
				<Line>Currently Staked: <ShadedLine>{getDisplayBalance(stakedBalance)}</ShadedLine></Line>
				<Line>Rewards Available: <ShadedLine>{getDisplayBalance(earnings)} WAR</ShadedLine></Line>
			</InfoLines>
			<BottomButtonContainer>
				{!allowance.toNumber() ? (
					<Button
						size="lg"
						disabled={now < 1601308800 && account ? false : true}
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
  margin-top: 6vh;
  margin-bottom: 6vh;
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