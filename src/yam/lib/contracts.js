import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';
import * as Types from "./types.js";
import { SUBTRACT_GAS_LIMIT, addressMap } from './constants.js';

import ERC20Json from '../clean_build/contracts/IERC20.json';
import WARJson from '../clean_build/contracts/IERC20.json';
import WETHJson from './weth.json';

import UNIFactJson from './unifact2.json';
import UNIPairJson from './uni2.json';
import UNIRouterJson from './uniR.json';

import WARPoolJson from '../clean_build/contracts/WARPool.json';

import PricingJson from '../clean_build/contracts/Pricing.json';

export class Contracts {
  constructor(
    provider,
    networkId,
    web3,
    options
  ) {

    this.assetPrices = {};

    this.web3 = web3;
    this.defaultConfirmations = options.defaultConfirmations;
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5;
    this.confirmationType = options.confirmationType || Types.ConfirmationType.Confirmed;
    this.defaultGas = options.defaultGas;
    this.defaultGasPrice = options.defaultGasPrice;

    this.uni_pair = new this.web3.eth.Contract(UNIPairJson);
    this.uni_router = new this.web3.eth.Contract(UNIRouterJson);
    this.uni_fact = new this.web3.eth.Contract(UNIFactJson);
    this.UNIAmpl = new this.web3.eth.Contract(ERC20Json.abi);
    this.war = new this.web3.eth.Contract(ERC20Json.abi);
    this.pricing = new this.web3.eth.Contract(PricingJson.abi);

    //s2
    this.send_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.hate_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.stbu_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.yfl_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.rope_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.z_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.cream_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.value_token = new this.web3.eth.Contract(ERC20Json.abi);

    this.send_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.hate_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.stbu_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.yfl_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.rope_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.z_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.cream_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.value_pool = new this.web3.eth.Contract(WARPoolJson.abi);

    //s1
    this.link_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.snx_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.yfi_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.comp_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.chads_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.bzrx_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.uni_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.lend_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.wnxm_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.mkr_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.srm_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.farm_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.mbbased_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.unipool_token = new this.web3.eth.Contract(ERC20Json.abi);
    this.battlepool_token = new this.web3.eth.Contract(ERC20Json.abi);

    this.link_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.snx_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.yfi_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.comp_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.chads_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.bzrx_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.uni_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.lend_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.wnxm_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.mkr_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.srm_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.farm_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.mbbased_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.unipool_pool = new this.web3.eth.Contract(WARPoolJson.abi);
    this.battlepool_pool = new this.web3.eth.Contract(WARPoolJson.abi);

    this.erc20 = new this.web3.eth.Contract(ERC20Json.abi);

    this.weth = new this.web3.eth.Contract(WETHJson);
    this.setProvider(provider, networkId);
    this.setDefaultAccount(this.web3.eth.defaultAccount);
  }

