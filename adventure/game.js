const levels =  [

		//level 0
		["pillar" , "pillar" , "pillar" , "pillar" , "pillar" , "pillar", "pillar",
		 "pillar" , "pillar" , "pillar" ,"pillar" , "pillar" , "pillar", "stairs",
		 "pillar" , "pillar" , "pillar" , "hatjump" , "pillar" , "pillar" , "fenceside",
		 "animate" , "animate" , "animate" , "animate" , "animate" , "animate" , "animate",
		 "" , "pillar" , "" , "pillar" , "" , "pillar" , "",
		 "" , "pillar" , "" , "pillar" , "" , "pillar" , "",
		 "" , "" , "" , "horseup" , "" , "" , ""
		],
		//level 1
		["" , "" , "" , "" , "" , "horseleft", "pillar",
		 "" , "pillar" , "pillar" ,"pillar" , "pillar" , "pillar", "pillar",
		 "" , "pillar" , "" , "" , "" , "firelarge" , "",
		 "" , "pillar" , "pillar" , "stairs" , "pillar" , "pillar" , "",
		 "" , "pillar" , "pillar" , "pillar" , "pillar" , "pillar" , "",
		 "" , "pillar" , "pillar" , "hatwater" , "pillar" , "pillar" , "firelarge",
		 "animate" , "animate" , "animate" , "animate" , "animate" , "animate" , "animate"
		]
	]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
var currentLevel = 0;	// starting level
var jumpOn = false; // is the rider on?
var waterOn = false;
var strengthOn = false;
var currentLocation = 0;
var currentAnimation;	// allows 1 animation per level
var widthOfBoard = 7;

// start game
window.addEventListener("load" , function () {
	showMenu();
});

// get the key from user
function getKey(e) {
	switch (e.keyCode) {
		
		case 37:// left arrow
			if (currentLocation % widthOfBoard !== 0) {
				tryToMove("left");
			} // if
			break;
		case 38:// up arrow
			if (currentLocation - widthOfBoard >= 0) {
				tryToMove("up");
			} // if
		break;
		case 39:// right arrow
			if (currentLocation % widthOfBoard < widthOfBoard - 1) {
				tryToMove("right");
			} // if
			break;
		case 40:// down arrow
			if (currentLocation + widthOfBoard < widthOfBoard * widthOfBoard) {
				tryToMove("down");
			} // if
			break;
	} // switch
} // getKey

