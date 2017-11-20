/* Sovereigns act as leader units. They will attempt to form a squad when there is nearby unassigned combat units. When a sovereign dies, its followers will continue fighting untill victory or death,
until which it will await around for a new sovereign to take command. Sovereigns tend to be primarly non-combat units, taking movement and survivability over damage in order to coordinate nearby
units. It often sits at the back of the fight, avoiding direct confrontation. */

module.exports =
{
    run: function(creep)
    {
        if(creep.memory.assignedsquad == undefined)
        {

        }
        else if (creep.memory.assignedsquad != undefined)
        {
          
        }
    }
};
