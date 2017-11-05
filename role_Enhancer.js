module.exports =
{
    run: function(creep)
    {
        if (creep.memory.status == 'collecting')
        {
            if(creep.carry.energy < creep.carryCapacity)
            {
                var structures = creep.room.find(FIND_MY_STRUCTURES);
                //console.log(structures);

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
                creep.memory.status = 'upgrading';
            }
        }

        else if (creep.memory.status == 'upgrading')
        {
            if(creep.carry.energy > 0)
            {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.room.controller);
                }
            }
            else if (creep.carry.energy == 0)
            {
                creep.memory.status = 'collecting'
            }
        }
    }
};
