const levels = [
	
	//level 0
	["rock", "", "", "", "rider",
	 "flag", "water", "animate", "animate", "animate",
	 "fenceside", "tree", "", "", "",
	 "", "fenceup", "", "", "",
	 "", "fenceup", "", "", "horseup"],
	
	//level 1
	["flag", "water", "", "tree", "rock",
	 "fenceside", "water", "", "rock", "rider",
	 "", "bridge", "", "tree", "",
	 "", "water", "animate", "animate", "animate",
	 "horseup", "water", "", "", ""]
	
	]; //end of levels

const noPassObstacles = ["rock", "tree", "water"];
	
var gridBoxes;
var currentLevel = 0; //starting level
var riderOn = false; //is the rider on the horse
var currentLocationOfHorse = 0;
var currentAnimation; //allows 1 animation per level
var widthOfBoard = 5;

//start game
window.addEventListener("load", function() {
	gridBoxes = document.querySelectorAll("#gameBoard div");
	loadLevel();
});

//move horse
document.addEventListener("keydown", function(e) {
	
	switch (e.keyCode) {
		case 37: //left arrow
			if(currentLocationOfHorse % widthOfBoard !== 0) {
				tryToMove("left");
			}//if
			break;
		case 38: //up arrow
			if(currentLocationOfHorse - widthOfBoard >= 0) {
				tryToMove("up");
			}//if
			break;
		case 39: //right arrow
			if(currentLocationOfHorse % widthOfBoard < widthOfBoard - 1) {
				tryToMove("right");
			}//if
			break;
		case 40: //down arrow
			if(currentLocationOfHorse + widthOfBoard < widthOfBoard * widthOfBoard) {
				tryToMove("down");
			}//if
			break;
	}//switch
	
});//event listener

//try to move horse
function tryToMove(direction) {
	
	//location before move
	let oldLocation = currentLocationOfHorse;
	
	//class of location before move
	let oldClassName = gridBoxes[oldLocation].className;
	
	let nextLocation = 0; //location we wish to move to
	let nextClass = ""; //class of location we with to move to
	
	//for jumping over a fence
	let nextLocation2 = 0;
	let nextClass2 = "";
	
	let newClass = ""; //new class to switch to if move successful
	
	//assign nextLocation a value
	switch(direction) {
		case "left":
			nextLocation = currentLocationOfHorse - 1;
			break;
		case "right":
			nextLocation = currentLocationOfHorse + 1;
			break;
		case "up":
			nextLocation = currentLocationOfHorse - widthOfBoard;
			break;
		case "down":
			nextLocation = currentLocationOfHorse + widthOfBoard;
			break;
	}//switch
	
	nextClass = gridBoxes[nextLocation].className;
	
	//if the obstacle is not passable, don't move
	if(noPassObstacles.includes(nextClass)) { return; }
	
	//if it's a fence, and there is no rider, don't move
	if(!riderOn && nextClass.includes("fence")) { return; }
	
	//if there is a fence, move two spaces with animation
	if(nextClass.includes("fence")) {
		
		//rider must be on to jump
		if(riderOn){

			//reset class name of current location
			gridBoxes[currentLocationOfHorse].className = ""; //possible bug for bridge
			oldClassName = gridBoxes[nextLocation].className;
			
			//set values according to direction
			if (direction == "left") {
				nextClass = "fencejumpleft";
				nextClass2 = "horseriderleft";
				nextLocation2 = nextLocation - 1;
			} else if (direction == "right") {
				nextClass = "fencejumpright";
				nextClass2 = "horseriderright";
				nextLocation2 = nextLocation + 1;
			} else if (direction == "up") {
				nextClass = "fencejumpup";
				nextClass2 = "horseriderup";
				nextLocation2 = nextLocation - widthOfBoard;
			} else if (direction == "down") {
				nextClass = "fencejumpdown";
				nextClass2 = "horseriderdown";
				nextLocation2 = nextLocation + widthOfBoard;
			}//if
			
			//show horse jumping
			gridBoxes[nextLocation].className = nextClass;
			setTimeout(function() {
				
				//set jump back to just a fence
				gridBoxes[nextLocation].className = oldClassName;
				
				//update current location of horse to be 2 spaces past take off
				currentLocationOfHorse = nextLocation2;
				
				//get class of box after jump
				nextClass = gridBoxes[currentLocationOfHorse].className;
				//check if obstacle after jump **
				
				//show rider and horse after landing
				gridBoxes[currentLocationOfHorse].className = nextClass2;
				
				//if next box is a flag, go up a level
				levelUp(nextClass);
				
			}, 350);
			return;
			
		}//if riderOn
		
	}//if class has fence
	
	//if there is a rider, add rider
	if(nextClass == "rider") {
		riderOn = true;
	}//if
	
	//if there is a bridge in the old location, keep it
	if(oldClassName.includes("bridge")) {
		gridBoxes[oldLocation].className = "bridge";
	} else {
		gridBoxes[oldLocation].className = "";
	}//else
	
	//build name of new class
	newClass = (riderOn) ? "horserider" : "horse";
	newClass += direction;
	
	//if there is a bridge in the next location, keep it
	if(gridBoxes[nextLocation].classList.contains("bridge")) {
		newClass += " bridge";
	}//if
	
	//move one space
	currentLocationOfHorse = nextLocation;
	gridBoxes[currentLocationOfHorse].className = newClass;
	
	//if it is an enemy, end the game
	if(nextClass.includes("enemy")) {
		document.getElementById("lose").style.display = "block";
		return;
	}//if
	
	//move to next level if needed
	levelUp(nextClass);
	
}//tryToMove

//move up a level
function levelUp(nextClass) {
	if (nextClass == "flag" && riderOn) {
		document.getElementById("levelup").style.display = "block";
		clearTimeout(currentAnimation);
		setTimeout (function() {
			document.getElementById("levelup").style.display = "none";
			currentLevel++;
			loadLevel();
		}, 1000);
	}//if
}//levelUp

//load level
function loadLevel(){
	let levelMap = levels[currentLevel];
	let animateBoxes;
	riderOn = false;

	//load board
	for (i = 0; i < gridBoxes.length; i++) {
		gridBoxes[i].className = levelMap[i];
		if(levelMap[i].includes("horse")) currentLocationOfHorse = i;
	}//for

	animateBoxes = document.querySelectorAll(".animate");
	
	animateEnemy(animateBoxes, 0, "right");

}//loadLevel

//animate enemy left to right
//boxes - array of grid boxes to animate
//index - current location of animation
//direction - current direction of animation
function animateEnemy(boxes, index, direction){

	//exit function if no animation
	if(boxes.length <= 0) { return; }

	//update images
	if(direction == "right") {
		boxes[index].classList.add("enemyright");
	} else {
		boxes[index].classList.add("enemyleft");
	}//else

	//remove images from other boxes
	for(i = 0; i < boxes.length; i++){
		if(i != index){
			boxes[i].classList.remove("enemyleft");
			boxes[i].classList.remove("enemyright");
		}//if
	}//for

	//moving right
	if (direction == "right") {
		//turn around if hit right side
		if (index == boxes.length - 1){
			index--;
			direction = "left";
		} else {
			index++;
		}//else
	}
	//moving left
	else {
		//turn around if hit left side
		if (index == 0){
			index++;
			direction = "right";
		} else {
			index--;
		}//else
	}//else

	currentAnimation = setTimeout(function() {
		animateEnemy(boxes, index, direction);
	}, 750);

}//animateEnemy