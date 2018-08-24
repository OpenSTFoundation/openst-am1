"use strict";

const path = require('path')
    , fs = require('fs')
;

function parseFile(filePath, options) {
 filePath = path.join(__dirname, '/' + filePath);
 const fileContent = fs.readFileSync(filePath, options || 'utf8');
 return JSON.parse(fileContent);
}

const InstanceComposer     = require('../../instance_composer');
const generator            = require('../../lib/contract_interacts/generator');
const coreJsonInterface    = parseFile('../../contracts/abi/Core.abi', 'utf8');

const Core = function (originAddress, originOptions, auxilaryConfig, auxilaryAddress,  auxilaryOptions ) {
  
  const oThis = this
      , originWeb3      = new oThis.ic().OriginWeb3()
      , auxilaryWeb3    = new oThis.ic().AuxiliaryWeb3( auxilaryConfig.provider )
      , originCore   = new originWeb3.eth.Contract(coreJsonInterface, originAddress, originOptions || {})
      , auxilaryCore = new auxilaryWeb3.eth.Contract(coreJsonInterface, auxilaryAddress, auxilaryOptions || {})
  ;

  oThis._getOriginContract = function () {
    return originCore;
  };
  oThis._getAuxiliaryContract = function () {
    return auxilaryCore;
  };
};
const proto = Core.prototype = {
  constructor: Core
  , _getOriginContract: null
  , _getAuxiliaryContract: null
};

let originContractAbi = coreJsonInterface;
let originContractGetter = "_getOriginContract";
let auxiliaryContractAbi = coreJsonInterface;
let auxiliaryContractGetter = "_getAuxiliaryContract";
generator( proto, originContractAbi, originContractGetter, auxiliaryContractAbi, auxiliaryContractGetter );


InstanceComposer.registerShadowableClass(Core, 'Core');

module.exports = Core;