//try to move horse
function tryToMove(direction) {
	
	//location before move
	let oldLocation = currentLocation;
	
	// class of location before move
	let oldClassName = gridBoxes[oldLocation].className;
	
	let nextLocation = 0; // location we wish to move to
	let nextClass = "";    // class of location we wish to move to
	
	let nextLocation2 = 0;
	let nextClass2 = "" ;
	
	let newClass = "";    // new class to switch to if move successful
	
	switch (direction) {
		case "left":
			nextLocation = currentLocation - 1;
			break;
		case "right":
			nextLocation =  currentLocation + 1;
			break;
		case "up":
			nextLocation = currentLocation - widthOfBoard;
			break;
		case "down":
			nextLocation = currentLocation + widthOfBoard;
			break;
	} // switch
	
	nextClass = gridBoxes[nextLocation].className;
	
	if (nextClass == "pillar") { 
	
		// makes sure the right character is displayed when hitting an inpassable object
		if(waterOn){
			gridBoxes[currentLocation].className = ("water" + direction); 
		} else if (jumpOn) {
			gridBoxes[currentLocation].className = ("jump" + direction); 
		} else if (strengthOn) {
			gridBoxes[currentLocation].className = ("strength" + direction); 
		} else {
			gridBoxes[currentLocation].className = ("wizard" + direction); 
		} // else
		return; 
	} // if
	
	if (!waterOn && nextClass == "firelarge") { 
	
		// makes sure the right character is displayed when hitting an inpassable object
		if (jumpOn) {
			gridBoxes[currentLocation].className = ("jump" + direction); 
		} else if (strengthOn) {
			gridBoxes[currentLocation].className = ("strength" + direction); 
		} else {
			gridBoxes[currentLocation].className = ("wizard" + direction); 
		} // else
		return; 
	} // if
	
	if (!jumpOn && nextClass == "spikes") { 
	
		// makes sure the right character is displayed when hitting an inpassable object
		if(waterOn){
			gridBoxes[currentLocation].className = ("water" + direction); 
		} else if (strengthOn) {
			gridBoxes[currentLocation].className = ("strength" + direction); 
		} else {
			gridBoxes[currentLocation].className = ("wizard" + direction); 
		} // else
		return;
	} // if
	
	if(!strengthOn && nextClass == "rock") { 
	
		// makes sure the right character is displayed when hitting an inpassable object
		if(waterOn){
			gridBoxes[currentLocation].className = ("water" + direction); 
		} else if (jumpOn) {
			gridBoxes[currentLocation].className = ("jump" + direction); 
		} else {
			gridBoxes[currentLocation].className = ("wizard" + direction); 
		} // else
		return;  
	} // if
	
	// if there are spikes, move two spaces with animation
	if (nextClass == "spikes") {
		
		gridBoxes[currentLocation].className = "";
		oldClassName = gridBoxes[nextLocation].className;

		// set values according to direction
		if (direction == "left") {
			nextClass = "spikejumpleft";
			nextClass2 = "jumpleft";
			nextLocation2 = nextLocation - 1;
			if (nextLocation % widthOfBoard == 0) {
				gridBoxes[currentLocation].classList.add("jump" + direction);
				return;
			} // if
		} else if (direction == "right") {
			nextClass = "spikejumpright";
			nextClass2 = "jumpright";
			nextLocation2 = nextLocation + 1;
			if (nextLocation % widthOfBoard == widthOfBoard - 1) {
				gridBoxes[currentLocation].classList.add("jump" + direction);
				return;
			} // if
		} else if (direction == "up") {
			nextClass = "spikejumpup";
			nextClass2 = "jumpup";
			nextLocation2 = nextLocation - widthOfBoard;
			if (nextLocation - widthOfBoard < 0) {
				gridBoxes[currentLocation].classList.add("jump" + direction);
				return;
			} // if
		} else if (direction == "down") {
			nextClass = "spikejumpdown";
			nextClass2 = "jumpdown";
			nextLocation2 = nextLocation + widthOfBoard;
			if (nextLocation + widthOfBoard >= widthOfBoard * widthOfBoard) {
				gridBoxes[currentLocation].classList.add("jump" + direction);
				return;
			} // if
		}//if

		// if there is an impassible object, don't move
		if (gridBoxes[nextLocation2].className == "pillar" || gridBoxes[nextLocation2].className == "spikes" || gridBoxes[nextLocation2].className == "firelarge" || gridBoxes[nextLocation2].className == "rock") {
			gridBoxes[currentLocation].classList.add("jump" + direction);
			return;
		} // if

		// show horse jumping
		gridBoxes[nextLocation].className = nextClass;

		// disables eventListener
		window.removeEventListener("keydown" , getKey);

		setTimeout(function () {

			// set jump back to just a fence
			gridBoxes[nextLocation].className = oldClassName;

			// update current location of horse to be two spaces past take off
			currentLocation = nextLocation2;

			// get class of box after jump
			nextClass = gridBoxes[currentLocation].className;

			// show horse and rider after landing
			gridBoxes[currentLocation].className = nextClass2;

			// if next box is a flag, go up a level
			levelUp(nextClass);

			// re-enables eventListener
			window.addEventListener("keydown" , getKey);

		} , 350);

		return;
		
	} // if there's spikes
	
	if (nextClass == "rock") {
		moveRock(direction , nextLocation);
		return;
	} // if
	
	if (nextClass == "firelarge") {
		
		//show wizard in right direction
		gridBoxes[currentLocation].className = "water" + direction;
		
		// disables eventListener
		window.removeEventListener("keydown" , getKey);
		
		//show animation here
		setTimeout ( function () {
			
			// show the medium fire
			gridBoxes[nextLocation].className = "firemedium";
			
		} , 350);
		setTimeout ( function () {
			
			// show the small fire
			gridBoxes[nextLocation].className = "firesmall";
			
		} , 700);
		setTimeout ( function () {
			
			// remove the fire entirely
			gridBoxes[nextLocation].className = "";
		
			// re-enables eventListener
			window.addEventListener("keydown" , getKey);
		} , 1050);
		
		return;
		
	}//if
	
	// if there is a hat, add hat
	if (nextClass == "hatjump") {
		jumpOn = true;
		waterOn = false;
		strengthOn = false;
	} else if (nextClass == "hatwater") {
		waterOn = true;
		jumpOn = false;
		strengthOn = false;
	} else if (nextClass == "hatstrength") {
		strengthOn = true;
		waterOn = false;
		jumpOn = false;
	} // if
	
	// if there is a bridge in the old location, keep it
	if (oldClassName.includes("stairs")) {
		gridBoxes[oldLocation].className = "stairs";
	} else {
		gridBoxes[oldLocation].className = "";
	} // else
	
	// build name of new class
	if(jumpOn){
		newClass = "jump";
	} else if(strengthOn) {
		newClass = "strength";
	} else if(waterOn) {
		newClass = "water";
	} else {
		newClass = "wizard";
	}//else
	newClass += direction;
	
	// if there is a bridge in the next location, keep it
	if (gridBoxes[nextLocation].classList.contains("stairs")) {
		newClass += "stairs";
	} // if
	
	// move 1 spaces
	currentLocation = nextLocation;
	gridBoxes[currentLocation].className = newClass;
	
	// if it is an enemy
	if (nextClass.includes("enemy")) {
		document.getElementById("lose").style.display = "block";
		document.getElementById("gameBoard").style.display = "none";
		document.getElementsByClassName("return").style.display = "none";
		window.removeEventListener("keydown" , getKey);
	} // if
	
	// move up to next level if needed
	levelUp(nextClass);
	
} // tryToMove

