  //Civic Creeps
var role_Engineer = require('role_Engineer');
var role_Harvester = require('role_Harvester');
//Combat Creeps
var role_Myrmidon = require('role_Myrmidon'); //Melee
var role_Toxotes = require('role_Toxotes'); //Ranged
var role_Hoplite = require('role_Hoplite'); //Elite Melee
var role_Nymph = require('role_Nymph'); //Healer
var role_Sovereign = require('role_Sovereign'); //Squad Leader
//Population Controls
var MAX_ENGINEER_POPULATON = 3;
var MAX_HARVESTER_POPULATION = 0;

const MINIMUM_UPGRADER_THRESHOLD = 1;
const OPTIMAL_BUILDER_THRESHOLD_FRACTION = 0.5;
const OPTIMAL_REPAIRER_THRESHOLD_FRACTION = 0.5;
const OPTIMAL_UPGRADER_THRESHOLD_FRACTION = math.round(OPTIMAL_BUILDER_THRESHOLD_FRACTION + OPTIMAL_REPAIRER_THRESHOLD_FRACTION)/2;

//Set up node tracker array
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
            MAX_HARVESTER_POPULATION++;
        }
    }
    nodes[source][4] += Math.floor(Game.spawns["Nexus"].pos.getRangeTo(nodes[source][1], nodes[source][2])/10);
    MAX_HARVESTER_POPULATION += Math.floor(Game.spawns["Nexus"].pos.getRangeTo(nodes[source][1], nodes[source][2])/10);
}
//Set up task tracker array
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
            if(Game.getObjectById(creep.memory.assignedstructure["id"]) == tasks[0][0])
            {
                tasks[0][1].push(creep.name);
            }
        }
    }
}
var StructuresToBuild = Game.spawns['Nexus'].room.find(FIND_MY_CONSTRUCTION_SITES); //repair
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
                if(Game.getObjectById(creep.memory.assignedstructure["id"]) == tasks[1][task].id)
                {
                    tasks[1][task][1].push(creep.id);
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
                if(Game.getObjectById(creep.memory.assignedstructure["id"]) == tasks[2][task].id)
                {
                    tasks[2][task][1].push(creep.id);
                }
            }
        }
    }
}
for(var task in tasks[0])
{
    for(var name in Game.creeps)
    {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'engineer')
        {
            if(creep.memory.assignedstructure != undefined)
            {
                if(Game.getObjectById(creep.memory.assignedstructure["id"]) == tasks[0][0])
                {
                    tasks[0][1];
                }
            }
        }
    }
}
//set up squad tracker array
var squads = [];
for(var name in Game.creeps)
{
    var creep = Game.creeps[name];
    if(creep.memory.role == 'combat')
    {
        if(creep.memory.assignedsquad != undefined)
        {
            squads[creep.memory.assignedsquad] = [];
            squads[creep.memory.assignedsquad][0] = [];
            squads[creep.memory.assignedsquad][1] = [];
            squads[creep.memory.assignedsquad][2] = [];
            squads[creep.memory.assignedsquad][3] = [];
        }
    }
}
for(var name in Game.creeps)
{
    var creep = Game.creeps[name];

    if(creep.memory.role == 'combat')
    {
        var body = creep.body;
        var strength = 0;

        for(var part in body)
        {
            if(body[part][type] == MOVE)
            {
                strength += 10
            }
            if(body[part][type] == ATTACK)
            {
                strength += 20
            }
            if(body[part][type] == RANGED_ATTACK)
            {
                strength += 30
            }
            if(body[part][type] == HEAL)
            {
                strength += 30
            }
            if(body[part][type] == TOUGH)
            {
                strength += 10
            }
            strength += (body[part][hits] / 10)
        }


        if(creep.memory.assignedsquad != undefined)
        {
            if(creep.memory.combatrole == 'myrmidon')
            {
                squads[creep.memory.assignedsquad][0][0].push(creep.name);
                squads[creep.memory.assignedsquad][0][1] += strength;
            }
            else if(creep.memory.combatrole == 'toxotes')
            {
                squads[creep.memory.assignedsquad][1][0].push(creep.name);
                squads[creep.memory.assignedsquad][1][1] += strength;
            }
            else if(creep.memory.combatrole == 'hoplite')
            {
                squads[creep.memory.assignedsquad][2][0].push(creep.name);
                squads[creep.memory.assignedsquad][2][1] += strength;
            }
            else if(creep.memory.combatrole == 'sovereign')
            {
                squads[creep.memory.assignedsquad][3][0].push(creep.name);
                squads[creep.memory.assignedsquad][3][1] += strength;
            }
            else if(creep.memory.combatrole == 'nymph')
            {
                squads[creep.memory.assignedsquad][4][0].push(creep.name);
                squads[creep.memory.assignedsquad][4][1] += strength;
            }
        }
    }
}
//main loop
module.exports.loop = function ()
{
    for(var i in Memory.creeps)
    {
        if(!Game.creeps[i])
        {
            delete Memory.creeps[i];
        }
    }
    var creeps = [];
    var engineers = [];
    var harvesters = [];
    creeps = _.filter(Game.creeps);
    engineers = _.filter(Game.creeps, {memory:  {role: 'engineer'}});
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
            Game.spawns['Nexus'].spawnCreep( [WORK, CARRY, MOVE, MOVE] , name  , {memory: {role: 'engineer', status: 'collecting', assignedstructure: undefined, assignedtask: undefined, tasklist: tasks}});
        }
        //else if(_.size(engineers) >= MAX_ENGINEER_POPULATON)
        //{
        //
        //}
    }

    for(var name in Game.creeps)
    {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester')
        {
            role_Harvester.run(creep, nodes);
        }
        if(creep.memory.role == 'engineer')
        {
            role_Engineer.run(creep);
        }
        if(creep.memory.role == 'combat')
        {
            if(creep.memory.combatrole == 'myrmidon')
            {
                role_Myrmidon.run(creep);
            }
            if(creep.memory.combatrole == 'toxotes')
            {
                role_Toxotes.run(creep);
            }
            if(creep.memory.combatrole == 'hoplite')
            {
                role_Hoplite.run(creep);
            }
            if(creep.memory.combatrole == 'sovereign')
            {
                role_Sovereign.run(creep);
            }
            if(creep.memory.combatrole == 'nymph')
            {
                role_Nymph.run(creep);
            }
        }
    }

    //console.log(MAX_HARVESTER_POPULATION);
    //console.log("Nodes: " + nodes);
    console.log("Upgrade: " + tasks[0]);
    console.log("Build: " + tasks[1]);
    console.log("Repair: " + tasks[2]);
}
