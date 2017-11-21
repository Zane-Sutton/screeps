  //Civic Creeps
var role_Engineer = require('role_Engineer');
var role_Harvester = require('role_Harvester');
var role_Settler = require('role_Settler');
//Combat Creeps
var role_Myrmidon = require('role_Myrmidon'); //Melee
var role_Toxotes = require('role_Toxotes'); //Ranged
var role_Hoplite = require('role_Hoplite'); //Elite Melee
var role_Helepolis = require('role_Helepolis'); //Elite Melee
var role_Nymph = require('role_Nymph'); //Healer
var role_Sovereign = require('role_Sovereign'); //Squad Leader
//Population Controls
var MAX_ENGINEER_POPULATON = 3;
var MAX_HARVESTER_POPULATION = 0;

const MINIMUM_UPGRADER_THRESHOLD = 1;
const OPTIMAL_BUILDER_THRESHOLD_FRACTION = 0.5;
const OPTIMAL_REPAIRER_THRESHOLD_FRACTION = 0.5;
const OPTIMAL_UPGRADER_THRESHOLD_FRACTION = math.round(OPTIMAL_BUILDER_THRESHOLD_FRACTION + OPTIMAL_REPAIRER_THRESHOLD_FRACTION)/2;

const ENGINEER_MOVE_PART_FRACTION = 0.34;
const ENGINERR_CARRY_PART_FRACTION = 0.33;
const ENGINEER_WORK_PART_FRACTION = 0.33;
const ENGINEER_MAX_PART_COUNT = 50;

const HARVESTER_MOVE_PART_FRACTION = 0.34;
const HARVESTER_CARRY_PART_FRACTION = 0.33;
const HARVESTER_WORK_PART_FRACTION = 0.33;
const HARVESTER_MAX_PART_COUNT = 50;

const SETTLER_MOVE_PART_FRACTION = 0.5;
const SETTLER_CLAIM_PART_FRACTION = 0.5;
const SETTLER_MAX_PART_COUNT = 50;

//squads are comprised of a range of basic units lead by a sovereign and complemented by up to a certain number of healers (nymphs). These numbers differ from unit to unit.

const MINIMUM_SOVEREIGN_COUNT = 1;
const MAXIMUM_SOVEREIGN_COUNT = 1;

const MINIMUM_MYRMIDON_SQUAD_SIZE = 5; //Must reach at least this size before squad becomes operational
const MAXIMUM_MYRMIDON_SQUAD_SIZE = 25; //Size of squad can reach a maximum of this size with new recruits
const OPTIMAL_MYRMIDON_NYMPH_COUNT = 5; //continully accept nymphs into the squad until it is at this number

const MINIMUM_TOXOTES_SQUAD_SIZE = 5;
const MAXIMUM_TOXOTES_SQUAD_SIZE = 20;
const OPTIMAL_TOXOTES_NYMPH_COUNT = 4;

const MINIMUM_HOPLITE_SQUAD_SIZE = 5;
const MAXIMUM_HOPLITE_SQUAD_SIZE = 20;
const OPTIMAL_HOPLITE_NYMPH_COUNT = 5;

const MINIMUM_HELEPOLIS_SQUAD_SIZE = 5;
const MAXIMUM_HELEPOLIS_SQUAD_SIZE = 15;
const OPTIMAL_HELEPOLIS_NYMPH_COUNT = 3;

const SOVEREIGN_MOVE_PART_FRACTION = 0.5;
const SOVEREIGN_TOUGH_PART_FRACTION = 0.5;
const SOVEREIGN_MAX_PART_COUNT = 50;

const NYMPH_MOVE_PART_FRACTION = 0.4;
const NYMPH_TOUGH_PART_FRACTION = 0.2;
const NYMPH_HEAL_PART_FRACTION = 0.4;
const NYMPH_MAX_PART_COUNT = 50;

const MYRMIDON_MOVE_PART_FRACTION = 0.5;
const MYRMIDON_TOUGH_PART_FRACTION = 0.2;
const MYRMIDON_ATTACK_PART_FRACTION = 0.3;
const MYRMIDON_MAX_PART_COUNT = 50;

