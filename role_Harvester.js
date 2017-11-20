/* Harvesters are responsible for the operation of the entire economy. They collect and haul energy and minerals from deposits to storage areas for engineers to use. */

module.exports =
{
    run: function(creep, nodes)
    {
        if (creep.memory.fleeing == false)
        {
            var checksource = [];
            var sources = Game.getObjectById(creep.memory.assignednode["id"]);

            //see if there are any enemies near the source
            checksource[0] = (creep.memory.assignednode["pos"]["y"] - 5);//top
            checksource[1] = (creep.memory.assignednode["pos"]["y"] + 5);//bottom
            checksource[2] = (creep.memory.assignednode["pos"]["x"] - 5);//left
            checksource[3] = (creep.memory.assignednode["pos"]["x"] + 5);//right
            for(var i in checksource)
            {
                if (checksource[i] < 0)
                {
                    checksource[i] = 0;
                }
                if (checksource[i] > 49)
                {
                  checksource[i] = 49;
                }
            }
            var creepsInArea = creep.room.lookForAtArea(LOOK_CREEPS, checksource[0], checksource[2], checksource[1], checksource[3], true);
            for(var thiscreep in creepsInArea)
            {
                var currentcreep = creepsInArea[thiscreep].creep

                if (currentcreep.my == false)
                {
                    creep.say("😥")
                    creep.memory.fleeing = true;
                    break;
                }
            }
            if(creep.carry.energy < creep.carryCapacity)
            {
                if(creep.harvest(sources) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(sources);
                }
            }
            else
            {
                var structures = creep.room.find(FIND_MY_STRUCTURES);

                for(var structure in structures)
                {
                    if(structures[structure].structureType == STRUCTURE_SPAWN)
                    {
                        if(creep.transfer(structures[structure],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(structures[structure]);
                        }
                    }
                    if(structures[structure].structureType == STRUCTURE_STORAGE)
                    {
                        if(creep.transfer(structures[structure],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(structures[structure]);
                        }
                    }
                    if(structures[structure].structureType == STRUCTURE_CONTAINER )
                    {
                        if(creep.transfer(structures[structure],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(structures[structure]);
                        }
                    }
                    //creep.say("😅");

                }
            }
        }
        else if (creep.memory.fleeing == true)
        {
            creep.say("😴")
            creep.moveTo(Game.spawns['Nexus']);
            creep.memory.assignednode = undefined;
            //console.log(creep.name + " is looking for a node to join");
            for(var node in nodes)
            {
                for(var newnode in nodes)
                {
                    if(_.size(nodes[newnode][3]) >= (nodes[newnode][4]))
                    {
                        //console.log("Found a new node(" + nodes[newnode][0] + "), but it's full! (" + _.size(nodes[newnode][3]) + "/" + (nodes[newnode][4]) + ")");
                        continue;
                    }
                    var newchecksource = [];
                    var newsources = Game.getObjectById(nodes[newnode][0]);
                    newchecksource[0] = (nodes[newnode][2] - 5);//top
                    newchecksource[1] = (nodes[newnode][2] + 5);//bottom
                    newchecksource[2] = (nodes[newnode][1] - 5);//left
                    newchecksource[3] = (nodes[newnode][1] + 5);//right
                    for(var j in newchecksource)
                    {
                        if (newchecksource[j] < 0)
                        {
                            newchecksource[j] = 0;
                        }
                        if (newchecksource[j] > 49)
                        {
                            newchecksource[j] = 49;
                        }
                    }
                    var newcreepsInArea = creep.room.lookForAtArea(LOOK_CREEPS, newchecksource[0], newchecksource[2], newchecksource[1], newchecksource[3], true);
                    var newfind_Enemy = false;
                    for(var newthiscreep in newcreepsInArea)
                    {
                        var newcurrentcreep = newcreepsInArea[newthiscreep].creep;
                        if (newcurrentcreep.my == false)
                        {
                            newfind_Enemy = true;
                            break;
                        }
                    }
                    if(newfind_Enemy == true)
                    {
                        //console.log("Found a new node(" + nodes[newnode][0] + "), but there is any enemy nearby!");
                        continue;
                    }
                    var indextodelete = nodes[node][3].indexOf(creep.name);
                    nodes[node][3].splice(indextodelete, 1);

                    //console.log("reassigned to: " + nodes[newnode][0]);

                    nodes[newnode][3].push(creep.name);
                    creep.memory.assignednode = nodes[newnode][0];
                    creep.memory.fleeing = false;
                    break;
                }
                if (creep.memory.fleeing == false)
                {
                    break;
                }
            }
        }
    }
};
