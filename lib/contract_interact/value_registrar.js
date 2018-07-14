"use strict";

/**
 *
 * Contract interaction methods for Value Registrar Contract.<br><br>
 *
 * @module lib/contract_interact/value_registrar
 *
 */

const rootPrefix = "../.."
  , web3ProviderFactory = require(rootPrefix + '/lib/web3/providers/factory')
  , contractInteractHelper = require(rootPrefix + '/lib/contract_interact/helper')
  , coreConstants = require(rootPrefix + '/config/core_constants')
  , coreAddresses = require(rootPrefix + '/config/core_addresses')
  , responseHelper = require(rootPrefix + "/lib/formatter/response")
  , basicHelper = require(rootPrefix + '/helpers/basic_helper')
  , OpsManagedKlass = require(rootPrefix + '/lib/contract_interact/ops_managed')
;

const valueRegistrarContractName = 'valueRegistrar'
  , valueRegistrarContractAbi = coreAddresses.getAbiForContract(valueRegistrarContractName)
  , VC_GAS_PRICE = coreConstants.OST_VALUE_GAS_PRICE
  , VC_GAS_LIMIT = coreConstants.OST_VALUE_GAS_LIMIT
;

var valueRegistrarContractObj = null;
/**
 * Constructor for Value Registrar Contract Interact
 *
 * @constructor
 * @augments OpsManagedKlass
 *
 * @param {String} contractAddress - address where Contract has been deployed
 *
 */
const ValueRegistrarKlass = function (contractAddress) {
  valueRegistrarContractObj = valueRegistrarContractObj || new (web3ProviderFactory.getProvider('value', 'ws')).eth.Contract(valueRegistrarContractAbi);
  this.contractAddress = contractAddress;

  valueRegistrarContractObj.options.address = this.contractAddress;

  OpsManagedKlass.call(this, this.contractAddress, web3ProviderFactory.getProvider('value', 'ws'), valueRegistrarContractObj, VC_GAS_PRICE);
};

// adding the methods from OpsManged Contract
ValueRegistrarKlass.prototype = Object.create(OpsManagedKlass.prototype);

ValueRegistrarKlass.prototype.constructor = ValueRegistrarKlass;

/**
 * Add Core on value chain
 *
 * @param {string} senderName - address which sent register BT request
 * @param {string} registry - address of OpenSTValue registry
 * @param {string} coreContractAddress - address where core contract is deployed
 *
 * @return {promise<result>}
 *
 */
ValueRegistrarKlass.prototype.addCore = function (senderName, registry, coreContractAddress) {

  const encodedABI = valueRegistrarContractObj.methods.addCore(registry, coreContractAddress).encodeABI();

  return contractInteractHelper.safeSend(
    web3ProviderFactory.getProvider('value', 'ws'),
    this.contractAddress,
    encodedABI,
    senderName,
    {gasPrice: VC_GAS_PRICE, gas: VC_GAS_LIMIT}
  );

};

/**
 * Register Utility Token
 *
 * @param {string} senderAddress - address which sent register BT request
 * @param {string} senderPassphrase - passphrase of senderAddress
 * @param {string} registry - address of OpenSTUtility registry
 * @param {string} symbol - member company symbol
 * @param {string} name -  member company name
 * @param {number} conversionRate -  member company conversation rate wrt ST
 * @param {number} conversionRateDecimals -  member company conversation rate decimals
 * @param {string} utilityChainId - chain id of utility chain where BT transactions would reside
 * @param {string} requester - address of requester
 * @param {string} checkUuid - UUID for validating transaction
 *
 * @return {promise<result>}
 *
 */
ValueRegistrarKlass.prototype.registerUtilityToken = async function (senderAddress, senderPassphrase,
                                                                     registry, symbol, name, conversionRate,
                                                                     conversionRateDecimals, utilityChainId,
                                                                     requester, checkUuid) {

  const oThis = this;
  //Calculate gas required for proposing branded token.
  const gasToUse = await valueRegistrarContractObj.methods
    .registerUtilityToken(registry, symbol, name, conversionRate, conversionRateDecimals, utilityChainId, requester, checkUuid)
    .estimateGas({from: senderAddress, gasPrice: VC_GAS_PRICE});

  if (Number(gasToUse) === Number(VC_GAS_LIMIT)) {
    let errObj = responseHelper.error({
      internal_error_identifier: 'l_ci_vr_registerUtilityToken_1',
      api_error_identifier: 'something_went_wrong',
      error_config: basicHelper.fetchErrorConfig()
    });
    return Promise.resolve(errObj);
  }

  const encodedABI = valueRegistrarContractObj.methods.registerUtilityToken(registry, symbol, name, conversionRate,
    conversionRateDecimals, utilityChainId, requester, checkUuid).encodeABI();

  return contractInteractHelper.safeSendFromAddr(
    web3ProviderFactory.getProvider('value', 'ws'),
    this.contractAddress,
    encodedABI,
    senderAddress,
    senderPassphrase,
    {gasPrice: VC_GAS_PRICE, gas: gasToUse}
  );

};

/**
 * Confirm Redemption Intent
 *
 * @param {string} senderAddress - address which sent register BT request
 * @param {string} senderPassphrase - passphrase of senderAddress
 * @param {string} registryContractAddr - registry contract address
 * @param {string} uuid - UUID for validating transaction
 * @param {string} redeemerAddr - redeemer address
 * @param {string} redeemerNonce -  redeemer noonce
 * @param {string} amountUT -  amount of BT
 * @param {number} redemptionUnlockHeight -
 * @param {string} redemptionIntentHash -
 *
 * @return {Promise}
 *
 */
ValueRegistrarKlass.prototype.confirmRedemptionIntent = function (senderAddress, senderPassphrase,
                                                                  registryContractAddr, uuid, redeemerAddr,
                                                                  redeemerNonce, amountUT, redemptionUnlockHeight,
                                                                  redemptionIntentHash) {

  const encodedABI = valueRegistrarContractObj.methods.confirmRedemptionIntent(registryContractAddr, uuid,
    redeemerAddr, redeemerNonce, amountUT, redemptionUnlockHeight, redemptionIntentHash).encodeABI();

  return contractInteractHelper.safeSendFromAddr(
    web3ProviderFactory.getProvider('value', 'ws'),
    this.contractAddress,
    encodedABI,
    senderAddress,
    senderPassphrase,
    {gasPrice: VC_GAS_PRICE, gas: VC_GAS_LIMIT}
  );

};

module.exports = ValueRegistrarKlass;