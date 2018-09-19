'use strict';
/**
 * Dynamo DB create shards
 *
 * Utility chain specific creation of shards
 *
 * @module tools/setup/dynamo_db_create_shards
 */

const rootPrefix = '../..',
  InstanceComposer = require(rootPrefix + '/instance_composer'),
  setupHelper = require(rootPrefix + '/tools/setup/helper'),
  logger = require(rootPrefix + '/helpers/custom_console_logger');

require(rootPrefix + '/lib/web3/providers/storage');

/**
 * Dynamo db create and register shards
 *
 * @constructor
 */
const DynamoDBRegisterShards = function(configStrategy, instanceComposer) {};

DynamoDBRegisterShards.prototype = {
  perform: async function() {
    const oThis = this,
      openSTStorageProvider = oThis.ic().getStorageProvider(),
      openSTStorage = openSTStorageProvider.getInstance();

    let shardName = 'tokenBalancesShard_' + setupHelper.chainIdFor('utilty');

    // createAndRegisterShard
    logger.info('* Creating shard for token balance model.');
    await new openSTStorage.model.TokenBalance({shard_name: shardName}).createShard();
  }
};

InstanceComposer.register(DynamoDBRegisterShards, 'getSetupDynamoDBCreateShards', false);

module.exports = DynamoDBRegisterShards;
