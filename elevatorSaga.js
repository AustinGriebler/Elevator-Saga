{
    init: function(elevators, floors) {
        elevators.forEach(function(elevator, i) {
            elevator.on("floor_button_pressed", function(floorNum) {
                elevator.goToFloor(floorNum);
            })

            elevator.on("passing_floor", function(floorNum, direction) {
                // Pick up passengers on the floor if there is room
                if (elevator.loadFactor() <= 0.6) {    
                    //if elevator going up or down, stop at floor to pick up passenger while going up or down if not full
                    if (floors[floorNum].buttonStates[direction] == "activated") { 
                        elevator.goToFloor(floorNum, true); 
                    }
                }

                const positionInQueue = elevator.destinationQueue.indexOf(floorNum)

                // Stop at the floor first if it is in the queue
                if (positionInQueue != -1) { 
                    //filter through queue, if floor already exists, remove any duplicates
                    elevator.destinationQueue = elevator.destinationQueue.filter(floor => floor !== floorNum);
                    //check and clear queue
                    elevator.checkDestinationQueue();
                    elevator.goToFloor(floorNum, true); 
                }
            });

            floors.forEach(function(floor) {
                floor.on("up_button_pressed down_button_pressed", function(e, floorNum) {
                    //check to see if other elevators are already queued to go to floor 
                    const elevatorWithDest = elevators.find(elevator => elevator.destinationQueue.includes(floorNum.level))
                    //if other elevator is not queued to go floor requested, available elevator will go to floor   
                    if(!elevatorWithDest && elevator.loadFactor() <= 0.6) {
                        elevator.goToFloor(floorNum.level);
                    }
                });
            });
        });
    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }
}
