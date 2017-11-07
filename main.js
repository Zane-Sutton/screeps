  //Civic Creeps
var role_Engineer = require('role_Engineer');
var role_Enhancer = require('role_Enhancer');
var role_Harvester = require('role_Harvester');

//Combat Creeps
var role_Vidar = require('role_Vidar'); //Melee
var role_Artemis = require('role_Artemis'); //Ranged
var role_Mystic = require('role_Mystic'); //Healer
var role_Exarch = require('role_Exarch'); //Elite

const MAX_ENGINEER_POPULATON = 3;
const MAX_ENHANCER_POPULATION = 0;
const MAX_HARVESTER_POPULATION = 10;

const MIN_UPGRADERS = 1;
const MAX_UPGRADERS = 3;
const MIN_BUILDERS = 2;
const MAX_BUILDERS = 3;
const MIN_REPAIRERS = 1;
const MAX_REPAIRERS = 3;

var sources = [];
var nodes = [];

var analysesources = Game.spawns['Nexus'].room.find(FIND_SOURCES);
sources = _.sortBy(analysesources, s => Game.spawns['Nexus'].pos.getRangeTo(s));

for(var source in sources)
{
    nodes[source] = [];
    nodes[source][0] = sources[source]; //id
    nodes[source][1] = sources[source].pos.x; //x position
    nodes[source][2] = sources[source].pos.y; //x position
    nodes[source][3] = []; //assigned harvesters
    nodes[source][4] = 0; //max harvesters

    for(var name in Game.creeps)
    {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester')
        {
            if(creep.memory.assignednode !== undefined)
            {
                //console.log(creep.memory.assignednode)
                if(Game.getObjectById(creep.memory.assignednode["id"]) == nodes[source][0] )
                {
                    nodes[source][3].push(creep.name);
                }
            }
        }
    }

    var terrain = [];
    terrain[0] = Game.map.getTerrainAt(nodes[source][1],(nodes[source][2]+1),Game.spawns['Nexus'].room.name); //n
    terrain[1] = Game.map.getTerrainAt(nodes[source][1],(nodes[source][2]-1),Game.spawns['Nexus'].room.name); //s
    terrain[2] = Game.map.getTerrainAt(nodes[source][1]+1,(nodes[source][2]),Game.spawns['Nexus'].room.name); //e
    terrain[3] = Game.map.getTerrainAt(nodes[source][1]-1,(nodes[source][2]),Game.spawns['Nexus'].room.name); //w
    terrain[4] = Game.map.getTerrainAt(nodes[source][1]+1,(nodes[source][2]+1),Game.spawns['Nexus'].room.name); //ne
    terrain[5] = Game.map.getTerrainAt(nodes[source][1]+1,(nodes[source][2]-1),Game.spawns['Nexus'].room.name); //se
    terrain[6] = Game.map.getTerrainAt(nodes[source][1]-1,(nodes[source][2]+1),Game.spawns['Nexus'].room.name); //nw
    terrain[7] = Game.map.getTerrainAt(nodes[source][1]-1,(nodes[source][2]-1),Game.spawns['Nexus'].room.name); //sw

    for(var tile in terrain)
    {
        if(terrain[tile]!="wall")
        {
            nodes[source][4]++;
        }
    }

    nodes[source][4] += Math.floor(Game.spawns["Nexus"].pos.getRangeTo(nodes[source][1], nodes[source][2])/10);

}

var tasks = [];

tasks[0] = []; //upgrade controller
tasks[0][0] = Game.spawns['Nexus'].room.controller.id; //id of controller
tasks[0][1] = []; //assigned upgraders
tasks[1] = [];
tasks[2] = [];

for(var name in Game.creeps)
{
    var creep = Game.creeps[name];
    if(creep.memory.role == 'engineer')
    {
        if(creep.memory.assignedstructure != undefined)
        {
            //console.log(creep.memory.assignednode)
            if(Game.getObjectById(creep.memory.assignedstructure["id"]) == tasks[0][0])
            {
                tasks[0][1].push(creep.name);
            }
        }
    }
}

