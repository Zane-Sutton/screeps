  //Civic Creeps
  var role_Engineer = require('role_Engineer');
  var max_Engineer_Population = 5;
  var role_Enhancer = require('role_Enhancer');
  var max_Enhancer_Population = 10;
  var role_Harvester = require('role_Harvester');
  var max_Harverster_Population = 10;

  //Combat Creeps
  //var role_Brute = require('role_Brute.js'); //Melee
  //var role_Fletcher = require('role_Fletcher.js'); //Ranged
  //var role_Mystic = require('role_Mystic.js'); //Healer
  //var role_Exarch = require('role_Exarch.js'); //Elite

  module.exports.loop = function () {
    var creeps = [];
    var engineers = [];
    var enhancers = [];
    var harvesters = [];

    harvesters = _.filter(Game.creeps, {memory:  {role: 'harvester'}});

    console.log(_.size(harvesters));
    console.log(max_Harverster_Population);

    if(_.size(harvesters) < max_Harverster_Population){
      var prefix = 'harvester-';
      var suffix = (_.size(harvesters) + 1);
      var name = prefix.concat(suffix);
      Game.spawns['Nexus'].spawnCreep( [WORK, CARRY, CARRY, MOVE] , name  , {memory: {role: 'harvester'}});
    }
    else if(_.size(harvesters) < max_Harverster_Population){

    )

    for(var name in Game.creeps) {
          var creep = Game.creeps[name];
          if(creep.memory.role == 'harvester') {
              role_Harvester.run(creep);
          }
          if(creep.memory.role == 'enhancer') {
              role_Enhancer.run(creep);
          }
      }
  }
