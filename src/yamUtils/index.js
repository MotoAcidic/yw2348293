import { ethers } from 'ethers'
import Web3 from 'web3';
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import moment from 'moment';

import ProposalJson from '../yam/clean_build/contracts/Proposal.json';
import PASTAv1 from '../yam/clean_build/contracts/PASTAv1.json';
import PASTAv2 from '../yam/clean_build/contracts/PASTAv2.json';

import TokenJson from '../yam/clean_build/contracts/IERC20.json';

import AdvancedJson from '../yam/clean_build/contracts/AdvancedPool.json';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const getPoolStartTime = async (poolContract) => {
  return await poolContract.methods.starttime().call()
}

export const getPoolEndTime = async (poolContract) => {
  return await poolContract.methods.periodFinish().call()
}

/*let p = await yam.contracts.uni_router.methods.getAmountsOut(
  new BigNumber(1000000000000000000),
  [
    "0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"
  ]
).call();*/


export const stake = async (poolContract, amount, account) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1097172400) {
    const precision = poolContract.options.address.toLowerCase() === "0x7845664310e205c979aa067bcfe02704d1001bcf" ?
      new BigNumber(10).pow(6) :
      new BigNumber(10).pow(18);

    return poolContract.methods
      .stake((new BigNumber(amount).times(precision)).toString())
      .send({ from: account, gas: 300000 })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const unstake = async (poolContract, amount, account) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1097172400) {
    const precision = poolContract.options.address.toLowerCase() === "0x7845664310e205c979aa067bcfe02704d1001bcf" ?
      new BigNumber(10).pow(6) :
      new BigNumber(10).pow(18);

    return poolContract.methods
      .withdraw((new BigNumber(amount).times(precision)).toString())
      .send({ from: account, gas: 300000 })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const harvest = async (poolContract, account) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1097172400) {
    return poolContract.methods
      .getReward()
      .send({ from: account, gas: 300000 })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const redeem = async (poolContract, account) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1097172400) {
    return poolContract.methods
      .exit()
      .send({ from: account, gas: 300000 })
      .on('transactionHash', tx => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert("pool not active");
  }
}

export const approve = async (tokenContract, poolContract, account) => {

  return tokenContract.methods
    .approve(poolContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account, gas: 80000 })
}
//after adding more parameters update the id to be a param
//which is unique to the voting option
export const get_y_n_vote = async (provider, account) => {
  if (provider) {
    const web3 = new Web3(provider);
    const my_proposal = new web3.eth.Contract(ProposalJson.abi, ProposalJson.networks[1].address);
    console.log(my_proposal)
    return my_proposal.methods
      .agree_vote(0)
      .send({ from: account })
  }
}
//function for setting the initial value of the votes cast
export const get_counted_votes = async (provider) => {
  var votes_cast = 0;
  if (provider) {
    const web3 = new Web3(provider);
    const my_proposal = new web3.eth.Contract(ProposalJson.abi, ProposalJson.networks[1].address);
    let votes = [];
    // past event to get the number of votes cast
    my_proposal.getPastEvents('Voter', {
      fromBlock: 0,
      toBlock: 'latest'
    }, function (error, events) {
      if (error) {
        console.log(error)
      } else {
        console.log(events)
      }
    })
      .then(function (events) {
        //stores the current amount of votes cast into an array

        for (let i = 0; i < events.length; i++) {
          if (events[i].returnValues.id === "0") {
            votes.push(events[i].returnValues.voter)
          }
        }
        my_proposal.methods.get_vote(0, votes).call().then(function (events) {
          votes_cast = web3.utils.fromWei(events, 'ether')
        })
      })
  }
  return votes_cast
}

export const get_y_n_vote2 = async (provider, account) => {
  if (provider) {
    const web3 = new Web3(provider);
    const my_proposal = new web3.eth.Contract(ProposalJson.abi, ProposalJson.networks[1].address);
    console.log(my_proposal)
    return my_proposal.methods
      .agree_vote(1)
      .send({ from: account })
  }
}

