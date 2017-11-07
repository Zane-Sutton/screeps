module.exports = {
  run: function(creep) {



        /*var priority = []
        priority[0] = "Spawn";
        priority[1] = "Terminal";
        priority[2] = "Spawn";
        priority[3] = "Spawn";
        priority[4] = "Spawn";
        priority[5] = "Spawn";
        priority[6] = "Spawn";
        priority[7] = "Spawn";
        priority[8] = "Spawn";
        priority[9] = "Spawn";
        priority[10] = "Spawn";
        priority[11] = "Spawn";
        priority[12] = "Spawn";
        priority[13] = "Spawn";
        priority[14] = "Spawn";*/

        //console.log(creep.name + " is now assigned to build " + creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES));

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
                            tasks[2][task][1].push(creep.id);
                            creep.memory.assignedfunction = "repair";
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
                        tasks[1][task][1].push(creep.id);
                        creep.memory.assignedfunction = "build";
                        creep.memory.assignedstructure = creep.room.getObjectById(structuresToBuild[structureToBuild].id);
                        break;
                    }
                }
            }

            var structuresToUpgrade = creep.room.controller;
            for(var structureToUpgrade in structuresToUpgrade)
            {
                for(var task in tasks[0)
                {
                    if(tasks[1][task][1] == undefined)
                    {
                        tasks[1][task][1].push(creep.id);
                        creep.memory.assignedfunction = "upgrade";
                        creep.memory.assignedstructure = creep.room.getObjectById(structuresToUpgrade[structureToUpgrade].id);
                        break;
                    }
                }
            }


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
                      if(creep.build(Game.getObjectById(creep.memory.assignedstructure["id"])) == ERR_NOT_IN_RANGE)
                      {
                          creep.moveTo(Game.getObjectById(creep.memory.assignedstructure["id"]));
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
