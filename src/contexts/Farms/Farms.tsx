import React, { useCallback, useEffect, useState } from 'react'
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'

import { yam as yamAddress } from '../../constants/tokenAddresses'
import useYam from '../../hooks/useYam'
import { getPoolContracts, getPoolTokenContracts } from '../../yamUtils'

import Context from './context'
import { Farm } from './types'
import Pool from '../../yam/clean_build/contracts/YAMMKRPool.json';
import { listenerCount } from 'process';

const NAME_FOR_POOL: { [key: string]: string } = {
  uni_pool: 'WETH_PASTA_UNI_LP',
}

const ICON_FOR_POOL: { [key: string]: string } = {
  uni_pool: '🌈',
}

const SORT_FOR_POOL: { [key: string]: number } = {
  uni_pool: 9,
}

const Farms: React.FC = ({ children }) => {

  const [farms, setFarms] = useState<Farm[]>([])
  const { account, ethereum } = useWallet()
  let yam = useYam()

  const fetchPools = useCallback(async () => {
    let pools: { [key: string]: Contract };
    let tokens: { [key: string]: Contract };
    if (yam) {
      pools = await getPoolContracts(yam);
      tokens = await getPoolTokenContracts(yam);
    }



    //let pool;
    //let tokenAddress = '0xE92346d9369Fe03b735Ed9bDeB6bdC2591b8227E'


    //console.log("here", yam, pools, tokens)

    // const web3 = new Web3(ethereum as provider);
    // const poolContract = new web3.eth.Contract(Pool.abi, Pool.networks[1].address);

    let farmsArr = [{
      contract: pools ? pools["link_pool"] : undefined,
      name: "LINK Marines",
      depositToken: "LINK",
      depositTokenAddress: tokens ? tokens["link_token"].options.address : undefined,
      earnToken: 'WAR',
      earnTokenAddress: yamAddress,
      icon: "🛥️",
      id: "LINK",
      sort: 9
    },
    {
      contract: pools ? pools["snx_pool"] : undefined,
      name: "SNX Spartans",
      depositToken: "SNX",
      depositTokenAddress: tokens ? tokens["snx_token"].options.address : undefined,
      earnToken: 'WAR',
      earnTokenAddress: yamAddress,
      icon: "🛡️",
      id: "SNX",
      sort: 9
    },
    {
      contract: pools ? pools["yfi_pool"] : undefined,
      name: "YFI Waifus",
      depositToken: "YFI",
      depositTokenAddress: tokens ? tokens["yfi_token"].options.address : undefined,
      earnToken: 'WAR',
      earnTokenAddress: yamAddress,
      icon: "👧",
      id: "YFI",
      sort: 9
    },
    {
      contract: pools ? pools["comp_pool"] : undefined,
      name: "COMP Nobles",
      depositToken: "COMP",
      depositTokenAddress: tokens ? tokens["comp_token"].options.address : undefined,
      earnToken: 'WAR',
      earnTokenAddress: yamAddress,
      icon: "👑",
      id: "COMP",
      sort: 9
    },
    {
      contract: pools ? pools["omg_pool"] : undefined,
      name: "OMG Mafia",
      depositToken: "OMG",
      depositTokenAddress: tokens ? tokens["omg_token"].options.address : undefined,
      earnToken: 'WAR',
      earnTokenAddress: yamAddress,
      icon: "🕴️",
      id: "OMG",
      sort: 9
    },
    {
      contract: pools ? pools["bzrx_pool"] : undefined,
      name: "BZRX Berserkers",
      depositToken: "BZRX",
      depositTokenAddress: tokens ? tokens["bzrx_token"].options.address : undefined,
      earnToken: 'WAR',
      earnTokenAddress: yamAddress,
      icon: "🪓",
      id: "BZRX",
      sort: 9
    },
    {
      contract: pools ? pools["uni_pool"] : undefined,
      name: "UNI Unicorns",
      depositToken: "UNI",
      depositTokenAddress: tokens ? tokens["uni_token"].options.address : undefined,
      earnToken: 'WAR',
      earnTokenAddress: yamAddress,
      icon: "🦄",
      id: "UNI",
      sort: 9
    },
    {
      contract: pools ? pools["lend_pool"] : undefined,
      name: "LEND Archers",
      depositToken: "AAVE",
      depositTokenAddress: tokens ? tokens["lend_token"].options.address : undefined,
      earnToken: 'WAR',
      earnTokenAddress: yamAddress,
      icon: "🏹",
      id: "AAVE",
      sort: 9
    },
    {
      contract: pools ? pools["wnxm_pool"] : undefined,
      name: "WNXM Mutants",
      depositToken: "WNXM",
      depositTokenAddress: tokens ? tokens["wnxm_token"].options.address : undefined,
      earnToken: 'WAR',
      earnTokenAddress: yamAddress,
      icon: "👾",
      id: "WNXM",
      sort: 9
    },
    {
      contract: pools ? pools["mkr_pool"] : undefined,
      name: "MKR Masons",
      depositToken: "MKR",
      depositTokenAddress: tokens ? tokens["mkr_token"].options.address : undefined,
      earnToken: 'WAR',
      earnTokenAddress: yamAddress,
      icon: "👷",
      id: "MKR",
      sort: 9
    },
    {
      contract: pools ? pools["srm_pool"] : undefined,
      name: "SRM Mystics",
      depositToken: "SRM",
      depositTokenAddress: tokens ? tokens["srm_token"].options.address : undefined,
      earnToken: 'WAR',
      earnTokenAddress: yamAddress,
      icon: "🧙‍♂️",
      id: "SRM",
      sort: 9
    },
    {
      contract: pools ? pools["farm_pool"] : undefined,
      name: "FARM Tractors",
      depositToken: "FARM",
      depositTokenAddress: tokens ? tokens["farm_token"].options.address : undefined,
      earnToken: 'WAR',
      earnTokenAddress: yamAddress,
      icon: "🚜",
      id: "FARM",
      sort: 9
    },
  ]

    // farmsArr.sort((a, b) => a.sort < b.sort ? 1 : -1)

    // farmsArr = farmsArr.concat(farmsArr, farmsArr, farmsArr, farmsArr, farmsArr, farmsArr, farmsArr, farmsArr, farmsArr, farmsArr, farmsArr)
    // //CHANGEME
    setFarms(farmsArr)
  }, [yam, setFarms, account])

  useEffect(() => {
    fetchPools()
  }, [yam, fetchPools, account])

  return (
    <Context.Provider value={{ farms }}>
      {children}
    </Context.Provider>
  )
}

export default Farms