  setProvider(
    provider,
    networkId
  ) {
    this.war.setProvider(provider);
    this.uni_router.setProvider(provider);
    this.pricing.setProvider(provider);
    const contracts = [
      { contract: this.war, json: WARJson },
      //s2
      { contract: this.send_pool, json: WARPoolJson },
      { contract: this.hate_pool, json: WARPoolJson },
      { contract: this.stbu_pool, json: WARPoolJson },
      { contract: this.yfl_pool, json: WARPoolJson },
      { contract: this.rope_pool, json: WARPoolJson },
      { contract: this.z_pool, json: WARPoolJson },
      { contract: this.cream_pool, json: WARPoolJson },
      { contract: this.value_pool, json: WARPoolJson },
      //s1
      { contract: this.link_pool, json: WARPoolJson },
      { contract: this.snx_pool, json: WARPoolJson },
      { contract: this.yfi_pool, json: WARPoolJson },
      { contract: this.comp_pool, json: WARPoolJson },
      { contract: this.chads_pool, json: WARPoolJson },
      { contract: this.bzrx_pool, json: WARPoolJson },
      { contract: this.uni_pool, json: WARPoolJson },
      { contract: this.lend_pool, json: WARPoolJson },
      { contract: this.wnxm_pool, json: WARPoolJson },
      { contract: this.mkr_pool, json: WARPoolJson },
      { contract: this.srm_pool, json: WARPoolJson },
      { contract: this.farm_pool, json: WARPoolJson },
      { contract: this.mbbased_pool, json: WARPoolJson },
      { contract: this.unipool_pool, json: WARPoolJson },
      { contract: this.battlepool_pool, json: WARPoolJson },
    ]

    contracts.forEach(contract => this.setContractProvider(
      contract.contract,
      contract.json,
      provider,
      networkId,
    ),
    );

    //s2
    this.send_pool.options.address = addressMap["send_pool"];
    this.hate_pool.options.address = addressMap["hate_pool"];
    this.stbu_pool.options.address = addressMap["stbu_pool"];
    this.yfl_pool.options.address = addressMap["yfl_pool"];
    this.rope_pool.options.address = addressMap["rope_pool"];
    this.z_pool.options.address = addressMap["z_pool"];
    this.cream_pool.options.address = addressMap["cream_pool"];
    this.value_pool.options.address = addressMap["value_pool"];

    this.send_token.options.address = addressMap["send"];
    this.hate_token.options.address = addressMap["hate"];
    this.stbu_token.options.address = addressMap["stbu"];
    this.yfl_token.options.address = addressMap["yfl"];
    this.rope_token.options.address = addressMap["rope"];
    this.z_token.options.address = addressMap["z"];
    this.cream_token.options.address = addressMap["cream"];
    this.value_token.options.address = addressMap["value"];

    //s1
    this.link_pool.options.address = addressMap["link_pool"];
    this.snx_pool.options.address = addressMap["snx_pool"];
    this.yfi_pool.options.address = addressMap["yfi_pool"];
    this.comp_pool.options.address = addressMap["comp_pool"];
    this.chads_pool.options.address = addressMap["chads_pool"];
    this.bzrx_pool.options.address = addressMap["bzrx_pool"];
    this.uni_pool.options.address = addressMap["uni_pool"];
    this.lend_pool.options.address = addressMap["lend_pool"];
    this.wnxm_pool.options.address = addressMap["wnxm_pool"];
    this.mkr_pool.options.address = addressMap["mkr_pool"];
    this.srm_pool.options.address = addressMap["srm_pool"];
    this.farm_pool.options.address = addressMap["farm_pool"];
    this.mbbased_pool.options.address = addressMap["mbbased_pool"];
    this.unipool_pool.options.address = addressMap["unipool_pool"];
    this.battlepool_pool.options.address = addressMap["battlepool_pool"];

    this.link_token.options.address = addressMap["link"];
    this.snx_token.options.address = addressMap["snx"];
    this.yfi_token.options.address = addressMap["yfi"];
    this.comp_token.options.address = addressMap["comp"];
    this.chads_token.options.address = addressMap["chads"];
    this.bzrx_token.options.address = addressMap["bzrx"];
    this.uni_token.options.address = addressMap["uni"];
    this.lend_token.options.address = addressMap["lend"];
    this.wnxm_token.options.address = addressMap["wnxm"];
    this.mkr_token.options.address = addressMap["mkr"];
    this.srm_token.options.address = addressMap["srm"];
    this.farm_token.options.address = addressMap["farm"];
    this.mbbased_token.options.address = addressMap["mbbased"];
    this.unipool_token.options.address = addressMap["unipool"];
    this.battlepool_token.options.address = addressMap["war"];

    this.war.options.address = addressMap["war"];

    this.uni_fact.options.address = addressMap["uniswapFactoryV2"];
    this.uni_router.options.address = addressMap["UNIRouter"];
    this.pricing.options.address = addressMap["Pricing"];

    this.pools = [
      //s2
      { "tokenAddr": this.send_token.options.address, "poolAddr": this.send_pool.options.address },
      { "tokenAddr": this.hate_token.options.address, "poolAddr": this.hate_pool.options.address },
      { "tokenAddr": this.stbu_token.options.address, "poolAddr": this.stbu_pool.options.address },
      { "tokenAddr": this.yfl_token.options.address, "poolAddr": this.yfl_pool.options.address },
      { "tokenAddr": this.rope_token.options.address, "poolAddr": this.rope_pool.options.address },
      { "tokenAddr": this.z_token.options.address, "poolAddr": this.z_pool.options.address },
      { "tokenAddr": this.cream_token.options.address, "poolAddr": this.cream_pool.options.address },
      { "tokenAddr": this.value_token.options.address, "poolAddr": this.value_pool.options.address },

      //s1
      { "tokenAddr": this.link_token.options.address, "poolAddr": this.link_pool.options.address },
      { "tokenAddr": this.snx_token.options.address, "poolAddr": this.snx_pool.options.address },
      { "tokenAddr": this.yfi_token.options.address, "poolAddr": this.yfi_pool.options.address },
      { "tokenAddr": this.comp_token.options.address, "poolAddr": this.comp_pool.options.address },
      { "tokenAddr": this.chads_token.options.address, "poolAddr": this.chads_pool.options.address },
      { "tokenAddr": this.bzrx_token.options.address, "poolAddr": this.bzrx_pool.options.address },
      { "tokenAddr": this.uni_token.options.address, "poolAddr": this.uni_pool.options.address },
      { "tokenAddr": this.lend_token.options.address, "poolAddr": this.lend_pool.options.address },
      { "tokenAddr": this.wnxm_token.options.address, "poolAddr": this.wnxm_pool.options.address },
      { "tokenAddr": this.mkr_token.options.address, "poolAddr": this.mkr_pool.options.address },
      { "tokenAddr": this.srm_token.options.address, "poolAddr": this.srm_pool.options.address },
      { "tokenAddr": this.farm_token.options.address, "poolAddr": this.farm_pool.options.address },
      { "tokenAddr": this.mbbased_token.options.address, "poolAddr": this.mbbased_pool.options.address },
      { "tokenAddr": this.unipool_token.options.address, "poolAddr": this.unipool_pool.options.address },
      { "tokenAddr": this.battlepool_token.options.address, "poolAddr": this.battlepool_pool.options.address },
    ]
  }

