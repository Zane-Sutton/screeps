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
            var found = false;
            //Primary - Repair Buildings
            /*var structuresToRepair = creep.room.find(FIND_MY_STRUCTURES);
            for(var structureToRepair in structuresToRepair)
            {
                if(structuresToRepair[structureToRepair].hits < structuresToRepair[structureToRepair].hitsMax)
                {
                    found = true;
                    creep.memory.assignedstructure = creep.room.getObjectById(structuresToRepair[structureToRepair].id);
                    break;
                }
            }*/
            //Secondary - Construct Structures
            if(found == false)
            {
                creep.memory.assignedstructure = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
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
