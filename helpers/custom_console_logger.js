'use strict';

/**
 * Custom console logger
 *
 * @module helpers/custom_console_logger
 */

// Get common local storage namespace to read
// request identifiers for debugging and logging
const OSTBase = require('@openstfoundation/openst-base');

const Logger = OSTBase.Logger,
  loggerLevel = process.env.OST_DEBUG_ENABLED == '1' ? Logger.LOG_LEVELS.TRACE : Logger.LOG_LEVELS.INFO;

module.exports = new Logger('openst-platform', loggerLevel);