const TOXOTES_MOVE_PART_FRACTION = 0.5;
const TOXOTES_TOUGH_PART_FRACTION = 0.15;
const TOXOTES_RANGED_ATTACK_PART_FRACTION = 0.35;
const TOXOTES_MAX_PART_COUNT = 50;

const HOPLITE_MOVE_PART_FRACTION = 0.25;
const HOPLITE_TOUGH_PART_FRACTION = 0.4;
const HOPLITE_ATTACK_PART_FRACTION = 0.35;
const HOPLITE_MAX_PART_COUNT = 50;

const HELEPOLIS_MOVE_PART_FRACTION = 0.2;
const HELEPOLIS_TOUGH_PART_FRACTION = 0.3;
const HELEPOLIS_RANGED_ATTACK_PART_FRACTION = 0.5;
const HELEPOLIS_MAX_PART_COUNT = 50;

//Required tech level of units. tech level is the current measurement of technological and economic progress of the base in the current room.
// 0 = Dormant (Basic resource collection and construction)
// 1 = Awakened (Boom Economy)
// 2 = Activated (building intermediate strucutures and construct rudimentary defense forces)
// 3 = Engaged (Focus on upgrading controller and Build extensive fortification)
// 4 = Restored
// 5 = Enhanced
// 6 = Empowered (Build invasion forces and settlers, build advanced structures, mine advanced resources)
// 7 = Enlightened (Attack and conquer nearby rooms)
// 8 = Transcended (Obtain power units)

const ENGINEER_TECH_LEVEL = 0;
const HARVESTER_TECH_LEVEL = 0;
const SOVEREIGN_TECH_LEVEL = 2;
const MYRMIDON_TECH_LEVEL = 2;
const TOXOTES_TECH_LEVEL = 2;
const NYMPH_TECH_LEVEL = 5;
const HOPLITE_TECH_LEVEL = 5;
const HELEPOLIS_TECH_LEVEL = 5;
const SETTLER_TECH_LEVEL = 6;

const STRCUTURE_ROAD_TECH_LEVEL = 1;
const STRUCTURE_CONTAINER_TECH_LEVEL = 2;
const STRUCTURE_EXTENSION_TECH_LEVEL = 2;
const STRUCTURE_WALL_TECH_LEVEL = 3;
const STRUCTURE_RAMPART_TECH_LEVEL = 3;
const STRUCTURE_TOWER_TECH_LEVEL = 3;
const STRUCTURE_STORAGE_TECH_LEVEL = 4;
const STRUCTURE_LINK_TECH_LEVEL = 5;
const STRUCTURE_EXTRACTOR_TECH_LEVEL = 6;
const STRUCTURE_LAB_TECH_LEVEL = 6;
const STRUCTURE_TERMINAL_TECH_LEVEL = 6;
const STRUCTURE_SPAWN_TECH_LEVEL = 7;
const STRUCTURE_OBSERVER_TECH_LEVEL = 8;
const STRUCTURE_POWER_SPAWN_TECH_LEVEL = 8;
const STRUCTURE_NUKER_TECH_LEVEL = 8;

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
            else if(creep.memory.combatrole == 'helepolis')
            {
                squads[creep.memory.assignedsquad][3][0].push(creep.name);
                squads[creep.memory.assignedsquad][3][1] += strength;
            }
            else if(creep.memory.combatrole == 'sovereign')
            {
                squads[creep.memory.assignedsquad][4][0].push(creep.name);
                squads[creep.memory.assignedsquad][4][1] += strength;
            }
            else if(creep.memory.combatrole == 'nymph')
            {
                squads[creep.memory.assignedsquad][5][0].push(creep.name);
                squads[creep.memory.assignedsquad][5][1] += strength;
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
        if(creep.memory.role == 'settler')
        {
            role_Settler.run(creep);
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
            if(creep.memory.combatrole == 'helepolis')
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
