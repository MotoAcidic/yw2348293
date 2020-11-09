import React, { useCallback, useEffect, useState } from "react";
import styled from 'styled-components'
import BigNumber from "bignumber.js";
import Uniswap from "../../assets/img/uniswap@2x.png";
import { getStats } from "./utils";
import useYam from "../../hooks/useYam";
import { getWarStaked } from "../../yamUtils";
import { useWallet } from "use-wallet";
import useFarms from "../../hooks/useFarms";

function isMobile() {
  if (window.innerWidth < window.innerHeight) {
    return true;
  } else {
    return false;
  }
}

export interface OverviewData {
  circSupply?: string;
  curPrice?: number;
  nextRebase?: number;
  targetPrice?: number;
  totalSupply?: string;
}


const Value: React.FC= () => {
  const yam = useYam()
  let [farms] = useFarms()
  const [
    {
      curPrice,
    },
    setStats
  ] = useState<OverviewData>({});
  let [warStaked, setWarStaked] = useState({
    warStaked: new BigNumber(0),
    circSupply: new BigNumber(0)
  });
  
  const fetchWarStaked = useCallback(
    async pools => {
      const st = await getWarStaked(pools, yam);
      setWarStaked(st);
    },
    [yam, setWarStaked]
  );

  const { account, connect } = useWallet()

  const fetchStats = useCallback(async () => {
    const statsData = await getStats(yam);
    setStats(statsData);
  }, [yam, setStats]);

  useEffect(() => {
    if (yam && account && farms.length) {
      fetchStats();
    }
    if (yam && farms) {
      fetchWarStaked(farms);
    }
  }, [yam, account, farms]);

  let currentPrice = curPrice || 0;

  return (
    <TopDisplayContainer>
      <DisplayItem>
        $War Price:&nbsp;
{currentPrice
          ? `$${Number(currentPrice).toLocaleString(undefined, {
            minimumFractionDigits: 4,
            maximumFractionDigits: 4
          })}`
          : "-"}
      </DisplayItem>
      <DisplayItem>
        Supply Staked:&nbsp;
{warStaked && !warStaked.warStaked.eq(0)
          ? `${Number(warStaked.warStaked.toFixed(2)).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}%`
          : "-"}
      </DisplayItem>
      <DisplayItem>
        Marketcap:&nbsp;
{currentPrice && warStaked && !warStaked.circSupply.eq(0)
          ? `$${Number(warStaked.circSupply.multipliedBy(currentPrice).dividedBy(10 ** 18).toFixed(2)).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`
          : "-"}
      </DisplayItem>
      <StyledA
        style={{ marginTop: "-5px" }}
        href="https://uniswap.info/token/0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde"
        target="_blank"
      />
    </TopDisplayContainer>
  )
}


const StyledA = styled.a`
  cursor: pointer;
  display: flex;
  background-image: url(${Uniswap});
  background-size: cover;
  background-position: center;
  height: 30px;
  opacity: 0.9;
  width: 137px;
  transition: all .1s linear;
  &:hover {
    opacity: 1;
  }
`

const TopDisplayContainer = !isMobile()
  ? styled.div`
        width:80vw;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin: 16px auto 40px auto;
      `
  : styled.div`
        width: 60vw;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin: 60px auto 40px auto;
        display: flex;
        flex-wrap: wrap;
      `;

const DisplayItem = !isMobile()
  ? styled.div`
        color: white;
        font-family: "Gilroy";
        font-size: 18px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        color: #ffffff;
        opacity: 0.9;
      `
  : styled.div`
        width: 100%;
        margin-bottom: 10px;
        color: white;
        text-align: center;
        font-family: "Gilroy";
        font-size: 18px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1;
        letter-spacing: normal;
        opacity: 0.9;
        color: #ffffff;
      `;

export default Value