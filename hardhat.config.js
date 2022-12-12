require("@nomicfoundation/hardhat-toolbox");
const path = require('path');
const config = require(path.resolve(__dirname, 'src/export.config.js'));

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = config;
