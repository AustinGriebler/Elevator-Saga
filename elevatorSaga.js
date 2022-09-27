{
    init: function(elevators, floors) {
        const elevator = elevators[0];

        elevator.on("floor_button_pressed", function(floorNum) {
            elevator.goToFloor(floorNum);
        })

        elevator.on("passing_floor", function(floorNum, direction) {
            console.log(elevator.loadFactor())
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
                //remove one floor from position in queue
                elevator.destinationQueue.splice(positionInQueue, 1);
                elevator.checkDestinationQueue();
                elevator.goToFloor(floorNum, true); 
            }
        });

        floors.forEach(function(e) {
            e.on("up_button_pressed", function(floorNum) {
                elevator.goToFloor(floorNum.level);
            })

            e.on("down_button_pressed", function(floorNum) {
                elevator.goToFloor(floorNum.level);
            })
        })
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}
