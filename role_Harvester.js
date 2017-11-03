module.exports = {
  run: function(creep, nodes) {

        var safe = true;
        var checksource = [];

        var sources = Game.getObjectById(creep.memory.assignednode["id"]);

        //see if there are any enemies near the source

        checksource[0] = (creep.memory.assignednode["pos"]["y"] + 10);//top
        checksource[1] = (creep.memory.assignednode["pos"]["y"] - 10);//bottom
        checksource[2] = (creep.memory.assignednode["pos"]["x"] + 10);//left
        checksource[3] = (creep.memory.assignednode["pos"]["x"] - 10);//right

        console.log("T:" + checksource[0] + ", B:" + checksource[1] + " ,L:" + checksource[2] + " ,R:" + checksource[3] )
        console.log(creep.room.lookForAtArea(LOOK_CREEPS, checksource[0], checksource[2], checksource[1], checksource[3]))
        /*
        var creepsInArea = creep.room.lookForAtArea(LOOK_CREEPS, checksource[0], checksource[2], checksource[1], checksource[3], true);
        var find_Enemy = false;
        for(creeps in creepsInArea)
        {
            var currentcreep = creepsInArea[creep]
            if currentcreep.my == "false"
            {
                find_Enemy = true;
            }
        }

        //if there is, try reassign the source

        if(find_Enemy == true)
        {

        }

        //else sit next to spawner until safe.

         */
        if(creep.carry.energy < creep.carryCapacity) {
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(sources);
            }
        }
        else {
            if(creep.transfer(Game.spawns['Nexus'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(Game.spawns['Nexus']);
            }
        }
    }
};
