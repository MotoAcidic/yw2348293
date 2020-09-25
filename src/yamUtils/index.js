import { ethers } from 'ethers'
import Web3 from 'web3';
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import ProposalJson from '../yam/clean_build/contracts/Proposal.json';
import PASTAv1 from '../yam/clean_build/contracts/PASTAv1.json';
import PASTAv2 from '../yam/clean_build/contracts/PASTAv2.json';

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

export const stake = async (poolContract, amount, account) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1097172400) {
    return poolContract.methods
      .stake((new BigNumber(amount).times(new BigNumber(10).pow(18))).toString())
      .send({ from: account, gas: 200000 })
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
    return poolContract.methods
      .withdraw((new BigNumber(amount).times(new BigNumber(10).pow(18))).toString())
      .send({ from: account, gas: 200000 })
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
      .send({ from: account, gas: 200000 })
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
      .send({ from: account, gas: 200000 })
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

export const getCurrentPrice = async (yam) => {
  //return yam.toBigN(await yam.contracts.rebaser.methods.getCurrentTWAP().call())
  /*let p = await yam.contracts.uni_router.methods.getAmountsOut(
    new BigNumber(1000000000000000000),
    [
      "0x56d811088235f11c8920698a204a5010a788f4b3",
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    ]
  ).call();*/

  // call for kovan
  /*let p = await yam.contracts.uni_router.methods.getAmountsOut(
    new BigNumber(1000000000000000000),
    [
      "0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"
    ]
  ).call();



  p = yam.toBigN(p[p.length - 1]).div(10**18).toFixed(4);
  console.log(p);
  return p;*/
  return 0;
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
  const getRewardPerYear = new BigNumber(await pool.methods.rewardRate().call()).div(10 ** 18).multipliedBy(31536000);
  return getRewardPerYear;
}

export const getRewardRate = async (pool) => {
  const getRewardRate = new BigNumber(await pool.methods.rewardRate().call());
  return getRewardRate.toNumber();
}

export const getTotalSupply = async (pool) => {
  let totalSupply = new BigNumber(await pool.methods.totalSupply().call());
  if (pool.options.address.toLowerCase == "0x476c5e26a75bd202a9683ffd34359c0cc15be0ff") { // SRM has 6 decimals
    totalSupply = totalSupply.div(10 ** 6);
  } else {
    totalSupply = totalSupply.div(10 ** 18);
  }
  return totalSupply;
}

export const getAPY = async (pool, yam) => {
  const curPrice = await getCurrentPrice(yam);
  const rewardPerYear = getRewardPerYear(pool);
  const totalSupply = getTotalSupply(pool)
  const assetPrice = 5
  const apy = rewardPerYear.mult(curPrice).div(totalSupply.mult(assetPrice))
  return apy
}

export const getAPR = async (pool) => {
  //const rewardPerYear = await getRewardPerYear(pool);
  //const totalSupply = await getTotalSupply(pool);
  /*if (pool) {
    return 10;
  } else {
    return 0;
  }*/
  return 0;
}

export const getTotalValue = async (pools) => {
  let totalValue = new BigNumber(0)
  let poolValues = {}
  if (pools && pools[0].contract) {
    for (let i = 0; i < pools.length; i++) {
      let pool = pools[i]
      poolValues[pool.contract._address] = new BigNumber(0); //await pool.contract.methods.totalSupply().call())
      totalValue = totalValue.plus(poolValues[pool.contract._address])
      if (i === (pools.length - 1)) {
        return { totalValue, poolValues };
      }
    }
  }
}
/*
export const getAssetPrices = async (yam) => {
  let prices = yam.assetPrices;
  if (Object.keys(yam.assetPrices).length === 0) {

    let inAmounts = {
      link: "1000000000000000000",
      snx: "1000000000000000000",
      yfi: "1000000000000000000",
      comp: "1000000000000000000",
      chads: "1000000000000000000",
      bzrx: "1000000000000000000",
      uni: "1000000000000000000",
      lend: "1000000000000000000",
      wnxm: "1000000000000000000",
      mkr: "1000000000000000000",
      srm: "1000000",
      farm: "1000000000000000000",
    }

    let routes = {
      link: ["0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"],
      snx: ["0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"],
      yfi: ["0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"],
      comp: ["0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"],
      chads: ["0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"],
      bzrx: ["0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"],
      uni: ["0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"],
      lend: ["0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"],
      wnxm: ["0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"],
      mkr: ["0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"],
      srm: ["0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"],
      farm: ["0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD", "0xd0A1E359811322d97991E03f863a0C30C2cF029C"],
    }

    let priceArr = await pool.contract.methods.totalSupply().call()

    let totalValue = new BigNumber(0)
    let poolValues = {}
    if (pools && pools[0].contract) {
      for (let i = 0; i < pools.length; i++) {
        let pool = pools[i]
        poolValues[pool.contract._address] = new BigNumber(await pool.contract.methods.totalSupply().call())
        totalValue = totalValue.plus(poolValues[pool.contract._address])
        if (i === (pools.length - 1)) {
          return {totalValue, poolValues};
        }
      }
    }

    yam.assetPrices = prices;
    return prices;
  } else {
    return prices;
  }
}
*/



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

