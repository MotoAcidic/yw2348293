import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Switch } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Page from "../../components/Page";
import useYam from "../../hooks/useYam";
// import useBet from "../../hooks/useBet";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import Battle from './Battle'
import PriceBattle from './BattlePrice'
import PriceTracking from './TrackingPrice'
import BattleTracking from './battle/Tracking'


function getServerURI() {
	if (window.location.hostname === "localhost") {
		return "http://localhost:5000";
	}
	return "https://yieldwars-api.herokuapp.com";
}


const Market = () => {
	const yam = useYam()

	const { account, connect, ethereum } = useWallet()
	let [battle, setBattle] = useState(null)
	let now = Date.now() / 1000

	useEffect(() => {
		console.log("using effect");
		if (!battle) {
			let url = window.location.pathname
			console.log(url);

			url = url.substring(8, url.length)
			axios.post(`${getServerURI()}/markets/get-market`, {
				id: url
			}).then(res => {
				setBattle(res.data)


			}).catch(err => {
				console.log(err);
				setBattle(-1)
			})
		}
	}, [yam]);

	if (!battle) {
		return null
	}
	if (now < battle.bettingEnd) { // BETTING PHASE
		console.log('in betting phase');
		if (battle.battleType === 'battle')
			return <Battle battle={battle} />
		else if (battle.battleType === 'price')
			return <PriceBattle battle={battle} />
		else
			return <BattleTracking battle={battle} />
	}
	else if (now > battle.bettingEnd && now < battle.battleEnd) { // TRACKING PHASE
		console.log('in tracking phase');
		if (battle.battleType === 'battle')
			return <BattleTracking battle={battle} />
		else if (battle.battleType === 'price')
			return <PriceTracking battle={battle} />
		else
			return <BattleTracking battle={battle} />
	}
	else if (now > battle.battleEnd) {  // REDEMPTION PHASE
		console.log('in redemption phase');
		return <Battle battle={battle} />
	}
	else
		return (null)
};

export default Market;