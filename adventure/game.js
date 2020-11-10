const levels =  [

		// level 0
		["flag" , "tree" , "" , "" , "hatstrength" , "hatwater", "hatjump",
		 "fenceside" , "tree" , "" ,"" , "" , "", "",
		 "" , "tree" , "animate" , "animate" , "animate" , "", "",
		 "" , "water" , "" , "" , "" , "", "",
		 "" , "fenceup" , "" , "horseup" , "", "rock", "",
		 "", "", "", "", "", "", "",
		 "", "", "", "", "", "", ""
		],
		//level 1
		["flag" , "tree" , "" , "" , "" , "", "",
		 "" , "rock" , "" ,"water" , "" , "", "",
		 "fenceside" , "animate" , "animate" , "animate bridge" , "animate" , "", "",
		 "" , "water" , "" , "water" , "" , "", "",
		 "" , "" , "" , "water" , "horseup", "", "",
		 "", "", "", "", "", "", "",
		 "", "", "", "", "hatjump", "", ""
		],
		//level 2
		["fenceup" , "fenceside" , "fenceside" , "fenceside" , "fenceside" , "", "",
		 "" , "" , "fenceup" ,"" , "fenceup" , "", "",
		 "fenceup" , "" , "" , "fenceside" , "fenceup" , "", "",
		 "fenceup" , "" , "" , "" , "fenceup" , "", "",
		 "fenceup" , "" , "horseup" , "" , "fenceup", "", "",
		 "", "", "", "", "", "", "",
		 "", "", "", "flag", "hatjump", "", ""
		],
		//level 3
		["tree" , "tree" , "tree" , "tree" , "tree" , "tree", "tree",
		 "tree" , "tree" , "tree" ,"tree" , "tree" , "tree", "flag",
		 "tree" , "tree" , "tree" , "hatjump" , "tree" , "tree" , "fenceside",
		 "animate" , "animate" , "animate" , "animate" , "animate" , "animate" , "animate",
		 "" , "tree" , "" , "tree" , "" , "tree" , "",
		 "" , "tree" , "" , "tree" , "" , "tree" , "",
		 "" , "" , "" , "horseup" , "" , "" , ""
		]
		]; // end of levels

const gridBoxes = document.querySelectorAll("#gameBoard div");
const noPassObstacles = ["tree"];
var currentLevel = 0;	// starting level
var jumpOn = false; // is the rider on?
var waterOn = false;
var strengthOn = false;
var currentLocationOfHorse = 0;
var currentAnimation;	// allows 1 animation per level
var widthOfBoard = 7;

// start game
window.addEventListener("load" , function () {
	loadLevel();
});

// move horse
window.addEventListener("keydown" , getKey); // event listener

// get the key from user
function getKey(e) {
	switch (e.keyCode) {
		
		case 37:// left arrow
			if (currentLocationOfHorse % widthOfBoard !== 0) {
				tryToMove("left");
			} // if
			break;
		case 38:// up arrow
			if (currentLocationOfHorse - widthOfBoard >= 0) {
				tryToMove("up");
			} // if
		break;
		case 39:// right arrow
			if (currentLocationOfHorse % widthOfBoard < widthOfBoard - 1) {
				tryToMove("right");
			} // if
			break;
		case 40:// down arrow
			if (currentLocationOfHorse + widthOfBoard <= widthOfBoard * widthOfBoard) {
				tryToMove("down");
			} // if
			break;
	} // switch
} // getKey

