/* Engineers are responsible for the construction and repair of structures and upgrading of the controller */

module.exports =
{
  run: function(creep)
  {
        if (Game.getObjectById(creep.memory.assignedstructure) == undefined)
        {
            creep.memory.assignedstructure = undefined;
        }
        if (creep.memory.assignedstructure == undefined)
        {
            //Primary - Repair Buildings
            var structuresToRepair = creep.room.find(FIND_MY_STRUCTURES);
            for(var structureToRepair in structuresToRepair)
            {
                if(structuresToRepair[structureToRepair].hits < structuresToRepair[structureToRepair].hitsMax)
                {
                    for(var task in tasks[2])
                    {
                        if(tasks[2][task][1] == undefined)
                        {
                            //tasks[2][task][1].push(creep.id);
                            creep.memory.assignedtask = "repair";
                            creep.memory.assignedstructure = creep.room.getObjectById(structuresToRepair[structureToRepair].id);
                            break;
                        }
                    }
                }
            }
            //Secondary - Construct Structures
            var structuresToBuild = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            for(var structureToBuild in structuresToBuild)
            {
                for(var task in tasks[1])
                {
                    if(tasks[1][task][1] == undefined)
                    {
                        //tasks[1][task][1].push(creep.id);
                        creep.memory.assignedtask = "build";
                        creep.memory.assignedstructure = creep.room.getObjectById(structuresToRepair[structureToRepair].id);
                        break;
                    }
                }
            }
            //Tertiary - Upgrade Structures
            //tasks[0][1].push(creep.id);
            creep.memory.assignedtask = "upgrade";
            creep.memory.assignedstructure = Game.spawns['Nexus'].room.controller.id;
        }
        if (creep.memory.assignedstructure != undefined)
        {
              if (creep.memory.status == 'collecting')
              {
                  if(creep.carry.energy < creep.carryCapacity)
                  {
                      var structures = creep.room.find(FIND_MY_STRUCTURES);
                      for(var structure in structures)
                      {
                          if(structures[structure].structureType == STRUCTURE_STORAGE && structures[structure].energy >= creep.carryCapacity)
                          {
                              if(creep.withdraw(structures[structure],RESOURCE_ENERGY,creep.carry.max) == ERR_NOT_IN_RANGE)
                              {
                                  creep.moveTo(structures[structure]);
                              }
                          }
                          if(structures[structure].structureType == STRUCTURE_CONTAINER && structures[structure].energy >= creep.carryCapacity)
                          {
                              if(creep.withdraw(structures[structure],RESOURCE_ENERGY,creep.carry.max) == ERR_NOT_IN_RANGE)
                              {
                                  creep.moveTo(structures[structure]);
                              }
                          }
                          if(structures[structure].structureType == STRUCTURE_SPAWN && structures[structure].energy > 200)
                          {
                              if(creep.withdraw(structures[structure],RESOURCE_ENERGY,creep.carry.max) == ERR_NOT_IN_RANGE)
                              {
                                  creep.moveTo(structures[structure]);
                              }
                          }
                      }
                  }
                  else if (creep.carry.energy == creep.carryCapacity)
                  {
                      creep.memory.status = 'building'
                  }
              }
              else if (creep.memory.status == 'building')
              {
                  if(creep.carry.energy > 0)
                  {
                      if(creep.memory.assignedtask == 'build')
                      {
                          if(creep.build(Game.getObjectById(creep.memory.assignedstructure["id"])) == ERR_NOT_IN_RANGE)
                          {
                              creep.moveTo(Game.getObjectById(creep.memory.assignedstructure["id"]));
                          }
                      }
                      else if (creep.memory.assignedtask == 'repair')
                      {
                          if(creep.repair(Game.getObjectById(creep.memory.assignedstructure["id"])) == ERR_NOT_IN_RANGE)
                          {
                              creep.moveTo(Game.getObjectById(creep.memory.assignedstructure["id"]));
                          }
                      }
                  }
                  else if (creep.carry.energy == 0)
                  {
                      creep.memory.status = 'collecting'
                  }
              }
        }
    }
};
