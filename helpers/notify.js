'use strict';

const getNamespace = require('continuation-local-storage').getNamespace,
  requestNamespace = getNamespace('openST-Platform-NameSpace');

const rootPrefix = '..',
  logger = require(rootPrefix + '/helpers/custom_console_logger'),
  packageFile = require(rootPrefix + '/package.json'),
  InstanceComposer = require(rootPrefix + '/instance_composer');

require(rootPrefix + '/lib/web3/providers/notification');

const NotifierKlass = function() {};

NotifierKlass.prototype = {
  /**
   * Method to convert Process hrTime to Milliseconds
   *
   * @param {number} hrTime - this is the time in hours
   *
   * @return {number} - returns time in milli seconds
   */
  timeInMilli: function(hrTime) {
    return hrTime[0] * 1000 + hrTime[1] / 1000000;
  },

  /**
   * Method to append Request in each log line.
   *
   * @param {string} message
   */
  appendRequest: function(message) {
    let newMessage = '';
    if (requestNamespace) {
      if (requestNamespace.get('reqId')) {
        newMessage += '[' + requestNamespace.get('reqId') + ']';
      }
      if (requestNamespace.get('workerId')) {
        newMessage += '[Worker - ' + requestNamespace.get('workerId') + ']';
      }
      const hrTime = process.hrtime();
      newMessage += '[' + timeInMilli(hrTime) + ']';
    }
    newMessage += message;
    return newMessage;
  },

  notify: async function(code, msg, data, backtrace) {
    const oThis = this,
      packageName = packageFile.name;

    logger.info(code, msg, data, backtrace);
    const notificationProvider = oThis.ic().getNotificationProvider(),
      openStNotification = notificationProvider.getInstance();

    let bodyData = null;

    try {
      bodyData = JSON.stringify(data);
    } catch (err) {
      bodyData = data;
    }

    openStNotification.publishEvent
      .perform({
        topics: ['email_error.' + packageName],
        publisher: 'OST',
        message: {
          kind: 'email',
          payload: {
            subject: packageName + ' ::' + code,
            body: ' Message: ' + msg + ' \n\n Data: ' + bodyData + ' \n\n backtrace: ' + backtrace
          }
        }
      })
      .catch(function(err) {
        logger.error('Message for queue email_error was not published Error: ', err);
      });
  }
};

InstanceComposer.register(NotifierKlass, 'getNotifierKlass', true);

module.exports = NotifierKlass;