//try to move horse
function tryToMove(direction) {
	
	//location before move
	let oldLocation = currentLocationOfHorse;
	
	// class of location before move
	let oldClassName = gridBoxes[oldLocation].className;
	
	let nextLocation = 0; // location we wish to move to
	let nextClass = "";    // class of location we wish to move to
	
	let nextLocation2 = 0;
	let nextClass2 = "" ;
	
	let newClass = "";    // new class to switch to if move successful
	
	switch (direction) {
		case "left":
			nextLocation = currentLocationOfHorse - 1;
			break;
		case "right":
			nextLocation =  currentLocationOfHorse + 1;
			break;
		case "up":
			nextLocation = currentLocationOfHorse - widthOfBoard;
			break;
		case "down":
			nextLocation = currentLocationOfHorse + widthOfBoard;
			break;
	} // switch
	
	nextClass = gridBoxes[nextLocation].className;
	
	if (noPassObstacles.includes(nextClass)){ 
	
		// makes sure the right character is displayed when hitting an inpassable object
		if(waterOn){
			gridBoxes[currentLocationOfHorse].className = ("horse" + direction); 
		} else if (jumpOn) {
			gridBoxes[currentLocationOfHorse].className = ("horserider" + direction); 
		} else if (strengthOn) {
			gridBoxes[currentLocationOfHorse].className = ("horse" + direction); 
		} else {
			gridBoxes[currentLocationOfHorse].className = ("horse" + direction); 
		} // else
		return; 
	} // if
	
	//if the obstacle is not passable, don't move
	if (!waterOn && nextClass == "water") { 
	
		// makes sure the right character is displayed when hitting an inpassable object
		if (jumpOn) {
			gridBoxes[currentLocationOfHorse].className = ("horserider" + direction); 
		} else if (strengthOn) {
			gridBoxes[currentLocationOfHorse].className = ("horse" + direction); 
		} else {
			gridBoxes[currentLocationOfHorse].className = ("horse" + direction); 
		} // else
		return; 
	} // if
	
	// if it's a fence, and there is no rider, don't move
	if (!jumpOn && nextClass.includes("fence")) { 
	
		// makes sure the right character is displayed when hitting an inpassable object
		if(waterOn){
			gridBoxes[currentLocationOfHorse].className = ("horse" + direction); 
		} else if (strengthOn) {
			gridBoxes[currentLocationOfHorse].className = ("horse" + direction); 
		} else {
			gridBoxes[currentLocationOfHorse].className = ("horse" + direction); 
		} // else
		return;
	} // if
	
	if(!strengthOn && nextClass.includes("rock")) { 
	
		// makes sure the right character is displayed when hitting an inpassable object
		if(waterOn){
			gridBoxes[currentLocationOfHorse].className = ("horse" + direction); 
		} else if (jumpOn) {
			gridBoxes[currentLocationOfHorse].className = ("horserider" + direction); 
		} else {
			gridBoxes[currentLocationOfHorse].className = ("horse" + direction); 
		} // else
		return;  
	} // if
	
	// if there is a fence, move two spaces with animation
	if (nextClass.includes("fence")) {
		
		gridBoxes[currentLocationOfHorse].className = "";
		oldClassName = gridBoxes[nextLocation].className;

		// if the horse isn't jumping in the right direction, don't move
		if ((direction == "left" || direction == "right") && nextClass.includes("side")) {
			gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
			console.log(newClass + currentLocationOfHorse);
			return;
		} else if ((direction == "up" || direction == "down") && nextClass.includes("up")) {
			gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
			console.log(newClass + currentLocationOfHorse + gridBoxes[currentLocationOfHorse].classList);
			return;
		} // else if

		// set values according to direction
		if (direction == "left" && nextClass.includes("up")) {
			nextClass = "jumpleft";
			nextClass2 = "horseriderleft";
			nextLocation2 = nextLocation - 1;
			if (nextLocation % widthOfBoard == 0) {
				gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
				return;
			} // if
		} else if (direction == "right" && nextClass.includes("up")) {
			nextClass = "jumpright";
			nextClass2 = "horseriderright";
			nextLocation2 = nextLocation + 1;
			if (nextLocation % widthOfBoard == widthOfBoard - 1) {
				gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
				return;
			} // if
		} else if (direction == "up" && nextClass.includes("side")) {
			nextClass = "jumpup";
			nextClass2 = "horseriderup";
			nextLocation2 = nextLocation - widthOfBoard;
			if (nextLocation - widthOfBoard < 0) {
				gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
				return;
			} // if
		} else if (direction == "down" && nextClass.includes("side")) {
			nextClass = "jumpdown";
			nextClass2 = "horseriderdown";
			nextLocation2 = nextLocation + widthOfBoard;
			if (nextLocation + widthOfBoard >= widthOfBoard * widthOfBoard) {
				gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
				return;
			} // if
		}

		// if there is an impassible object, don't move
		if (noPassObstacles.includes(gridBoxes[nextLocation2].className)) {
			gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
			return;
		} // if	

		// if there is an impassible object, don't move
		if (gridBoxes[nextLocation2].className.includes("fence")) {
			gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
			return;
		} // if				
		
		// if there is an impassible object, don't move
		if (gridBoxes[nextLocation2].className.includes("water")) {
			gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
			return;
		} // if		
		
		// if there is an impassible object, don't move
		if (gridBoxes[nextLocation2].className.includes("rock")) {
			gridBoxes[currentLocationOfHorse].classList.add("horserider" + direction);
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
			currentLocationOfHorse = nextLocation2;

			// get class of box after jump
			nextClass = gridBoxes[currentLocationOfHorse].className;

			// show horse and rider after landing
			gridBoxes[currentLocationOfHorse].className = nextClass2;

			// if next box is a flag, go up a level
			levelUp(nextClass);

			// re-enables eventListener
			window.addEventListener("keydown" , getKey);

		} , 350);

		return;
		
	} // if there's a fence
	
	if (nextClass == "rock") {
		moveRock(direction , nextLocation);
		return;
	} // if
	
	if (nextClass == "water") {
		
		// disables eventListener
		window.removeEventListener("keydown" , getKey);
		
		//show animation here
		setTimeout ( function () {
			
			// show the medium fire
			gridBoxes[nextLocation].className = "watermedium";
			
		} , 350);
		setTimeout ( function () {
			
			// show the small fire
			gridBoxes[nextLocation].className = "watersmall";
			
		} , 700);
		setTimeout ( function () {
			
			// remove the fire entirely
			gridBoxes[nextLocation].className = "";
		
			// re-enables eventListener
			window.addEventListener("keydown" , getKey);
		} , 1050);
		
		return;
		
	}//if
	
	// if there is a rider, add rider
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
	if (oldClassName.includes("bridge")) {
		gridBoxes[oldLocation].className = "bridge";
	} else {
		gridBoxes[oldLocation].className = "";
	} // else
	
	// build name of new class 
	newClass = (jumpOn) ? "horserider" : "horse";
	newClass += direction;
	
	// if there is a bridge in the next location, keep it
	if (gridBoxes[nextLocation].classList.contains("bridge")) {
		newClass += " bridge";
	} // if
	
	// move 1 spaces
	currentLocationOfHorse = nextLocation;
	gridBoxes[currentLocationOfHorse].className = newClass;
	
	// if it is an enemy
	if (nextClass.includes("enemy")) {
		document.getElementById("lose").style.display = "block";
		window.removeEventListener("keydown" , getKey);
		return;
	} // if
	
	// move up to next level if needed
	levelUp(nextClass);
	
} // tryToMove

