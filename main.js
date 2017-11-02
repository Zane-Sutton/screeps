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
      nodes[source] = [];
      nodes[source][0] = sources[source]; //id
      nodes[source][1] = sources[source].pos.x; //x position
      nodes[source][2] = sources[source].pos.y; //x position
      nodes[source][3] = []; //assigned harvesters
      nodes[source][4] = 0; //max harvesters

      var terrain = [];
      terrain[0] = Game.map.getTerrainAt(nodes[source][1],(nodes[source][2]+1),Game.spawns['Nexus'].room.name); //n
      terrain[1] = Game.map.getTerrainAt(nodes[source][1],(nodes[source][2]-1),Game.spawns['Nexus'].room.name); //s
      terrain[2] = Game.map.getTerrainAt(nodes[source][1]+1,(nodes[source][2]),Game.spawns['Nexus'].room.name); //e
      terrain[3] = Game.map.getTerrainAt(nodes[source][1]-1,(nodes[source][2]),Game.spawns['Nexus'].room.name); //w
      terrain[4] = Game.map.getTerrainAt(nodes[source][1]+1,(nodes[source][2]+1),Game.spawns['Nexus'].room.name); //ne
      terrain[5] = Game.map.getTerrainAt(nodes[source][1]+1,(nodes[source][2]-1),Game.spawns['Nexus'].room.name); //se
      terrain[6] = Game.map.getTerrainAt(nodes[source][1]-1,(nodes[source][2]+1),Game.spawns['Nexus'].room.name); //nw
      terrain[7] = Game.map.getTerrainAt(nodes[source][1]-1,(nodes[source][2]-1),Game.spawns['Nexus'].room.name); //sw

      for(var tile in terrain) {
        if(terrain[tile]!="wall")
        {
            nodes[source][4]++;
        }
      }

      //console.log(nodes[source]);
  }

  for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
  }



  if(_.size(harvesters) < max_Harverster_Population){
    var prefix = 'harvester-';
    var suffix = 0;
    var name;

    while(true)
    {
        name = prefix.concat(suffix);
        if (Game.creeps[name] != undefined)
        {
            suffix += 1;
            continue;
        }
        else
        {
            break;
        }
    }

    var creationassignednode;


    for(var i in nodes)
    {
        console.log(_.size(nodes[i][3]) + "|" + nodes[i][4]);
        if(_.size(nodes[i][3]) < nodes[i][4])
        {
            creationassignednode = nodes[i][0];
            nodes[i][3].push(name);
            break;
        }
    }

    console.log("Creation assigned node:" + creationassignednode);



    Game.spawns['Nexus'].spawnCreep( [WORK, CARRY, MOVE, MOVE] , name  , {memory: {role: 'harvester', assignednode: creationassignednode}});


  }
  else if(_.size(harvesters) == max_Harverster_Population){
    if(_.size(enhancers) < max_Enhancer_Population){
      var prefix = 'enhancer-';
      var suffix = (_.size(enhancers) + 1);
      var name;
    while(true)
    {
        name = prefix.concat(suffix);
        if (Game.creeps[name] != undefined)
        {
            suffix += 1;
            continue;
        }
        else
        {
            break;
        }
    }




      Game.spawns['Nexus'].spawnCreep( [WORK, CARRY, MOVE, MOVE] , name  , {memory: {role: 'enhancer'}});
    }
  }





  for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            role_Harvester.run(creep, nodes);
        }
        if(creep.memory.role == 'enhancer') {
            role_Enhancer.run(creep);
        }
    }

    console.log(nodes);

}