var StructuresToBuild = Game.spawns['Nexus'].room.find(FIND_MY_CONSTRUCTION_SITES); //build
for (var structure in StructuresToBuild)
{
    tasks[1].push(StructuresToBuild[structure]["id"]);
}

for(var task in tasks[1])
{
    var temp = tasks[1][task];
    tasks[1][task] = [];
    tasks[1][task][0] = temp;
    tasks[1][task][1] = undefined;

}

for(var task in tasks[1])
{
    for(var name in Game.creeps)
    {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'engineer')
        {
            if(creep.memory.assignedstructure != undefined)
            {
                //console.log(creep.memory.assignedstructure)
                if(Game.getObjectById(creep.memory.assignedstructure["id"]) == tasks[1][task].id)
                {
                    //tasks[1][task].push(creep.name);
                }
            }
        }
    }
}

var StructuresToRepair = Game.spawns['Nexus'].room.find(FIND_MY_STRUCTURES); //repair
for (var structure in StructuresToRepair)
{
    if (StructuresToRepair[structure].hits < StructuresToRepair[structure].hitsMax)
    {
        tasks[2].push(StructuresToRepair[structure]["id"]);
    }
}


for(var task in tasks[2])
{
    for(var name in Game.creeps)
    {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'engineer')
        {
            if(creep.memory.assignedstructure != undefined)
            {
                //console.log(creep.memory.assignedstructure)
                if(Game.getObjectById(creep.memory.assignedstructure["id"]) == tasks[2][task].id)
                {
                    //tasks[2][task].push(creep.name);
                }
            }
        }
    }
}



module.exports.loop = function () {

  for(var i in Memory.creeps)
  {
      if(!Game.creeps[i])
      {
          delete Memory.creeps[i];
      }
  }


  var creeps = [];
  var engineers = [];
  var enhancers = [];
  var harvesters = [];



  creeps = _.filter(Game.creeps);
  engineers = _.filter(Game.creeps, {memory:  {role: 'engineer'}});
  enhancers = _.filter(Game.creeps, {memory:  {role: 'enhancer'}});
  harvesters = _.filter(Game.creeps, {memory:  {role: 'harvester'}});



  var fleeingcreeps = false;

  for(var j in Game.creeps)
  {
      if(Game.creeps[j].memory.fleeing == true)
      {
          fleeingcreeps = true;
          break;
      }
  }
  //console.log(fleeingcreeps);


  if((_.size(harvesters) < MAX_HARVESTER_POPULATION) && (fleeingcreeps == false))
  {
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

      Game.spawns['Nexus'].spawnCreep( [WORK, CARRY, MOVE, MOVE] , name  , {memory: {role: 'harvester', assignednode: undefined, fleeing: true}})

  }
  else if(_.size(harvesters) >= MAX_HARVESTER_POPULATION || fleeingcreeps == true)
  {
      if(_.size(enhancers) < MAX_ENHANCER_POPULATION)
      {
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
          Game.spawns['Nexus'].spawnCreep( [WORK, CARRY, MOVE, MOVE] , name  , {memory: {role: 'enhancer', status: 'collecting'}});
      }
      else if(_.size(enhancers) >= MAX_ENHANCER_POPULATION)
      {
          if(_.size(engineers) < MAX_ENGINEER_POPULATON)
          {
              var prefix = 'engineer-';
              var suffix = (_.size(engineers) + 1);
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
              Game.spawns['Nexus'].spawnCreep( [WORK, CARRY, MOVE, MOVE] , name  , {memory: {role: 'engineer', status: 'collecting', assignedstructure: undefined, assignedfunction: undefined, tasklist: tasks}});
          }
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
        if(creep.memory.role == 'engineer') {
            role_Engineer.run(creep);
        }
    }


    //console.log("Nodes: " + nodes);
    console.log("Upgrade: " + tasks[0]);
    console.log("Build: " + tasks[1]);
    console.log("Repair: " + tasks[2]);

}
