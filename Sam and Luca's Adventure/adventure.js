const levels = [
	
	//level 0
	["", "rock", "", "", "rider",
	"flag", "water", "animate", "animate", "animate",
	"fenceside", "tree", "", "", "",
	"", "fenceup", "", "", "",
	"", "fenceup", "", "", "horseup"]
	
	]; //end of levels

var gridBoxes;
var currentLevel = 0; //starting level
var riderOn = false; //is the rider on the horse
var currentLocationOfHorse = 0;
var currentAnimation; //allows 1 animation per level

//start game
window.addEventListener("load", function() {
	gridBoxes = document.querySelectorAll("#gameBoard div");
	loadLevel();
});

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