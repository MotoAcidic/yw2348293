import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useWallet } from 'use-wallet'
import styled from 'styled-components'
import { provider } from 'web3-core'
import Button from '../../components/Button'
import useYam from '../../hooks/useYam'
import useEarnings from '../../hooks/useEarnings'
import useReward from '../../hooks/useReward'
import TallSky from '../../assets/img/tallsky.png'
import Sky from '../../assets/img/skybig.png'
import StakeModal from './StakeModal'
import UnstakeModal from './UnstakeModal'
import useFarm from '../../hooks/useFarm'
import { getContract } from '../../utils/erc20'
import { getDisplayBalance } from '../../utils/formatBalance'
import useAllowance from '../../hooks/useAllowance'
import useModal from '../../hooks/useModal'
import useApprove from '../../hooks/useApprove'
import useStake from '../../hooks/useStake'
import useStakedBalance from '../../hooks/useStakedBalance'
import useTokenBalance from '../../hooks/useTokenBalance'
import useUnstake from '../../hooks/useUnstake'
import { getWarAPR, getPoolEndTime } from '../../yamUtils'

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
	const [apr, setAPR] = useState(0)

	const aprVal = useCallback(async () => {
		//console.log(`contract`,contract);

		const apr = await getWarAPR(contract, yam)
		setAPR(apr)
	}, [contract, setAPR])

	useEffect(() => {
		if (contract && !apr && yam) {
			aprVal()
		}
	}, [contract, yam])

	/*const onClaimUnstake = () => {
		onPresentUnstake()
		onReward();
	}*/

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
				<WarTopContainer>
					<Title>War Pool</Title>
					<StyledDetails>
						<StyledDetail>APR</StyledDetail>
						<StyledDetail>{apr.toFixed(3)}%</StyledDetail>
					</StyledDetails>
				</WarTopContainer>
				<MobileInfoLines>
					<MobileLine>Your Balance: <ShadedLine>{getDisplayBalance(tokenBalance)} ETH-WAR-UNI-V2</ShadedLine></MobileLine>
					<MobileLine>Currently Staked: <ShadedLine>{getDisplayBalance(stakedBalance)}</ShadedLine></MobileLine>
					<MobileLine>Rewards Available: <ShadedLine>{getDisplayBalance(earnings)} WAR</ShadedLine></MobileLine>
				</MobileInfoLines>
				<BottomButtonContainer>
					{!allowance.toNumber() ? (
						<Button
							size="xlg"
							disabled={account ? false : true}
							onClick={handleApprove}
							text={`Approve WAR`}
						/>
					) : (
							<MobileButtons>
								<Button size='xlg' onClick={onPresentStake}>Stake Tokens</Button>
								<Space />
								<Button size='xlg' onClick={onReward} disabled={!earnings.toNumber()}>Claim Rewards</Button>
								<Space />
								<Button size='xlg' onClick={onPresentUnstake}>Unstake Tokens</Button>
							</MobileButtons>
						)}
				</BottomButtonContainer>
			</MobileInfoContainer>
		)
	}

	const now = new Date().getTime() / 1000;

	return (
		<InfoContainer>
			<WarTopContainer>
				<Title>War Pool</Title>
				<StyledDetails>
					<StyledDetail>APR</StyledDetail>
					<StyledDetail>{apr.toFixed(3)}%</StyledDetail>
				</StyledDetails>
			</WarTopContainer>
			<InfoLines>
				<Line>Your Balance: <ShadedLine>{getDisplayBalance(tokenBalance)} ETH-WAR-UNI-V2</ShadedLine></Line>
				<Line>Currently Staked: <ShadedLine>{getDisplayBalance(stakedBalance)}</ShadedLine></Line>
				<Line>Rewards Available: <ShadedLine>{getDisplayBalance(earnings)} WAR</ShadedLine></Line>
			</InfoLines>
			<BottomButtonContainer>
				{!allowance.toNumber() ? (
					<Button
						size="lg"
						disabled={account ? false : true}
						onClick={handleApprove}
						text={`Approve WAR`}
					/>
				) : (
						<>
							<Button size='lg' onClick={onPresentStake}>Stake Tokens</Button>
							<Button size='lg' onClick={onReward} disabled={!earnings.toNumber()}>Claim Rewards</Button>
							<Button size='lg' onClick={onPresentUnstake}>Unstake Tokens</Button>
						</>
					)}
			</BottomButtonContainer>
		</InfoContainer>
	)
}

const Space = styled.div`
height: 10px;
`

const WarTopContainer = styled.div`
display: flex;
height: 50px;
align-items: center;
flex-direction: row;
justify-content: center;
`

const StyledDetails = !isMobile() ? styled.div`
position: absolute;
display: flex;
-webkit-box-pack: justify;
justify-content: space-between;
box-sizing: border-box;
border-radius: 8px;
background-color: rgba(256, 256, 256, 0.05);
color: rgb(170, 149, 132);
width: 200px;
margin-top: 6px;
margin-left: 780px;
line-height: 32px;
font-size: 13px;
border: solid 2px #ffb700;
text-align: center;
padding: 0px 12px;
` : styled.div`
position: absolute;
display: flex;
-webkit-box-pack: justify;
justify-content: space-between;
box-sizing: border-box;
border-radius: 8px;
background-color: rgba(256, 256, 256, 0.05);
color: rgb(170, 149, 132);
width: 200px;
margin-top: 100px;
font-size: 13px;
border: solid 2px #ffb700;
text-align: center;
padding: 0px 12px;`

const StyledDetail = styled.div`
font-family: "Gilroy";
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
margin-bottom: 20px;
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
color: #ffb700;
text-align: right;
`

const Line = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`

const MobileLine = styled.div`
display: flex;
flex-direction: row;
margin-bottom: 20px;
justify-content: space-between;
`


const InfoLines = styled.div`
width: 94%;
height: 50%;
display: flex;
flex-direction: column;
justify-content: space-evenly;
text-align: left;
margin: 3%;
font-family: "SF Mono Semibold";
  font-size: 40px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1px;
  color: #ffffff;
`

const MobileInfoLines = styled.div`
width: 90%;
height: 60%;
display: flex;
flex-direction: column;
justify-content: space-evenly;
text-align: left;
padding: 75px 5% 0% 5%;
margin-bottom: 20px;
font-family: "SF Mono Semibold";
  font-size: 18px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: 1px;
  color: #ffffff;
`

const Title = styled.div`
font-family: "Gilroy";
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  color: #ffffff;
`
const InfoContainer = !isMobile() ? styled.div`
width: 1000px;
  height: 375px;
  border-radius: 8px;
  border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);

	margin: 80px auto 80px auto;
`: styled.div`
width: 300px;
  border-radius: 8px;
  border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
	margin: 60px auto 60px auto;
`

const MobileInfoContainer = styled.div`
width: 300px;
  border-radius: 8px;
  border: solid 2px rgba(255, 183, 0, 0.3);
  background-color: rgba(256,256,256,0.08);
	margin: 60px auto 60px auto;
	padding: 20px;

`

export default WarPool