export const get_y_n_vote3 = async (provider, account) => {
  if (provider) {
    const web3 = new Web3(provider);
    const my_proposal = new web3.eth.Contract(ProposalJson.abi, ProposalJson.networks[1].address);
    console.log(my_proposal)
    return my_proposal.methods
      .agree_vote(2)
      .send({ from: account })
  }
}
// proposal abi call for proposing a new pool or a change to a pool
export const sendProposal = async (provider, proposal, account) => {
  if (provider) {
    const web3 = new Web3(provider);
    const my_proposal = new web3.eth.Contract(ProposalJson.abi, ProposalJson.networks[1].address);
    return my_proposal.methods.purpose(proposal).send({ from: account })
  }
}
//message abi call for posting an ad pool
export const sendAdRequest = async (provider, proposal, account) => {
  if (provider) {
    const web3 = new Web3(provider);
    const my_proposal = new web3.eth.Contract(AdvancedJson.abi, AdvancedJson.networks[1].address);
    return my_proposal.methods.set_ad_noshrimp(proposal).send({ from: account })
  }
}

export const getPoolContracts = async (yam) => {
  const pools = Object.keys(yam.contracts)
    .filter(c => c.indexOf('_pool') !== -1)
    .reduce((acc, cur) => {
      const newAcc = { ...acc }
      newAcc[cur] = yam.contracts[cur]
      return newAcc
    }, {})
  return pools
}

export const getPoolTokenContracts = async (yam) => {
  const tokens = Object.keys(yam.contracts)
    .filter(c => c.indexOf('_token') !== -1)
    .reduce((acc, cur) => {
      const newAcc = { ...acc }
      newAcc[cur] = yam.contracts[cur]
      return newAcc
    }, {})
  return tokens
}

export const getEarned = async (yam, pool, account) => {
  // const scalingFactor = new BigNumber(await yam.contracts.yam.methods.yamsScalingFactor().call())
  const earned = new BigNumber(await pool.methods.earned(account).call())
  return earned;
}

export const getStaked = async (yam, pool, account) => {
  return yam.toBigN(await pool.methods.balanceOf(account).call())
}

export const getUnipool = (yam) => yam.contracts["unipool"];

export const getCurrentPrice = async (yam) => {
  //return yam.toBigN(await yam.contracts.rebaser.methods.getCurrentTWAP().call())
  let p = await yam.contracts.uni_router.methods.getAmountsOut(
    "1000000000000000000",
    [
      "0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde",
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    ]
  ).call();

  // call for kovan
  /*let p = await yam.contracts.uni_router.methods.getAmountsOut(
    new BigNumber(1000000000000000000),
    [
      "0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"
    ]
  ).call();*/

  p = yam.toBigN(p[p.length - 1]).div(10 ** 6).toFixed(4);
  //console.log(p);
  return p;
}

export const getETHPrice = async (yam) => {
  //return yam.toBigN(await yam.contracts.rebaser.methods.getCurrentTWAP().call())
  let p = await yam.contracts.uni_router.methods.getAmountsOut(
    "1000000000000000000",
    [
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    ]
  ).call();

  // call for kovan
  /*let p = await yam.contracts.uni_router.methods.getAmountsOut(
    new BigNumber(1000000000000000000),
    [
      "0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"
    ]
  ).call();*/

  p = yam.toBigN(p[p.length - 1]).div(10 ** 6).toFixed(4);
  //console.log(p);
  return p;
}

export const getTargetPrice = async (yam) => {
  return yam.toBigN(1).toFixed(2);
}

export const getCirculatingSupply = async (yam) => {
  let now = await yam.web3.eth.getBlock('latest');
  let scalingFactor = yam.toBigN(await yam.contracts.yam.methods.yamsScalingFactor().call());
  let starttime = yam.toBigN(await yam.contracts.eth_pool.methods.starttime().call()).toNumber();
  let timePassed = now["timestamp"] - starttime;
  if (timePassed < 0) {
    return 0;
  }
  let yamsDistributed = yam.toBigN(8 * timePassed * 250000 / 625000); //yams from first 8 pools
  // let starttimePool2 = yam.toBigN(await yam.contracts.scrv_pool.methods.starttime().call()).toNumber();
  timePassed = now["timestamp"] - starttime;
  let pool2Yams = yam.toBigN(timePassed * 1500000 / 625000); // yams from second pool. note: just accounts for first week
  let circulating = pool2Yams.plus(yamsDistributed).times(scalingFactor).div(10 ** 36).toFixed(2)
  return circulating
}

