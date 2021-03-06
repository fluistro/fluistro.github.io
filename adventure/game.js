const levels =  [
		//level 0
		["pillar" , "pillar" , "pillar" , "pillar" , "pillar" , "pillar", "pillar",
		 "pillar" , "pillar" , "pillar" ,"pillar" , "pillar" , "pillar", "stairsup",
		 "pillar" , "pillar" , "pillar" , "hatjump" , "pillar" , "pillar" , "spikes",
		 "animate" , "animate" , "animate" , "animate" , "animate" , "animate" , "animate",
		 "" , "pillar" , "" , "pillar" , "" , "pillar" , "",
		 "" , "pillar" , "" , "pillar" , "" , "pillar" , "",
		 "" , "" , "" , "wizardup" , "" , "" , ""
		],
		//level 1
		["" , "" , "" , "" , "" , "wizardleft stairsleft", "pillar",
		 "" , "pillar" , "pillar" ,"pillar" , "pillar" , "pillar", "pillar",
		 "" , "pillar" , "" , "" , "" , "firelarge" , "",
		 "" , "pillar" , "pillar" , "stairsdown" , "pillar" , "pillar" , "",
		 "" , "pillar" , "pillar" , "pillar" , "pillar" , "pillar" , "",
		 "" , "pillar" , "pillar" , "hatwater" , "pillar" , "pillar" , "firelarge",
		 "animate" , "animate" , "animate" , "animate" , "animate" , "animate" , "animate"
		],
		//level 2
		["pillar" , "pillar" , "hatwater" , "pillar" , "hatjump" , "firelarge", "",
		 "stairsup" , "pillar" , "animatevert" ,"pillar" , "pillar" , "pillar", "",
		 "" , "pillar" , "animatevert" , "" , "" , "pillar" , "",
		 "spikes" , "pillar" , "animatevert" , "pillar" , "" , "pillar" , "",
		 "" , "pillar" , "animatevert" , "wizarddown" , "" , "pillar" , "",
		 "" , "pillar" , "animatevert" , "" , "" , "pillar" , "firelarge",
		 "" , "" , "animatevert" , "" , "" , "" , ""
		],
		//level 3
		["pillar" , "wizardright" , "" , "" , "animate" , "animate", "animate",
		 "pillar" , "pillar" , "rock" ,"pillar" , "pillar" , "hatstrength", "pillar",
		 "pillar" , "pillar" , "" , "pillar" , "pillar" , "pillar" , "pillar",
		 "pillar" , "pillar" , "" , "pillar" , "pillar" , "pillar" , "pillar",
		 "pillar" , "" , "" , "pillar" , "stairsup" , "pillar" , "pillar",
		 "pillar" , "" , "" , "" , "" , "" , "pillar",
		 "pillar" , "pillar" , "pillar" , "pillar" , "pillar" , "pillar" , "pillar"
		],
		//level 4
		["pillar" , "hatstrength" , "" , "spikes" , "" , "pillar", "pillar",
		 "pillar" , "pillar" , "" ,"pillar" , "spikes" , "pillar", "pillar",
		 "pillar" , "pillar" , "animatevert" , "pillar" , "" , "hatjump" , "pillar",
		 "firelarge" , "" , "animatevert" , "pillar" , "wizardup" , "pillar" , "pillar",
		 "" , "pillar" , "animatevert" , "pillar" , "pillar" , "hatwater" , "pillar",
		 "stairsdown" , "pillar" , "" , "rock" , "" , "" , "",
		 "pillar" , "pillar" , "pillar" , "pillar" , "pillar" , "pillar" , "pillar"
		],
		//level 5
		["hatstrength" , "hatjump" , "pillar" , "pillar" , "pillar" , "hatjump", "hatstrength",
		 "" , "" , "pillar" ,"stairsup" , "pillar" , "", "animatevert",
		 "" , "" , "" , "spikes" , "" , "" , "animatevert",
		 "" , "" , "pillar" , "firelarge" , "pillar" , "" , "animatevert",
		 "" , "" , "" , "" , "pillar" , "pillar" , "animatevert",
		 "pillar" , "pillar" , "pillar" , "rock" , "pillar" , "hatstrength" , "hatjump",
		 "pillar" , "wizardright" , "" , "" , "" , "" , "hatwater"
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
	if (oldClassName.includes("stairsleft")) {
		gridBoxes[oldLocation].className = "stairsleft";
	} else if (oldClassName.includes("stairsrigt")) {
		gridBoxes[oldLocation].className = "stairsright";
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
	
	/*
	// if there is a bridge in the next location, keep it
	if (gridBoxes[nextLocation].classList.contains("stairsleft")) {
		newClass += " stairsleft";
	} else 	if (gridBoxes[nextLocation].classList.contains("stairsright")) {
		newClass += " stairsright";
	} // else if
	*/
	
	// move 1 spaces
	currentLocation = nextLocation;
	gridBoxes[currentLocation].className = newClass;
	
	// if it is an enemy
	if (nextClass.includes("enemy")) {
		document.getElementById("lose").style.display = "block";
		document.getElementById("gameBoard").style.display = "none";
		document.getElementById("returnfromgame").style.display = "none";
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
	if (boxes[index].className.includes("jumpup") || boxes[index].className.includes("jumpdown") || boxes[index].className.includes("jumpleft") || boxes[index].className.includes("jumpright") || 
		boxes[index].className.includes("waterup") || boxes[index].className.includes("waterdown") || boxes[index].className.includes("waterleft") || boxes[index].className.includes("waterright") || 
		boxes[index].className.includes("strengthup") || boxes[index].className.includes("strengthdown") || boxes[index].className.includes("strengthleft") || boxes[index].className.includes("strengthright") || 
		boxes[index].className.includes("wizardup") || boxes[index].className.includes("wizarddown") || boxes[index].className.includes("wizardleft") || boxes[index].className.includes("wizardright")) {
		document.getElementById("lose").style.display = "block";
		document.getElementById("gameBoard").style.display = "none";
		document.getElementById("returnfromgame").style.display = "none";
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

function animateEnemyvert(boxes , index , direction) {
	
	// exit the function
	if (boxes.length <= 0) { return; }
	
	// update the images
	if (direction == "down") {
		boxes[index].classList.add("enemydown");
	} else {
		boxes[index].classList.add("enemyup");		
	} // else
	
	// remove images from other boxes
	for(i = 0; i < boxes.length; i++) {
		if (i != index ) {
			boxes[i].classList.remove("enemyup");
			boxes[i].classList.remove("enemydown");		
		} // if
	} // for
	
	// if the enemy hits you
	if (boxes[index].className.includes("jumpup") || boxes[index].className.includes("jumpdown") || boxes[index].className.includes("jumpleft") || boxes[index].className.includes("jumpright") || 
		boxes[index].className.includes("waterup") || boxes[index].className.includes("waterdown") || boxes[index].className.includes("waterleft") || boxes[index].className.includes("waterright") || 
		boxes[index].className.includes("strengthup") || boxes[index].className.includes("strengthdown") || boxes[index].className.includes("strengthleft") || boxes[index].className.includes("strengthright") || 
		boxes[index].className.includes("wizardup") || boxes[index].className.includes("wizarddown") || boxes[index].className.includes("wizardleft") || boxes[index].className.includes("wizardright")) {
		document.getElementById("lose").style.display = "block";
		document.getElementById("gameBoard").style.display = "none";
		document.getElementById("returnfromgame").style.display = "none";
		window.removeEventListener("keydown" , getKey);
	} // if
	
	// moving down
	if (direction == "down") {
		
		// turn around if hit bottom side
		if(index == boxes.length - 1){
			index--;
			direction = "up";
		} else {
			index++;
		} // else
		
	// moving up	
	} else {
		
		// turn around if hit top side
		if (index == 0) {
			index++;
			direction = "down";
		} else {
			index--;
		} // else
	} // else
	
	currentAnimation =  setTimeout(function () {
		animateEnemyvert(boxes , index , direction);
	} , 750);
	
} // animateEnemyvert

//move rock
function moveRock (direction , rockLocation) {

	// left
	if (direction == "left") {
		
		// if out of bounds, don't move
		if (rockLocation % widthOfBoard == 0) { 
			gridBoxes[currentLocation].className = "strength" + direction;
			return; 
		} // if
		
		// if the next location of the rock is an impassable object, don't move
		if (gridBoxes[rockLocation - 1].className.includes("pillar") || gridBoxes[rockLocation - 1].className.includes("firelarge") || gridBoxes[rockLocation - 1].className.includes("spikes") || gridBoxes[rockLocation - 1].className.includes("stairs")) { 
			gridBoxes[currentLocation].className = "strength" + direction;
			return; 
		} // if
		
		// remove the old horse
		gridBoxes[currentLocation].className = "";
		
		// update the location of the horse
		currentLocation --;
		
		// remove old rock and replace it with the horse
		gridBoxes[rockLocation].className = "strength" + direction;
		
		// update location of rock
		rockLocation --;
		
		// show new rock
		gridBoxes[rockLocation].className = "rock";
	} // if
	
	// right
	if (direction == "right") {
		
		// if out of bounds, don't move
		if (rockLocation % widthOfBoard == widthOfBoard - 1) { 
			gridBoxes[currentLocation].className = "strength" + direction;
			return; 
		} // if
		
		// if the next location of the rock is an impassable object, don't move
		if (gridBoxes[rockLocation + 1].className.includes("pillar") || gridBoxes[rockLocation + 1].className.includes("firelarge") || gridBoxes[rockLocation + 1].className.includes("spikes") || gridBoxes[rockLocation + 1].className.includes("stairs")){ 
			gridBoxes[currentLocation].className = "strength" + direction;
			return; 
		} // if
		
		// remove the old horse
		gridBoxes[currentLocation].className = "";
		
		// update the location of the horse
		currentLocation ++;
		
		// remove old rock and replace it with the horse
		gridBoxes[rockLocation].className = "strength" + direction;
		
		// update location of rock
		rockLocation ++;
		
		// show new rock
		gridBoxes[rockLocation].className = "rock";
	} // if
	
	// up
	if (direction == "up") {
		
		// if out of bounds, don't move
		if (rockLocation - widthOfBoard < 0) { 
			gridBoxes[currentLocation].className = "strength" + direction;
			return; 
		} // if
		
		// if the next location of the rock is an impassable object, don't move
		if (gridBoxes[rockLocation - widthOfBoard].className.includes("pillar") || gridBoxes[rockLocation - widthOfBoard].className.includes("firelarge") || gridBoxes[rockLocation - widthOfBoard].className.includes("spikes") || gridBoxes[rockLocation - widthOfBoard].className.includes("stairs")) { 
			gridBoxes[currentLocation].className = "strength" + direction;
			return; 
		} // if
		
		// remove the old horse
		gridBoxes[currentLocation].className = "";
		
		// update the location of the horse
		currentLocation -= widthOfBoard;
		
		// remove old rock and replace it with the horse
		gridBoxes[rockLocation].className = "strength" + direction;
		
		// update location of rock
		rockLocation -= widthOfBoard;
		
		// show new rock
		gridBoxes[rockLocation].className = "rock";
	} // if
	
	// down
	if (direction == "down") {
		
		// if out of bounds, don't move
		if (rockLocation + widthOfBoard >= widthOfBoard * widthOfBoard) { 
			gridBoxes[currentLocation].className = "strength" + direction;
			return; 
		} // if
		
		// if the next location of the rock is an impassable object, don't move
		if (gridBoxes[rockLocation + widthOfBoard].className.includes("pillar") || gridBoxes[rockLocation + widthOfBoard].className.includes("firelarge") || gridBoxes[rockLocation + widthOfBoard].className.includes("spikes") || gridBoxes[rockLocation + widthOfBoard].className.includes("stairs")) { 
			gridBoxes[currentLocation].className = "strength" + direction;
			return; 
		} // if
		
		// remove the old horse
		gridBoxes[currentLocation].className = "";
		
		// update the location of the horse
		currentLocation += widthOfBoard;
		
		// remove old rock and replace it with the horse
		gridBoxes[rockLocation].className = "strength" + direction;
		
		// update location of rock
		rockLocation += widthOfBoard;
		
		// show new rock
		gridBoxes[rockLocation].className = "rock";
	} // if
	
} // moveRock

// move up a level
function levelUp(nextClass) {
	if(nextClass.includes("stairsup") || nextClass.includes("stairsdown")) {
		currentLevel++;
		if(currentLevel == levels.length){
		
			window.clearTimeout(currentAnimation);
			showEndscreen();
		
		} else {
			document.getElementById("levelup").style.display = "flex";
			document.getElementById("gameBoard").style.display = "none";
			document.getElementById("returnfromgame").style.display = "none";
			window.clearTimeout(currentAnimation);
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
	document.getElementById("lose").style.display = "none";
	document.getElementById("gameBoard").style.display = "grid";
	document.getElementById("returnfromgame").style.display = "block";
	
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
	
	animateBoxes2 = document.querySelectorAll(".animatevert");
	animateEnemyvert(animateBoxes2 , 0 , "right");
	
} //loadLevel

//start the game and show story
function startGame() {
	currentLevel = 0;
	document.getElementById("menu").style.display = "none";
	
	//show story here
	document.getElementById("story").style.display = "block";
	document.getElementById("storyimages").style.display = "block";
	document.getElementById("continue").style.display = "block";
	
}//startGame

function restart() {
	window.clearTimeout(currentAnimation);
	currentLevel = 0;
	loadLevel();
}//restart

//show ending screen
function showEndscreen() {
	
	document.getElementById("returnfromgame").style.display = "none";
	document.getElementById("gameBoard").style.display = "none";
	document.getElementById("endscreen").style.display = "block";
	
} // showEndscreen

//show menu
function showMenu() {
	
	//hide everything but the menu
	document.getElementById("instructions").style.display = "none";
	document.getElementById("gameBoard").style.display = "none";
	document.getElementById("lose").style.display = "none";
	document.getElementById("endscreen").style.display = "none";
	document.getElementById("returnfromgame").style.display = "none";
	document.getElementById("menu").style.display = "block";
	window.clearTimeout(currentAnimation);
}//showMenu

//show instructions
function showInstructions() {
	document.getElementById("menu").style.display = "none";
	document.getElementById("instructions").style.display = "block";
	document.getElementById("returnfromgame").style.display = "block";	
}//showInstructions