// animate enemy left to right (could add up and down to this)
// boxes - array of grid boxes that include animation
// index - current location of animation
// direction - current direction of animation 
function animateEnemy(boxes , index , direction) {
	
	// exit the function
	if (boxes.length <= 0) { return; }
	
	// update the images
	if (direction == "right") {
		boxes[index].classList.add("enemyright");
	} else {
		boxes[index].classList.add("enemyleft");		
	} // else
	
	// remove images from other boxes
	for(i = 0; i < boxes.length; i++) {
		if (i != index ) {
			boxes[i].classList.remove("enemyleft");
			boxes[i].classList.remove("enemyright");		
		} // if
	} // for
	
	// if the enemy hits you
	if (boxes[index].className.includes("up") || boxes[index].className.includes("down") || boxes[index].className.includes("left") || boxes[index].className.includes("right")) {
		document.getElementById("lose").style.display = "block";
		document.getElementById("gameBoard").style.display = "none";
		document.getElementById("return").style.display = "none";
		window.removeEventListener("keydown" , getKey);
	} // if
	
	// moving right
	if (direction == "right") {
		
		// turn around if hit right side
		if(index == boxes.length - 1){
			index--;
			direction = "left";
		} else {
			index++;
		} // else
		
	// moving left	
	} else {
		
		// turn around if hit right side
		if (index == 0) {
			index++;
			direction = "right";
		} else {
			index--;
		} // else
	} // else
	
	currentAnimation =  setTimeout(function () {
		animateEnemy(boxes , index , direction);
	} , 750);
	
} // animateEnemy

//move rock
function moveRock (direction , rockLocation) {

	// left
	if (direction == "left") {
		
		// if out of bounds, don't move
		if (rockLocation % widthOfBoard == 0) { 
			gridBoxes[currentLocation].className = "wizard" + direction;
			return; 
		} // if
		
		// if the next location of the rock is an impassable object, don't move
		if (gridBoxes[rockLocation - 1].className.includes("pillar") || gridBoxes[rockLocation - 1].className.includes("firelarge") || gridBoxes[rockLocation - 1].className.includes("spikes") || gridBoxes[rockLocation - 1].className.includes("stairs")) { 
			gridBoxes[currentLocation].className = "wizard" + direction;
			console.log("impassible"); 
			return; 
		} // if
		
		// remove the old horse
		gridBoxes[currentLocation].className = "";
		
		// update the location of the horse
		currentLocation --;
		
		// remove old rock and replace it with the horse
		gridBoxes[rockLocation].className = "wizard" + direction;
		
		// update location of rock
		rockLocation --;
		
		// show new rock
		gridBoxes[rockLocation].className = "rock";
	} // if
	
	// right
	if (direction == "right") {
		
		// if out of bounds, don't move
		if (rockLocation % widthOfBoard == widthOfBoard - 1) { 
			gridBoxes[currentLocation].className = "wizard" + direction;
			return; 
		} // if
		
		// if the next location of the rock is an impassable object, don't move
		if (gridBoxes[rockLocation + 1].className.includes("pillar") || gridBoxes[rockLocation + 1].className.includes("firelarge") || gridBoxes[rockLocation + 1].className.includes("spikes") || gridBoxes[rockLocation + 1].className.includes("stairs")){ 
			gridBoxes[currentLocation].className = "wizard" + direction;
			console.log("impassible"); 
			return; 
		} // if
		
		// remove the old horse
		gridBoxes[currentLocation].className = "";
		
		// update the location of the horse
		currentLocation ++;
		
		// remove old rock and replace it with the horse
		gridBoxes[rockLocation].className = "wizard" + direction;
		
		// update location of rock
		rockLocation ++;
		
		// show new rock
		gridBoxes[rockLocation].className = "rock";
	} // if
	
	// up
	if (direction == "up") {
		
		// if out of bounds, don't move
		if (rockLocation - widthOfBoard < 0) { 
			gridBoxes[currentLocation].className = "wizard" + direction;
			return; 
		} // if
		
		// if the next location of the rock is an impassable object, don't move
		if (gridBoxes[rockLocation - widthOfBoard].className.includes("pillar") || gridBoxes[rockLocation - widthOfBoard].className.includes("firelarge") || gridBoxes[rockLocation - widthOfBoard].className.includes("spikes") || gridBoxes[rockLocation - widthOfBoard].className.includes("stairs")) { 
			gridBoxes[currentLocation].className = "wizard" + direction;
			console.log("impassible"); 
			return; 
		} // if
		
		// remove the old horse
		gridBoxes[currentLocation].className = "";
		
		// update the location of the horse
		currentLocation -= widthOfBoard;
		
		// remove old rock and replace it with the horse
		gridBoxes[rockLocation].className = "wizard" + direction;
		
		// update location of rock
		rockLocation -= widthOfBoard;
		
		// show new rock
		gridBoxes[rockLocation].className = "rock";
	} // if
	
	// down
	if (direction == "down") {
		
		// if out of bounds, don't move
		if (rockLocation + widthOfBoard >= widthOfBoard * widthOfBoard) { 
			gridBoxes[currentLocation].className = "wizard" + direction;
			return; 
		} // if
		
		// if the next location of the rock is an impassable object, don't move
		if (gridBoxes[rockLocation + widthOfBoard].className.includes("pillar") || gridBoxes[rockLocation + widthOfBoard].className.includes("firelarge") || gridBoxes[rockLocation + widthOfBoard].className.includes("spikes") || gridBoxes[rockLocation + widthOfBoard].className.includes("stairs")) { 
			gridBoxes[currentLocation].className = "wizard" + direction;
			console.log("impassible"); 
			return; 
		} // if
		
		// remove the old horse
		gridBoxes[currentLocation].className = "";
		
		// update the location of the horse
		currentLocation += widthOfBoard;
		
		// remove old rock and replace it with the horse
		gridBoxes[rockLocation].className = "wizard" + direction;
		
		// update location of rock
		rockLocation += widthOfBoard;
		
		// show new rock
		gridBoxes[rockLocation].className = "rock";
	} // if
	
} // moveRock