export const getNextRebaseTimestamp = async (yam) => {
  try {
    let now = await yam.web3.eth.getBlock('latest').then(res => res.timestamp);
    let interval = 43200; // 12 hours
    let offset = 28800; // 8am/8pm utc
    let secondsToRebase = 0;
    if (await yam.contracts.rebaser.methods.rebasingActive().call()) {
      if (now % interval > offset) {
        secondsToRebase = (interval - (now % interval)) + offset;
      } else {
        secondsToRebase = offset - (now % interval);
      }
    } else {
      let twap_init = yam.toBigN(await yam.contracts.rebaser.methods.timeOfTWAPInit().call()).toNumber();
      if (twap_init > 0) {
        let delay = yam.toBigN(await yam.contracts.rebaser.methods.rebaseDelay().call()).toNumber();
        let endTime = twap_init + delay;
        if (endTime % interval > offset) {
          secondsToRebase = (interval - (endTime % interval)) + offset;
        } else {
          secondsToRebase = offset - (endTime % interval);
        }
        return endTime + secondsToRebase;
      } else {
        return now + 13 * 60 * 60; // just know that its greater than 12 hours away
      }
    }
    return secondsToRebase
  } catch (e) {
    console.log(e)
  }
}


export const getSupply = async (provider) => {
  if (provider) {
    const web3 = new Web3(provider);
    const pastav2 = new web3.eth.Contract(PASTAv2.abi, PASTAv2.networks[1].address);
    return pastav2.methods.totalSupply().call()
  }
}

export const getApproved = async (provider, account) => {
  if (provider) {
    const web3 = new Web3(provider);
    const pastav1 = new web3.eth.Contract(PASTAv1.abi, PASTAv1.networks[1].address);
    return pastav1.methods.allowance(account, PASTAv2.networks[1].address).call()
  }
}

export const getFoodbank = async (yam) => {
  return await yam.contracts.yam.methods.totalSupply().call();
}

export const getStats = async (yam) => {
  const curPrice = await getCurrentPrice(yam);
  const circSupply = yam.toBigN(0);//await getCirculatingSupply(yam)
  const nextRebase = yam.toBigN(0);
  const targetPrice = yam.toBigN(0);
  const totalSupply = yam.toBigN(0);//await getTotalSupply(yam);
  return {
    circSupply,
    curPrice,
    nextRebase,
    targetPrice,
    totalSupply
  }
}

export const vote = async (yam, account) => {
  return yam.contracts.gov.methods.castVote(0, true).send({ from: account })
}

export const migrate = async (provider, account) => {
  if (provider) {
    const web3 = new Web3(provider);
    const pastav2 = new web3.eth.Contract(PASTAv2.abi, PASTAv2.networks[1].address);
    return pastav2.methods.mint().send({ from: account })
  }
}

export const approveMigrate = async (provider, account) => {
  if (provider) {
    const web3 = new Web3(provider);
    const pastav1 = new web3.eth.Contract(PASTAv1.abi, PASTAv1.networks[1].address);
    return pastav1.methods.approve(PASTAv2.networks[1].address).send({ from: account })
  }
}

export const hasv1 = async (provider, account) => {
  if (provider) {
    const web3 = new Web3(provider);
    const pastav2 = new web3.eth.Contract(PASTAv2.abi, PASTAv2.networks[1].address);
    return pastav2.methods.balanceOf(account).call()
  }
}

export const vote_new_token = async (yam, account) => {
  return yam.contracts.yam.methods.delegate("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").send({ from: account })
}

export const didDelegate = async (yam, account) => {
  return await yam.contracts.yam.methods.delegates(account).call() === '0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84'
}

export const getVotes = async (yam) => {
  const votesRaw = new BigNumber(await yam.contracts.yam.methods.getCurrentVotes("0x683A78bA1f6b25E29fbBC9Cd1BFA29A51520De84").call()).div(10 ** 24)
  return votesRaw
}

export const getVotes_piece = async (provider) => {
  var votes_cast = 0;
  const web3 = new Web3(provider);
  const my_proposal = new web3.eth.Contract(ProposalJson.abi, ProposalJson.networks[1].address);
  let votes = [];
  await my_proposal.getPastEvents('Voter', {
    fromBlock: 0,
    toBlock: 'latest'
  }, function (error, events) { }).then(function (events) {
    for (let i = 0; i < events.length; i++) {
      if (events[i].returnValues.id === "0") {
        votes.push(events[i].returnValues.voter)
      }
    }
  });
  await my_proposal.methods.get_vote(0, votes).call().then(function (events) {
    votes_cast = web3.utils.fromWei(events, 'ether')
  })
  return votes_cast
}

