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
  var sources = [];
  var nodes = [];


  creeps = _.filter(Game.creeps);
  engineers = _.filter(Game.creeps, {memory:  {role: 'engineer'}});
  enhancers = _.filter(Game.creeps, {memory:  {role: 'enhancer'}});
  harvesters = _.filter(Game.creeps, {memory:  {role: 'harvester'}});
  sources = Game.spawns['Nexus'].room.find(FIND_SOURCES_ACTIVE);

  for(var source in sources) {
      //create a multidimensional array for each source
      nodes[source] = [];
      nodes[source][0] = sources[source]; //id
      nodes[source][1] = sources[source].pos.x; //x position
      nodes[source][2] = sources[source].pos.y; //x position
      nodes[source][3] = 0; //current harvesters
      nodes[source][4] = 0; //max harvesters

      //check surrounding tile blocks of every source
      var terrain = [];
      terrain[0] = Game.map.getTerrainAt(nodes[source][1],(nodes[source][2]+1),Game.spawns['Nexus'].room.name); //n
      terrain[1] = Game.map.getTerrainAt(nodes[source][1],(nodes[source][2]-1),Game.spawns['Nexus'].room.name); //s
      terrain[2] = Game.map.getTerrainAt(nodes[source][1]+1,(nodes[source][2]),Game.spawns['Nexus'].room.name); //e
      terrain[3] = Game.map.getTerrainAt(nodes[source][1]-1,(nodes[source][2]),Game.spawns['Nexus'].room.name); //w
      terrain[4] = Game.map.getTerrainAt(nodes[source][1]+1,(nodes[source][2]+1),Game.spawns['Nexus'].room.name); //ne
      terrain[5] = Game.map.getTerrainAt(nodes[source][1]+1,(nodes[source][2]-1),Game.spawns['Nexus'].room.name); //se
      terrain[6] = Game.map.getTerrainAt(nodes[source][1]-1,(nodes[source][2]+1),Game.spawns['Nexus'].room.name); //nw
      terrain[7] = Game.map.getTerrainAt(nodes[source][1]-1,(nodes[source][2]-1),Game.spawns['Nexus'].room.name); //sw

      //allocate the amount of slots to a source based on the tiles without a wall
      for(var tile in terrain) {
        if(terrain[tile]!="wall")
        {
            nodes[source][4]++;
        }
      }
  }

  //Keep making more harvesters as a priority until the defined max
  if(_.size(harvesters) < max_Harverster_Population){
    var prefix = 'harvester-';
    var suffix = (_.size(harvesters) + 1);
    var name = prefix.concat(suffix);
    Game.spawns['Nexus'].spawnCreep( [WORK, CARRY, MOVE, MOVE] , name  , {memory: {role: 'harvester'}});
  }
  else if(_.size(harvesters) == max_Harverster_Population){
    //when reached max, make enhancers
    if(_.size(enhancers) < max_Enhancer_Population){
      var prefix = 'enhancer-';
      var suffix = (_.size(enhancers) + 1);
      var name = prefix.concat(suffix);
      Game.spawns['Nexus'].spawnCreep( [WORK, CARRY, MOVE, MOVE] , name  , {memory: {role: 'enhancer'}});
    }
  }

  //run ai scripts
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
