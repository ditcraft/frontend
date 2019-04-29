var express = require('express');
var router = express.Router();
var Web3 = require('web3');
var contractAddr = "0x19D29D553296F662bcE6ebBC9c14D53A24C49E7b";  

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:address', function(req, res, next){
  var userAddr = req.params.address;
  web3 = new Web3(new Web3.providers.HttpProvider('https://sokol.poa.network'));
  var abi = [{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_label","type":"string"}],"name":"freeBalanceOfLabel","outputs":[{"name":"freeBalance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_contractAddress","type":"address"}],"name":"addVotingContract","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_labelID","type":"uint256"}],"name":"labelOfAddress","outputs":[{"name":"label","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_label","type":"string"},{"name":"_amount","type":"uint256"}],"name":"lockTokens","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"},{"name":"_label","type":"string"}],"name":"balanceOfLabel","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_label","type":"string"},{"name":"_amount","type":"uint256"}],"name":"mint","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_label","type":"string"}],"name":"totalLabelSupply","outputs":[{"name":"totalSupplyOfLabel","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_label","type":"string"},{"name":"_amount","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_address","type":"address"},{"name":"_label","type":"string"},{"name":"_numberOfTokens","type":"uint256"}],"name":"unlockTokens","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_address","type":"address"}],"name":"labelCountOfAddress","outputs":[{"name":"labelCount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"votingContracts","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"},{"indexed":false,"name":"label","type":"string"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"who","type":"address"},{"indexed":false,"name":"label","type":"string"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}];
  var ditContract = new web3.eth.Contract(abi, contractAddr);

  var obj = {};
  var label = "";
  var balance = "";
  ditContract.methods.labelCountOfAddress(userAddr).call().then(async function(labelCount, error){
      for(var i = 1; i <= parseInt(labelCount); i++){
        await ditContract.methods.labelOfAddress(userAddr, i).call().then(async function(labelString){
          label = labelString;
           await ditContract.methods.balanceOfLabel(userAddr, labelString).call().then(function(labelBalance){
             balance = web3.utils.toBN(labelBalance).toString();
             obj[label] = web3.utils.fromWei(balance, 'ether')
           });
         });
       }
      res.render('address', { address: userAddr, balance: obj, total: sum(obj).toFixed(2) });
  }).catch(e => {
    res.render('error-404');
  });
});

function sum(obj) {
  var sum = 0;
  for(var el in obj) {
    if(obj.hasOwnProperty(el) ) {
      sum += parseFloat(obj[el]);
    }
  }
  return sum;
}

module.exports = router;