export const getVotes_piece2 = async (provider) => {
  var votes_cast = 0;
  const web3 = new Web3(provider);
  const my_proposal = new web3.eth.Contract(ProposalJson.abi, ProposalJson.networks[1].address);
  let votes = [];
  await my_proposal.getPastEvents('Voter', {
    fromBlock: 0,
    toBlock: 'latest'
  }, function (error, events) { }).then(function (events) {
    for (let i = 0; i < events.length; i++) {
      if (events[i].returnValues.id === "1") {
        votes.push(events[i].returnValues.voter)
      }
    }
  });
  await my_proposal.methods.get_vote(1, votes).call().then(function (events) {
    votes_cast = web3.utils.fromWei(events, 'ether')
  })
  return votes_cast
}
export const getVotes_piece3 = async (provider) => {
  var votes_cast = 0;
  const web3 = new Web3(provider);
  const my_proposal = new web3.eth.Contract(ProposalJson.abi, ProposalJson.networks[1].address);
  let votes = [];
  await my_proposal.getPastEvents('Voter', {
    fromBlock: 0,
    toBlock: 'latest'
  }, function (error, events) { }).then(function (events) {
    for (let i = 0; i < events.length; i++) {
      if (events[i].returnValues.id === "2") {
        votes.push(events[i].returnValues.voter)
      }
    }
  });
  await my_proposal.methods.get_vote(2, votes).call().then(function (events) {
    votes_cast = web3.utils.fromWei(events, 'ether')
  })
  return votes_cast
}

export const getScalingFactor = async (yam) => {
  return new BigNumber(await yam.contracts.yam.methods.yamsScalingFactor().call()).dividedBy(new BigNumber(10).pow(18))
}

export const getDelegatedBalance = async (yam, account) => {
  return new BigNumber(await yam.contracts.yam.methods.balanceOfUnderlying(account).call()).div(10 ** 24)
}

export const getRewardPerYear = async (pool) => {
  let getRewardPerYear
  if (pool.options.address.toLowerCase === "0x476c5e26a75bd202a9683ffd34359c0cc15be0ff") { // SRM has 6 decimals
    getRewardPerYear = new BigNumber(await pool.methods.rewardRate().call()).div(10 ** 6).multipliedBy(31536000);
  }
  else {
    getRewardPerYear = new BigNumber(await pool.methods.rewardRate().call()).div(10 ** 18).multipliedBy(31536000);
  }

  return getRewardPerYear;
}

export const getRewardRate = async (pool) => {
  const getRewardRate = new BigNumber(await pool.methods.rewardRate().call());
  return getRewardRate.toNumber();
}

export const getTotalSupply = async (pool) => {
  if (!pool.contract) {
    return 0
  }
  let totalSupply = new BigNumber(await pool.contract.methods.totalSupply().call());
  if (pool.id === "SRM") { // SRM has 6 decimals
    totalSupply = totalSupply.div(10 ** 6);
  } else {
    totalSupply = totalSupply.div(10 ** 18);
  }
  return totalSupply;
}

export const getAPR = async (pool, yam) => {
  const curPrice = new BigNumber(await getCurrentPrice(yam));
  let rewardPerYear = await getRewardPerYear(pool.contract);
  const totalSupply = await getTotalSupply(pool)
  let assetPrice = await getAssetPrices(yam)
  assetPrice = new BigNumber(assetPrice[pool.id])

  let apy = rewardPerYear.multipliedBy(curPrice).dividedBy(totalSupply.multipliedBy(assetPrice)).multipliedBy(100).toNumber()
  return apy
}

export const getWarAPR = async (contract, yam) => {
  if (yam && contract) {
    const curPrice = new BigNumber(await getCurrentPrice(yam));
    let rewardPerYear = await getRewardPerYear(contract);
    const totalSupplyInPool = new BigNumber(await contract.methods.totalSupply().call()).div(10 ** 18);

    const uni_token = yam.contracts.unipool_token;
    const balanceOfWAR = new BigNumber(await yam.contracts.war.methods.balanceOf(uni_token.options.address).call());
    const balanceOfWETH = new BigNumber(await yam.contracts.weth_token.methods.balanceOf(uni_token.options.address).call());
    const ethPrice = new BigNumber(await getETHPrice(yam));
    const totalSupply = new BigNumber(await uni_token.methods.totalSupply().call());

    let assetPrice = balanceOfWAR.multipliedBy(curPrice).plus(
      balanceOfWETH.multipliedBy(ethPrice)
    ).dividedBy(
      totalSupply
    )

    /*console.log(`rewardPerYear`, rewardPerYear.toString())
    console.log(`totalSupplyInPool`,totalSupplyInPool.toString())
    console.log(uni_token);
    console.log(`balanceOfWAR`,balanceOfWAR.toString())
    console.log(`balanceOfWETH`,balanceOfWETH.toString())
    console.log(`ethPrice`,ethPrice.toString())
    console.log(`totalSupply`,totalSupply.toString())
    console.log(`assetPrice`, assetPrice.toString())*/

    let apy = rewardPerYear.multipliedBy(curPrice).dividedBy(totalSupplyInPool.multipliedBy(assetPrice)).multipliedBy(100).toNumber()
    return apy
  }
}

