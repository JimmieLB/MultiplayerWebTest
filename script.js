let peer = new Peer();
let identification = "Loading ID...";
let loaded = false;
let conn = null;
let frameRequest = 2;//How many frames per Data send.
let playerData;
let player2Data;
let speed = 10;
function setup(){
	createCanvas(windowWidth,windowHeight);
	textAlign(CENTER);
	playerData = {
		x : width/2,
		y : height/2,
		xvel : 0,
		yvel : 0,
		size: 20
	};
	player2Data = playerData;
}

function draw(){
	background(0);
	fill(255);
	if(conn){
		if(frameCount % frameRequest == 0){
			conn.send(playerData);
		}
		playerData.x += playerData.xvel;
		playerData.y += playerData.yvel;
		playerData.xvel *= .95;
		playerData.yvel *= .95;
		player2Data.x += player2Data.xvel;
		player2Data.y += player2Data.yvel;
		player2Data.xvel *= .95;
		player2Data.yvel *= .95;
		fill(100,100,255);
		ellipse(playerData.x,playerData.y,playerData.size,playerData.size);
		fill(255,100,100);
		ellipse(player2Data.x,player2Data.y,player2Data.size,player2Data.size);
	} else {
		textSize(30);
		text("Join to play",width/2,height/2);
	}
}


//Joins another player using their uid
function joinPlayer(){
	let p2id = document.getElementById("input").value;
	conn = peer.connect(p2id);
	console.log(p2id);
	connected();
	document.getElementById("list").style.display = "none";
	document.getElementById("identification").style.display = "none";
}
//Receives a join request.
peer.on('connection', function(c) {
	conn = c;
	console.log("Connected");
	connected();
	document.getElementById("list").style.display = "none";
	document.getElementById("identification").style.display = "none";
});

// Gives the user a unique id.
peer.on('open', function(id) {
	document.getElementById("identification").innerHTML = "You're id: " + id;
	identification = id;
	loaded = true;
});

//error handling
peer.on("error", function(err){
	console.log(err);
});

//Receive Game Data
function connected(){
	conn.on('data', function(data){
		player2Data = data;
	});
}

//keyEvents

function keyPressed(){
	if(keyCode == 87 || keyCode == 38){//UP
		playerData.yvel = -speed;
	}
	if(keyCode == 83 || keyCode == 40){//DOWN
		playerData.yvel = speed;
	}
	if(keyCode == 65 || keyCode == 37){//LEFT
		playerData.xvel = -speed;
	}
	if(keyCode == 68 || keyCode == 39){//RIGHT
		playerData.xvel = speed;
	}

	if(keyCode == 32){// Destroys connectiong and Peer
		conn.close();
		peer.destroy();
	}
}