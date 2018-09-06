'use strict';

/**
 * Set Admin Address on OpenSt utility Contract
 *
 * @module tools/setup/openst_utility/set_utility_admin_address
 */

const rootPrefix = '../../..',
  responseHelper = require(rootPrefix + '/lib/formatter/response'),
  logger = require(rootPrefix + '/helpers/custom_console_logger'),
  InstanceComposer = require(rootPrefix + '/instance_composer');

require(rootPrefix + '/config/core_addresses');
require(rootPrefix + '/lib/contract_interact/openst_utility');

/**
 * is equal ignoring case
 *
 * @param {string} compareWith - string to compare with
 *
 * @return {boolean} true when equal
 */
String.prototype.equalsIgnoreCase = function(compareWith) {
  const oThis = this,
    _self = this.toLowerCase(),
    _compareWith = String(compareWith).toLowerCase();

  return _self === _compareWith;
};

/**
 * Constructor for finalize simple token contract
 *
 * @constructor
 */
const SetAdminAddressKlass = function() {
  const oThis = this;
};

SetAdminAddressKlass.prototype = {
  /**
   * Perform
   *
   * @return {promise}
   */
  perform: async function() {
    const oThis = this,
      coreAddresses = oThis.ic().getCoreAddresses(),
      OpenSTUtility = oThis.ic().getOpenSTUtilityInteractClass(),
      openSTUtilityAddr = coreAddresses.getAddressForContract('openSTUtility'),
      utilityDeployerAddr = coreAddresses.getAddressForUser('utilityDeployer'),
      openSTUtility = new OpenSTUtility(openSTUtilityAddr),
      adminAddress = coreAddresses.getAddressForUser('utilityAdmin');

    if (!adminAddress) {
      return Promise.reject('Admin Address to set is missing');
    }

    logger.step('** Setting admin address for openst utilty');
    logger.step('** openSTUtilityAddr: ', openSTUtilityAddr);
    logger.step('** adminAddr would be set to: ', adminAddress);
    logger.step('** adminAddr would be set by : ', utilityDeployerAddr);

    await openSTUtility.setAdminAddress('utilityDeployer', adminAddress, {});

    const openSTUtilityAdminAddressResponse = await openSTUtility.getAdminAddress(),
      openSTUtilityAdminAddress = openSTUtilityAdminAddressResponse.data.address;

    console.log('openSTUtilityAdminAddress', openSTUtilityAdminAddress);

    // check if the admin address is correctly set.
    if (!openSTUtilityAdminAddress || !openSTUtilityAdminAddress.equalsIgnoreCase(adminAddress)) {
      return Promise.reject('Admin Address not correctly set');
    } else {
      logger.step('** successfully verified admin address');
      return Promise.resolve(responseHelper.successWithData({}));
    }
  }
};

InstanceComposer.register(SetAdminAddressKlass, 'getOstUtilityAdminAddrSetter', false);

module.exports = SetAdminAddressKlass;