export const getBattleAPR = async (contract, yam) => {
  let rewardPerYear = new BigNumber(14000).multipliedBy(365);
  const totalSupply = new BigNumber(await contract.methods.totalSupply().call()).div(10 ** 18);
  let apy = rewardPerYear.dividedBy(totalSupply).multipliedBy(100).toNumber()
  return apy
}

export const getTotalValue = async (pools, yam) => {
  let totalValue = new BigNumber(0)
  let poolValues = {}

  if (pools && pools[0].contract) {
    for (let i = 0; i < pools.length; i++) {
      let pool = pools[i]
      if (pool.contract) {
        let supply = new BigNumber(await getTotalSupply(pool))
        let prices = await getAssetPrices(yam)
        prices = prices[pool.id]
        poolValues[pool.contract._address] = supply.multipliedBy(prices) //await pool.contract.methods.totalSupply().call())
        totalValue = totalValue.plus(supply.multipliedBy(prices))
        //console.log(pool.id, supply.multipliedBy(prices).toString())

        if (i === (pools.length - 1)) {
          return { totalValue, poolValues };
        }
      }
    }
  }
}

export const getWarStaked = async (pools, yam) => {
  const deployer = new BigNumber(await yam.contracts.war.methods.balanceOf("0x8b6e2e23FCfaCCFd34eb8E8AC027FAA189DA36Ff").call());
  const founders = new BigNumber(await yam.contracts.war.methods.balanceOf("0xE4D5CEf90a1290617Ec9F4bBe56cf1065697F28D").call());
  const rover = new BigNumber(await yam.contracts.war.methods.balanceOf("0x9D79e728cFf8DEA7f75e3367BDEb15F462Fa3D60").call());
  const development = new BigNumber(await yam.contracts.war.methods.balanceOf("0x6618f87F540Ba8ffed5d3060A04bD4aA57ACC1b1").call());
  const dao = new BigNumber(await yam.contracts.war.methods.balanceOf("0x6d8b545c0D6317E4aF312b2E2d9c3c7b0b0Ba006").call());
  const circSupply = new BigNumber(2800000e18)
    .minus(deployer)
    .minus(founders)
    .minus(rover)
    .minus(development)
    .minus(dao);
  const warLocked = new BigNumber(await yam.contracts.war.methods.balanceOf(yam.contracts.battlepool_pool.options.address).call());
  const warStaked = warLocked.dividedBy(circSupply).multipliedBy(100);
  //console.log(deployer.toString(), team.toString(), circSupply.toString(), warLocked.toString(), warStaked.toString());
  //let warStaked = new BigNumber(await yam.contracts.war.methods.balanceOf(yam.contracts.battlepool_pool.options.address).call()).dividedBy(10**18);
  return { warStaked, circSupply };
}

let assetPrices = null

