var web3 = require('@project-serum/anchor')
var splToken = require('@solana/spl-token')
var bs58 = require('bs58')
var buffer = require('buffer')

global.window.web3 = web3;
global.window.splToken = splToken;
global.window.bs58 = bs58;
global.window.buffer = buffer;