// move up a level
function levelUp(nextClass) {
	if(nextClass == "flag") {
		document.getElementById("levelup").style.display = "block";
		clearTimeout(currentAnimation);
		setTimeout(function () {
			document.getElementById("levelup").style.display = "none";
			currentLevel++;
			if(currentLevel == levels.length){
				console.log("you beat the game");
			} else {
				loadLevel();
			} // else
		} , 1000);
	} // if
} // levelUp
	
// load levels 0 - maxlevel
function loadLevel() {
	let levelMap = levels[currentLevel];
	let animateBoxes;
	jumpOn = false;
	waterOn = false;
	strengthOn = false;
	
	// load the board
	for(i = 0; i < gridBoxes.length; i++ ) {
		gridBoxes[i].className = levelMap[i];
		if (levelMap[i].includes("horse")) {
			currentLocationOfHorse = i;
		} // if
	
	} // for
	
	animateBoxes = document.querySelectorAll(".animate");
	animateEnemy(animateBoxes , 0 , "right");
	
} // loadLevel

// animate enenmy left to right (could add up and down to this)
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
	
	if (boxes[index].className.includes("horse")) {
		document.getElementById("lose").style.display = "block";
		window.removeEventListener("keydown" , getKey);
		return;
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
			gridBoxes[currentLocationOfHorse].className = "horse" + direction;
			return; 
		} // if
		
		// if the next location of the rock is an impassable object, don't move
		if (gridBoxes[rockLocation - 1].className.includes("tree") || gridBoxes[rockLocation - 1].className.includes("water") || gridBoxes[rockLocation - 1].className.includes("fence") || gridBoxes[rockLocation - 1].className.includes("flag")) { 
			gridBoxes[currentLocationOfHorse].className = "horse" + direction;
			console.log("impassible"); 
			return; 
		} // if
		
		// remove the old horse
		gridBoxes[currentLocationOfHorse].className = "";
		
		// update the location of the horse
		currentLocationOfHorse --;
		
		// remove old rock and replace it with the horse
		gridBoxes[rockLocation].className = "horse" + direction;
		
		// update location of rock
		rockLocation --;
		
		// show new rock
		gridBoxes[rockLocation].className = "rock";
	} // if
	
	// right
	if (direction == "right") {
		
		// if out of bounds, don't move
		if (rockLocation % widthOfBoard == widthOfBoard - 1) { 
			gridBoxes[currentLocationOfHorse].className = "horse" + direction;
			return; 
		} // if
		
		// if the next location of the rock is an impassable object, don't move
		if (gridBoxes[rockLocation + 1].className.includes("tree") || gridBoxes[rockLocation + 1].className.includes("water") || gridBoxes[rockLocation + 1].className.includes("fence") || gridBoxes[rockLocation + 1].className.includes("flag")){ 
			gridBoxes[currentLocationOfHorse].className = "horse" + direction;
			console.log("impassible"); 
			return; 
		} // if
		
		// remove the old horse
		gridBoxes[currentLocationOfHorse].className = "";
		
		// update the location of the horse
		currentLocationOfHorse ++;
		
		// remove old rock and replace it with the horse
		gridBoxes[rockLocation].className = "horse" + direction;
		
		// update location of rock
		rockLocation ++;
		
		// show new rock
		gridBoxes[rockLocation].className = "rock";
	} // if
	
	// up
	if (direction == "up") {
		
		// if out of bounds, don't move
		if (rockLocation - widthOfBoard < 0) { 
			gridBoxes[currentLocationOfHorse].className = "horse" + direction;
			return; 
		} // if
		
		// if the next location of the rock is an impassable object, don't move
		if (gridBoxes[rockLocation - widthOfBoard].className.includes("tree") || gridBoxes[rockLocation - widthOfBoard].className.includes("water") || gridBoxes[rockLocation - widthOfBoard].className.includes("fence") || gridBoxes[rockLocation - widthOfBoard].className.includes("flag")) { 
			gridBoxes[currentLocationOfHorse].className = "horse" + direction;
			console.log("impassible"); 
			return; 
		} // if
		
		// remove the old horse
		gridBoxes[currentLocationOfHorse].className = "";
		
		// update the location of the horse
		currentLocationOfHorse -= widthOfBoard;
		
		// remove old rock and replace it with the horse
		gridBoxes[rockLocation].className = "horse" + direction;
		
		// update location of rock
		rockLocation -= widthOfBoard;
		
		// show new rock
		gridBoxes[rockLocation].className = "rock";
	} // if
	
	// down
	if (direction == "down") {
		
		// if out of bounds, don't move
		if (rockLocation + widthOfBoard >= widthOfBoard * widthOfBoard) { 
			gridBoxes[currentLocationOfHorse].className = "horse" + direction;
			return; 
		} // if
		
		// if the next location of the rock is an impassable object, don't move
		if (gridBoxes[rockLocation + widthOfBoard].className.includes("tree") || gridBoxes[rockLocation + widthOfBoard].className.includes("water") || gridBoxes[rockLocation + widthOfBoard].className.includes("fence") || gridBoxes[rockLocation + widthOfBoard].className.includes("flag")) { 
			gridBoxes[currentLocationOfHorse].className = "horse" + direction;
			console.log("impassible"); 
			return; 
		} // if
		
		// remove the old horse
		gridBoxes[currentLocationOfHorse].className = "";
		
		// update the location of the horse
		currentLocationOfHorse += widthOfBoard;
		
		// remove old rock and replace it with the horse
		gridBoxes[rockLocation].className = "horse" + direction;
		
		// update location of rock
		rockLocation += widthOfBoard;
		
		// show new rock
		gridBoxes[rockLocation].className = "rock";
	} // if
	
} // moveRock	
