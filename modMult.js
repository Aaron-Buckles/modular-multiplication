let mainColor = "#DCDCDC";
let mainWidth = 2.5;

let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;

let numberOfPointsTextbox = document.getElementById("numberOfPoints");
let numberOfPointsSlider = document.getElementById("numberOfPointsSlider");
let multiplierTextbox = document.getElementById("multiplier");
let multiplierSlider = document.getElementById("multiplierSlider");

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
let maxSize = canvas.width;
let minSize = 0;

window.addEventListener("resize", function(){
	update(numberOfPointsTextbox.value, multiplierTextbox.value);
});


function resizeCanvas(resize=false) {
	if (windowWidth != window.innerWidth || windowHeight != window.innerHeight || resize) {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;

		// clamp the canvas size between the min and max sizes
		var fitWidth = Math.max(Math.min(Math.floor(window.innerWidth / 2), maxSize), minSize);
		var fitHeight = Math.max(Math.min(Math.floor(window.innerHeight / 2), maxSize), minSize);
		var canvasSize = Math.max(fitWidth, fitHeight);

		canvas.width = canvasSize;
		canvas.height = canvasSize;
	}
}


function calcPointRadians(numberOfPoints){
	let points = [];
	let radians = null;
	let offset = Math.PI / 2;

	for(let i = 0; i < numberOfPoints; i++){
		if(i == 0){
			radians = 0 + offset;
		}
		else{
			radians = ((Math.PI * 2) / (numberOfPoints / i)) + offset;
		}
		points.push(radians);
	}

	return points;
}


function calcPoints(numberOfPoints){
	let pointRadians = calcPointRadians(numberOfPoints);
	let points = [];

	for (let i = 0; i < pointRadians.length; i++){
		let x = Math.cos(pointRadians[i]);
		let y = Math.sin(pointRadians[i]);
		points.push([x, y]);
	}

	return points;
}


function drawDot(x, y, r, color="black"){
	ctx.beginPath();
	ctx.arc(x, y, r, 0, (Math.PI * 2));
	ctx.fillStyle = color;
	ctx.fill();
}


function drawLine(x1, y1, x2, y2, color="black", thiccness=1){
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.strokeStyle = color
	ctx.lineWidth = thiccness;
	ctx.stroke();
}


function calcPointCoords(points){
	pointCoords = [];

	for(let i = 0; i < points.length; i++){
		let halfCanvas = canvas.width / 2;
		let pointX = points[i][0];
		let pointY = points[i][1];

		let x = (pointX * halfCanvas) + halfCanvas;
		let y = (pointY * halfCanvas) + halfCanvas;

		pointCoords.push([x, y]);
	}

	return pointCoords;
}


function drawPoints(pointCoords){
	for(let i = 0; i < pointCoords.length; i++){
		drawDot(pointCoords[i][0], pointCoords[i][1], 2, "red");
	}
}


function drawLines(pointCoords, multiplier, numberOfPoints){
	for(let i = 0; i < pointCoords.length; i++){
		let otherPoint = (i * multiplier) % numberOfPoints;

		let x1 = pointCoords[i][0];
		let y1 = pointCoords[i][1];
		let x2 = pointCoords[otherPoint][0];
		let y2 = pointCoords[otherPoint][1];

		drawLine(x1, y1, x2, y2, color=mainColor, thiccness=mainWidth);
	}
}


function drawCircleOutline(){
	ctx.beginPath();
	ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2, 0, (Math.PI * 2));
	ctx.strokeStyle = mainColor;
	ctx.lineWidth = mainWidth;
	ctx.stroke();
}


function updateTextbox(){
	let numberOfPoints = numberOfPointsTextbox.value;
	let multiplier = multiplierTextbox.value;

	console.log(numberOfPoints);
	console.log(numberOfPointsTextbox.max);

	if(parseInt(numberOfPoints) > parseInt(numberOfPointsTextbox.max)){
		numberOfPointsTextbox.value = numberOfPointsTextbox.max;
		numberOfPoints = numberOfPointsTextbox.max;
	}else if(parseInt(numberOfPoints) < parseInt(numberOfPointsTextbox.min)){
		numberOfPointsTextbox.value = numberOfPointsTextbox.min;
		numberOfPoints = numberOfPointsTextbox.min;
	}

	if(parseInt(multiplier) > parseInt(multiplierTextbox.max)){
		multiplierTextbox.value = multiplierTextbox.max;
		multiplier = multiplierTextbox.max;
	}else if(parseInt(multiplier) < parseInt(multiplierTextbox.min)){
		multiplierTextbox.value = multiplierTextbox.min;
		multiplier = multiplierTextbox.min;
	}

	numberOfPointsSlider.value = numberOfPoints;
	multiplierSlider.value = multiplier;

	update(numberOfPoints, multiplier);
}


function updateSlider(){
	let numberOfPoints = numberOfPointsSlider.value;
	let multiplier = multiplierSlider.value;

	numberOfPointsTextbox.value = numberOfPoints;
	multiplierTextbox.value = multiplier;

	update(numberOfPoints, multiplier);
}


function update(numberOfPoints, multiplier) {
	resizeCanvas();
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let pointCoords = calcPointCoords(calcPoints(numberOfPoints));

	//drawPoints(pointCoords);
	drawLines(pointCoords, multiplier, numberOfPoints);
	drawCircleOutline();
}


resizeCanvas(true);
update(162, 218);