  setDefaultAccount(
    account
  ) {
    //s2
    this.send_token.options.from = account;
    this.hate_token.options.from = account;
    this.stbu_token.options.from = account;
    this.yfl_token.options.from = account;
    this.rope_token.options.from = account;
    this.z_token.options.from = account;
    this.cream_token.options.from = account;
    this.value_token.options.from = account;

    //s1
    this.link_token.options.from = account;
    this.snx_token.options.from = account;
    this.yfi_token.options.from = account;
    this.comp_token.options.from = account;
    this.chads_token.options.from = account;
    this.bzrx_token.options.from = account;
    this.uni_token.options.from = account;
    this.lend_token.options.from = account;
    this.wnxm_token.options.from = account;
    this.mkr_token.options.from = account;
    this.srm_token.options.from = account;
    this.farm_token.options.from = account;
    this.mbbased_token.options.from = account;
    this.unipool_token.options.from = account;
    this.battlepool_token.options.from = account;
    this.uni_router.options.from = account;
    this.pricing.options.from = account;
  }

  async callContractFunction(
    method,
    options
  ) {
    const { confirmations, confirmationType, autoGasMultiplier, ...txOptions } = options;

    if (!this.blockGasLimit) {
      await this.setGasLimit();
    }

    if (!txOptions.gasPrice && this.defaultGasPrice) {
      txOptions.gasPrice = this.defaultGasPrice;
    }

    if (confirmationType === Types.ConfirmationType.Simulate || !options.gas) {
      let gasEstimate;
      if (this.defaultGas && confirmationType !== Types.ConfirmationType.Simulate) {
        txOptions.gas = this.defaultGas;
      } else {
        try {
          console.log("estimating gas");
          gasEstimate = await method.estimateGas(txOptions);
        } catch (error) {
          const data = method.encodeABI();
          const { from, value } = options;
          const to = method._parent._address;
          error.transactionData = { from, value, data, to };
          throw error;
        }

        const multiplier = autoGasMultiplier || this.autoGasMultiplier;
        const totalGas = Math.floor(gasEstimate * multiplier);
        txOptions.gas = totalGas < this.blockGasLimit ? totalGas : this.blockGasLimit;
      }

      if (confirmationType === Types.ConfirmationType.Simulate) {
        let g = txOptions.gas;
        return { gasEstimate, g };
      }
    }

    if (txOptions.value) {
      txOptions.value = new BigNumber(txOptions.value).toFixed(0);
    } else {
      txOptions.value = '0';
    }

    const promi = method.send(txOptions);

    const OUTCOMES = {
      INITIAL: 0,
      RESOLVED: 1,
      REJECTED: 2,
    };

    let hashOutcome = OUTCOMES.INITIAL;
    let confirmationOutcome = OUTCOMES.INITIAL;

    const t = confirmationType !== undefined ? confirmationType : this.confirmationType;

    if (!Object.values(Types.ConfirmationType).includes(t)) {
      throw new Error(`Invalid confirmation type: ${t}`);
    }

    let hashPromise;
    let confirmationPromise;

    if (t === Types.ConfirmationType.Hash || t === Types.ConfirmationType.Both) {
      hashPromise = new Promise(
        (resolve, reject) => {
          promi.on('error', (error) => {
            if (hashOutcome === OUTCOMES.INITIAL) {
              hashOutcome = OUTCOMES.REJECTED;
              reject(error);
              const anyPromi = promi;
              anyPromi.off();
            }
          });

          promi.on('transactionHash', (txHash) => {
            if (hashOutcome === OUTCOMES.INITIAL) {
              hashOutcome = OUTCOMES.RESOLVED;
              resolve(txHash);
              if (t !== Types.ConfirmationType.Both) {
                const anyPromi = promi;
                anyPromi.off();
              }
            }
          });
        },
      );
    }

    if (t === Types.ConfirmationType.Confirmed || t === Types.ConfirmationType.Both) {
      confirmationPromise = new Promise(
        (resolve, reject) => {
          promi.on('error', (error) => {
            if (
              (t === Types.ConfirmationType.Confirmed || hashOutcome === OUTCOMES.RESOLVED)
              && confirmationOutcome === OUTCOMES.INITIAL
            ) {
              confirmationOutcome = OUTCOMES.REJECTED;
              reject(error);
              const anyPromi = promi;
              anyPromi.off();
            }
          });

          const desiredConf = confirmations || this.defaultConfirmations;
          if (desiredConf) {
            promi.on('confirmation', (confNumber, receipt) => {
              if (confNumber >= desiredConf) {
                if (confirmationOutcome === OUTCOMES.INITIAL) {
                  confirmationOutcome = OUTCOMES.RESOLVED;
                  resolve(receipt);
                  const anyPromi = promi;
                  anyPromi.off();
                }
              }
            });
          } else {
            promi.on('receipt', (receipt) => {
              confirmationOutcome = OUTCOMES.RESOLVED;
              resolve(receipt);
              const anyPromi = promi;
              anyPromi.off();
            });
          }
        },
      );
    }

    if (t === Types.ConfirmationType.Hash) {
      const transactionHash = await hashPromise;
      if (this.notifier) {
        this.notifier.hash(transactionHash)
      }
      return { transactionHash };
    }

    if (t === Types.ConfirmationType.Confirmed) {
      return confirmationPromise;
    }

    const transactionHash = await hashPromise;
    if (this.notifier) {
      this.notifier.hash(transactionHash)
    }
    return {
      transactionHash,
      confirmation: confirmationPromise,
    };
  }

  async callConstantContractFunction(
    method,
    options
  ) {
    const m2 = method;
    const { blockNumber, ...txOptions } = options;
    return m2.call(txOptions, blockNumber);
  }

  async setGasLimit() {
    const block = await this.web3.eth.getBlock('latest');
    this.blockGasLimit = block.gasLimit - SUBTRACT_GAS_LIMIT;
  }

  setContractProvider(
    contract,
    contractJson,
    provider,
    networkId,
  ) {
    contract.setProvider(provider);
    try {
      contract.options.address = contractJson.networks[networkId]
        && contractJson.networks[networkId].address;
    } catch (error) {
      // console.log(error)
    }
  }
}