// move up a level
function levelUp(nextClass) {
	if(nextClass == "stairs") {
		currentLevel++;
		if(currentLevel == levels.length){
		
			clearTimeout(currentAnimation);
			showEndscreen();
		
		} else {
			document.getElementById("levelup").style.display = "flex";
			document.getElementById("gameBoard").style.display = "none";
			document.getElementById("return").style.display = "none";
			clearTimeout(currentAnimation);
			setTimeout(function () {
				document.getElementById("levelup").style.display = "none";
				document.getElementById("gameBoard").style.display = "grid";
				loadLevel();
			} , 1000);
			
		} // else
		
	} // if
} // levelUp

// load levels 0 - maxlevel
function loadLevel() {
	let levelMap = levels[currentLevel];
	let animateBoxes;
	jumpOn = false;
	waterOn = false;
	strengthOn = false;
	
	document.getElementById("story").style.display = "none";
	document.getElementById("storyimages").style.display = "none";
	document.getElementById("continue").style.display = "none";
	document.getElementById("gameBoard").style.display = "grid";
	document.getElementsByClassName("return").style.display = "block";
	
	// load the board
	for(i = 0; i < gridBoxes.length; i++ ) {
		gridBoxes[i].className = levelMap[i];
		if (levelMap[i].includes("wizard")) {
			currentLocation = i;
		} // if
	
	} // for
	
	// event listener
	window.addEventListener("keydown" , getKey); 
	
	animateBoxes = document.querySelectorAll(".animate");
	animateEnemy(animateBoxes , 0 , "right");
	
} //startGame

//start the game
function startGame() {
	currentLevel = 0;
	document.getElementById("menu").style.display = "none";
	
	//show story here
	document.getElementById("story").style.display = "block";
	document.getElementById("storyimages").style.display = "block";
	document.getElementById("continue").style.display = "block";
	
}//startGame

//show ending screen
function showEndscreen() {
	
	document.getElementById("instructions").style.display = "none";
	document.getElementsByClassName("return").style.display = "none";
	document.getElementById("lose").style.display = "none";
	document.getElementById("menu").style.display = "none";

	document.getElementById("gameBoard").style.display = "none";
	document.getElementsByClassName("return").style.display = "none";
	document.getElementById("endscreen").style.display = "block";
	
} // showEndscreen

//show menu
function showMenu() {
	
	//hide everything but the menu
	document.getElementById("instructions").style.display = "none";
	document.getElementById("gameBoard").style.display = "none";
	document.getElementsByClassName("return").style.display = "none";
	document.getElementById("lose").style.display = "none";
	document.getElementById("endscreen").style.display = "none";
	document.getElementById("menu").style.display = "block";
	window.clearTimeout(currentAnimation);
}//showMenu

//show instructions
function showInstructions() {
	document.getElementById("menu").style.display = "none";
	document.getElementById("instructions").style.display = "block";
	document.getElementsByClassName("return").style.display = "block";	
}//showInstructions
