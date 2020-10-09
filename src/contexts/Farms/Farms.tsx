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

    const balancerURL = "https://pools.balancer.exchange/#/pool/";

    let farmsArr = [
      {
        contract: pools ? pools["send_pool"] : undefined,
        name: "SEND Senders",
        depositToken: "SEND-WAR BPT",
        depositTokenAddress: tokens ? tokens["send_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "✉️",
        id: "SEND",
        sort: 9,
        season: 2,
        link: tokens ? balancerURL.concat(tokens["send_token"].options.address,"/") : undefined
      },
      {
        contract: pools ? pools["hate_pool"] : undefined,
        name: "HATE Drapes",
        depositToken: "HATE-WAR BPT",
        depositTokenAddress: tokens ? tokens["hate_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "🟪",
        id: "HATE",
        sort: 9,
        season: 2,
        link: tokens ? balancerURL.concat(tokens["hate_token"].options.address,"/") : undefined
      },
      {
        contract: pools ? pools["stbu_pool"] : undefined,
        name: "STBU Robots",
        depositToken: "STBU-WAR BPT",
        depositTokenAddress: tokens ? tokens["stbu_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "🤖",
        id: "STBU",
        sort: 9,
        season: 2,
        link: tokens ? balancerURL.concat(tokens["stbu_token"].options.address,"/") : undefined
      },
      {
        contract: pools ? pools["yfl_pool"] : undefined,
        name: "YFL Mariners",
        depositToken: "YFL-WAR BPT",
        depositTokenAddress: tokens ? tokens["yfl_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "⚓",
        id: "YFL",
        sort: 9,
        season: 2,
        link: tokens ? balancerURL.concat(tokens["yfl_token"].options.address,"/") : undefined
      },
      {
        contract: pools ? pools["rope_pool"] : undefined,
        name: "ROPE Rats",
        depositToken: "ROPE-WAR BPT",
        depositTokenAddress: tokens ? tokens["rope_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "🐀",
        id: "ROPE",
        sort: 9,
        season: 2,
        link: tokens ? balancerURL.concat(tokens["rope_token"].options.address,"/") : undefined
      },
      {
        contract: pools ? pools["z_pool"] : undefined,
        name: "Z Yachts",
        depositToken: "Z-WAR BPT",
        depositTokenAddress: tokens ? tokens["z_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "⛵",
        id: "Z",
        sort: 9,
        season: 2,
        link: tokens ? balancerURL.concat(tokens["z_token"].options.address,"/") : undefined
      },
      {
        contract: pools ? pools["cream_pool"] : undefined,
        name: "CREAM Pies",
        depositToken: "CREAM-WAR BPT",
        depositTokenAddress: tokens ? tokens["cream_token"].options.address : undefined,
        earnToken: 'CREAM',
        earnTokenAddress: yamAddress,
        icon: "🥧",
        id: "CREAM",
        sort: 9,
        season: 2,
        link: tokens ? balancerURL.concat(tokens["cream_token"].options.address,"/") : undefined
      },
      {
        contract: pools ? pools["value_pool"] : undefined,
        name: "VALUE Goats",
        depositToken: "VALUE-WAR BPT",
        depositTokenAddress: tokens ? tokens["value_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "🐐",
        id: "VALUE",
        sort: 9,
        season: 2,
        link: tokens ? balancerURL.concat(tokens["value_token"].options.address,"/") : undefined
      },
      {
        contract: pools ? pools["mbbased_pool"] : undefined,
        name: "mbBASED Ghouls",
        depositToken: "mbBASED",
        depositTokenAddress: tokens ? tokens["mbbased_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "💀",
        id: "mbBASED",
        sort: 9,
        season: 1,
        link: ""
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
        sort: 9,
        season: 1,
        link: ""
      },
      {
        contract: pools ? pools["link_pool"] : undefined,
        name: "LINK Marines",
        depositToken: "LINK",
        depositTokenAddress: tokens ? tokens["link_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "🛥️",
        id: "LINK",
        sort: 9,
        season: 1,
        link: ""
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
        sort: 9,
        season: 1,
        link: ""
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
        sort: 9,
        season: 1,
        link: ""
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
        sort: 9,
        season: 1,
        link: ""
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
        sort: 9,
        season: 1,
        link: ""
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
        sort: 9,
        season: 1,
        link: ""
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
        sort: 9,
        season: 1,
        link: ""
      },
      {
        contract: pools ? pools["wnxm_pool"] : undefined,
        name: "WNXM Mutants",
        depositToken: "WNXM",
        depositTokenAddress: tokens ? tokens["wnxm_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "👾", // BASED Ghouls 💀
        id: "WNXM",
        sort: 9,
        season: 1,
        link: ""
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
        sort: 9,
        season: 1,
        link: ""
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
        sort: 9,
        season: 1,
        link: ""
      },
      {
        contract: pools ? pools["chads_pool"] : undefined,
        name: "CHADS Apes",
        depositToken: "CHADS",
        depositTokenAddress: tokens ? tokens["chads_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "🦍",
        id: "CHADS",
        sort: 9,
        season: 1,
        link: ""
      },
      {
        contract: undefined,
        name: "PICKLE Ricks",
        depositToken: "PICKLE",
        depositTokenAddress: undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "🥒",
        id: "PICKLE",
        sort: 9,
        season: 1,
        link: ""
      },
      {
        contract: undefined,
        name: "MEME Pineapples",
        depositToken: "MEME",
        depositTokenAddress: undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "🍍",
        id: "MEME",
        sort: 9,
        season: 1,
        link: ""
      },
      {
        contract: undefined,
        name: "YAM Yahoos",
        depositToken: "YAM",
        depositTokenAddress:  undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "🍠",
        id: "YAM",
        sort: 9,
        season: 1,
        link: ""
      },
      {
        contract: pools ? pools["unipool_pool"] : undefined,
        name: "",
        depositToken: "ETH-WAR-UNI-V2",
        depositTokenAddress: tokens ? tokens["unipool_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "",
        id: "UNIPOOL",
        sort: 9,
        season: null,
        link: ""
      },
      {
        contract: pools ? pools["battlepool_pool"] : undefined,
        name: "",
        depositToken: "WAR",
        depositTokenAddress: tokens ? tokens["battlepool_token"].options.address : undefined,
        earnToken: 'WAR',
        earnTokenAddress: yamAddress,
        icon: "",
        id: "BATTLEPOOL",
        sort: 9,
        season: null,
        link: ""
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