export const getAssetPrices = async (yam) => {
  if (assetPrices) {
    return assetPrices
  }
  else {
    const inAmounts = [
      "1000000000000000000", // link
      "1000000000000000000", // snx
      "1000000000000000000", // yfi
      "1000000000000000000", // comp
      "1000000000000000000", // chads
      "1000000000000000000", // lend
      "1000000000000000000", // uni
      "1000000000000000000", // wnxm
      "1000000000000000000", // mkr
      "1000000000000000000", // bzrx
      "1000000", // srm
      "1000000000000000000", // farm
      "1000000000000000000", // war
      "1000000000000000000", // based
    ]

    const routes = [
    /*link*/[["0x514910771af9ca656af840dff83e8264ecf986ca", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*snx*/[["0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*yfi*/[["0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*comp*/[["0xc00e94cb662c3520282e6f5717214004a7f26888", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*chads*/[["0x69692D3345010a207b759a7D1af6fc7F38b35c5E", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*lend*/[["0x80fb784b7ed66730e8b1dbd9820afd29931aab03", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*uni*/[["0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*wnxm*/[["0x0d438f3b5175bebc262bf23753c1e53d03432bde", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*mkr*/[["0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*bzrx*/[["0x56d811088235f11c8920698a204a5010a788f4b3", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*srm*/[["0x476c5e26a75bd202a9683ffd34359c0cc15be0ff", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*farm*/[["0xa0246c9032bc3a600820415ae600c6388619a14d", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*war*/[["0xf4a81c18816c9b0ab98fac51b36dcb63b0e58fde", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    /*based*/[["0x26cf82e4ae43d31ea51e72b663d26e26a75af729", "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"]],
    ];

    const priceArr = await yam.contracts.pricing.methods.getAmountsOutMulti(inAmounts, routes).call();
    const keys = [
      "LINK",
      "SNX",
      "YFI",
      "COMP",
      "CHADS",
      "AAVE",
      "UNI",
      "WNXM",
      "MKR",
      "BZRX",
      "SRM",
      "FARM",
      "WAR",
      "BASED",
    ];
    //console.log(priceArr);

    let priceData = {};
    keys.forEach((key, i) => priceData[key] = yam.toBigN(priceArr[i]).div(10 ** 6).toFixed(4));

    priceData["UNIPOOL"] = 35;
    priceData["BATTLEPOOL"] = priceData["WAR"];
    assetPrices = priceData;
    return priceData;
  }
}



export const getStartTime = async (pool) => {
  let starttime = 0
  if (pool && pool.contract) {
    starttime = await pool.contract.methods.starttime().call()
  }
  return starttime;
}

export const getYamContract = (yam) => {
  return yam.contracts.yam;
}

/* ======================================
            election methods
====================================== */

export const getCurrentBets = async (yam) => {
  const precision = new BigNumber(10).pow(18);

  const trumpETHPot = new BigNumber(await yam.contracts.election_betting.methods.trumpETHPot().call()) / precision;
  const bidenETHPot = new BigNumber(await yam.contracts.election_betting.methods.bidenETHPot().call()) / precision;
  const trumpWARPot = new BigNumber(await yam.contracts.election_betting.methods.trumpWARPot().call()) / precision;
  const bidenWARPot = new BigNumber(await yam.contracts.election_betting.methods.bidenWARPot().call()) / precision;

  return ({ trumpETHPot, bidenETHPot, trumpWARPot, bidenWARPot });
}

export const getCurrentBalances = async (yam, account) => {
  if (yam.defaultProvider) {
    return ({ trumpETHBal: 0, bidenETHBal: 0, trumpWARBal: 0, bidenWARBal: 0 });
  }
  const precision = new BigNumber(10).pow(18);

  const trumpETHBal = new BigNumber(await yam.contracts.election_betting.methods.trumpETHBet(account).call()) / precision;
  const bidenETHBal = new BigNumber(await yam.contracts.election_betting.methods.bidenETHBet(account).call()) / precision;
  const trumpWARBal = new BigNumber(await yam.contracts.election_betting.methods.trumpWARBet(account).call()) / precision;
  const bidenWARBal = new BigNumber(await yam.contracts.election_betting.methods.bidenWARBet(account).call()) / precision;


  return ({ trumpETHBal, bidenETHBal, trumpWARBal, bidenWARBal });
}

// const precision = poolContract.options.address.toLowerCase() === "0x7845664310e205c979aa067bcfe02704d1001bcf" ?
// new BigNumber(10).pow(6) :
// new BigNumber(10).pow(18);

// return poolContract.methods
// .stake((new BigNumber(amount).times(precision)).toString())

export const placeElectionWARBet = async (yam, candidate, amount, account) => {
  console.log("war bet: ", candidate, amount, account);
  const precision = new BigNumber(10).pow(18);
  let p = await yam.contracts.election_betting.methods.WARBet(
    candidate, new BigNumber(amount).times(precision).toString()
  )
    .send({ from: account, gas: 200000 })
  return (p);
}

export const placeElectionETHBet = async (yam, candidate, amount, account) => {
  console.log("eth bet: ", candidate, amount, account);
  const precision = new BigNumber(10).pow(18);

  let p = await yam.contracts.election_betting.methods.ETHBet(candidate)
    .send({ from: account, value: new BigNumber(amount).times(precision).toString(), gas: 200000 });
  return (p);
}

export const getElectionContracts = (yam) => {
  if (!yam || !yam.contracts) {
    return null
  }
  const election = yam.contracts.election_betting
  return election
}

export const getElectionFinished = async (yam) => {
  const electionFinished = await yam.contracts.election_betting.methods.winner().call();
  return (electionFinished);
}

export const getElectionRewards = async (yam, account) => {
  let p = await yam.contracts.election_betting.methods.getRewards().send({ from: account, gas: 200000 })
    .on('transactionHash', tx => {
      console.log("get election rewards", tx)
      return tx.transactionHash
    })
  return (p);
}

export const electionTVL = async (yam, account) => {
  const ethPrice = await getETHPrice(yam)
  const curPrice = await getCurrentPrice(yam)
  const currentBets = await getCurrentBets(yam)
  const trumpEth = ethPrice * currentBets.trumpETHPot
  const bidenEth = ethPrice * currentBets.bidenETHPot
  const trumpWar = curPrice * currentBets.trumpWARPot
  const bidenWar = curPrice * currentBets.bidenWARPot
  const trumpTotal = trumpEth + trumpWar
  const bidenTotal = bidenEth + bidenWar

  return { trumpTotal, bidenTotal }
}

export const getLiveElectionResults = async (yam, states) => {
  for (let i = 0; i < states.length; i++) {
    let data = await yam.contracts.everipedia.methods.presidentialWinners(states[i].name).call()
    // console.log(data);
    states[i].winner = data.winner
    states[i].resultNow = data.resultNow
    states[i].resultBlock = data.resultBlock
    // console.log(states[i]);
  }
  return states
}

/* ======================================
            AP BET methods
====================================== */
export const getCurrentBetsAP = async (yam) => {
  const precision = new BigNumber(10).pow(18);

  const choice1ETHPot = new BigNumber(await yam.contracts.ap_betting.methods.choice1ETHPot().call()) / precision;
  const choice2ETHPot = new BigNumber(await yam.contracts.ap_betting.methods.choice2ETHPot().call()) / precision;
  const choice1WARPot = new BigNumber(await yam.contracts.ap_betting.methods.choice1WARPot().call()) / precision;
  const choice2WARPot = new BigNumber(await yam.contracts.ap_betting.methods.choice2WARPot().call()) / precision;

  return ({ choice1ETHPot, choice2ETHPot, choice1WARPot, choice2WARPot });
}

export const getCurrentBalancesAP = async (yam, account) => {
  if (yam.defaultProvider) {
    return ({ choice1ETHBal: 0, choice2ETHBal: 0, choice1WARBal: 0, choice2WARBal: 0 });
  }
  const precision = new BigNumber(10).pow(18);

  const choice1ETHBal = new BigNumber(await yam.contracts.ap_betting.methods.choice1ETHBet(account).call()) / precision;
  const choice2ETHBal = new BigNumber(await yam.contracts.ap_betting.methods.choice2ETHBet(account).call()) / precision;
  const choice1WARBal = new BigNumber(await yam.contracts.ap_betting.methods.choice1WARBet(account).call()) / precision;
  const choice2WARBal = new BigNumber(await yam.contracts.ap_betting.methods.choice2WARBet(account).call()) / precision;


  return ({ choice1ETHBal, choice2ETHBal, choice1WARBal, choice2WARBal });
}

// const precision = poolContract.options.address.toLowerCase() === "0x7845664310e205c979aa067bcfe02704d1001bcf" ?
// new BigNumber(10).pow(6) :
// new BigNumber(10).pow(18);

// return poolContract.methods
// .stake((new BigNumber(amount).times(precision)).toString())

export const placeWARBetAP = async (yam, candidate, amount, account) => {
  console.log("war bet: ", candidate, amount, account);
  const precision = new BigNumber(10).pow(18);
  let p = await yam.contracts.ap_betting.methods.WARBet(
    candidate, new BigNumber(amount).times(precision).toString()
  )
    .send({ from: account, gas: 200000 })
  return (p);
}

export const placeETHBetAP = async (yam, candidate, amount, account) => {
  console.log("eth bet: ", candidate, amount, account);
  const precision = new BigNumber(10).pow(18);

  let p = await yam.contracts.ap_betting.methods.ETHBet(candidate)
    .send({ from: account, value: new BigNumber(amount).times(precision).toString(), gas: 200000 });
  return (p);
}

export const getContractsAP = (yam) => {
  if (!yam || !yam.contracts) {
    return null
  }
  const election = yam.contracts.ap_betting
  return election
}

export const getFinishedAP = async (yam) => {
  const electionFinished = await yam.contracts.ap_betting.methods.winner().call();
  return (electionFinished);
}

export const getRewardsAP = async (yam, account) => {
  let p = await yam.contracts.ap_betting.methods.getRewards().send({ from: account, gas: 200000 })
    .on('transactionHash', tx => {
      console.log("get election rewards", tx)
      return tx.transactionHash
    })
  return (p);
}

export const TVL_AP = async (yam, account) => {
  const ethPrice = await getETHPrice(yam)
  const curPrice = await getCurrentPrice(yam)
  const currentBets = await getCurrentBetsAP(yam)
  const choice1Eth = ethPrice * currentBets.choice1ETHPot
  const choice2Eth = ethPrice * currentBets.choice2ETHPot
  const choice1War = curPrice * currentBets.choice1WARPot
  const choice2War = curPrice * currentBets.choice2WARPot
  const choice1Total = choice1Eth + choice1War
  const choice2Total = choice2Eth + choice2War

  return { choice1Total, choice2Total }
}

/* ======================================
            bet v2 methods
====================================== */
export const getPots = async (yam, betId) => {
  const potsTotal = await yam.contracts.betting_v2.methods.getPots(betId).call()
  console.log("get pots: ", potsTotal);
  return (potsTotal);
}

export const getUserBet = async (yam, betId, account) => {
  console.log("calling user bet: ", betId)
  const currentBet = await yam.contracts.betting_v2.methods.getCurrentBet(betId, account).call()
  console.log("get current bet: ", currentBet);
  return (currentBet);
}

export const placeETHBet = async (yam, betId, choice, amount, account) => {
  console.log("eth bet: ", choice, amount, account);
  const precision = new BigNumber(10).pow(18);
  let choices = await yam.contracts.betting_v2.methods.getBet(betId).call()
  let p = await yam.contracts.betting_v2.methods.ETHBet(betId, choices.possibleChoices[choice])
    .send({ from: account, value: new BigNumber(amount).times(precision).toString(), gas: 200000 });
  return (p);
}

export const getRewards = async (yam, betId, account) => {
  let p = await yam.contracts.betting_v2.methods.getRewards(betId).send({ from: account, gas: 200000 })
    .on('transactionHash', tx => {
      console.log("get bet rewards: ", tx)
      return tx.transactionHash
    })
  return (p);
}

export const getUserBetHistory = async (yam, account) => {
  const betHistory = await yam.contracts.betting_v2.methods.getBetHistory(account).call()
  console.log("bet history: ", betHistory);
  return (betHistory);
}

export const getUserCurrentBet = async (yam, betId, account) => {
  const currentBet = await yam.contracts.betting_v2.methods.getCurrentBet(betId, account).call()
  console.log("current bet: ", currentBet);
  return (currentBet);
}

export const getOutstandingBets = async (yam, account) => {
  let outstandingBets = await yam.contracts.betting_v2.methods.listOutstandingRewards(account).call()
  // console.log(outstandingBets);
  // for (let i = 0; i < outstandingBets.length; i++) {
  //   outstandingBets[i] = await yam.contracts.betting_v2.methods.getBet(outstandingBets[i].betId).call()
  // }
  return outstandingBets
}

/*==========================
            ADMIN
==========================*/

export const createNewContract = async (yam, account) => {
  const id = "5fb2c2e05db46604cd2c5bd2";
  const desc = "@CryptoCobain vs @CryptoGainz1";
  // const endTime = parseInt(new Date(new Date().getTime() + 1 * 60 * 60 * 24 * 1000).getTime() / 1000);

  const endTime = moment.utc('2020-11-17T20:00', "YYYY-MM-DDTHH:mm").unix();
  const lastClaimTime = parseInt(new Date(new Date().getTime() + 30 * 60 * 60 * 24 * 1000).getTime() / 1000);
  const choice1 = "@CryptoCobain";
  const choice2 = "@CryptoGainz1";

  console.log("attempting")
  yam.contracts.betting_v2.methods.createBet(id, desc, endTime, lastClaimTime, choice1, choice2).send({ from: account, gas: 300000 }).then((res) => {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@", res);

  })
}

export const finishBet = async (yam, betId, choice, account) => {
  console.log("finish bet: ", betId, choice, account);
  let choices = await yam.contracts.betting_v2.methods.getBet(betId).call()
  let p = await yam.contracts.betting_v2.methods.finalizeBet(betId, choices.possibleChoices[choice])
    .send({ from: account, gas: 300000 });
  console.log("bet finished: ", p);
  return (p);
}