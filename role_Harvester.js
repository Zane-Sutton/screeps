module.exports = {
  run: function(creep, nodes) {
      
        if(creep.carry.energy < creep.carryCapacity) {
            //var sources = creep.room.find(FIND_SOURCES);
            var sources = Game.getObjectById(creep.memory.assignednode["id"]);
            console.log(sources);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources);
            }
        }
        else {
            if(creep.transfer(Game.spawns['Nexus'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Nexus']);
            }
        }
    }
};
