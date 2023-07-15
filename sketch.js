
var gameState = 0;  

var boy, boy_running, boy_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg, gameOver;
var restartImg, restart;
var play_button,play_buttonImg ;
var bgImg;

function preload(){
  boy_running = loadAnimation("boy1.gif","boy2.gif","boy3.gif","boy4.gif",);
  boy_collided = loadAnimation("boy_collided.gif");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  jumpSound = loadSound("jump.mp3"); 
  dieSound = loadSound("die.mp3"); 
  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")
  play_buttonImg = loadImage("blue-play-button.png")
  bgImg = loadImage("desert-background.avif")
}

function setup() {
  createCanvas(600, 200);

  play_button= createSprite(300,80,200,200)
  play_button.addImage(play_buttonImg);
  play_button.scale=0.15;
  boy = createSprite(50,155,20,50);
  boy.addAnimation("running", boy_running);
  boy.addAnimation("collided" ,boy_collided);
  boy.scale = 0.2;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
 
   restart = createSprite(300,160,20,20);
  restart.addImage(restartImg);
  restart.scale = 0.5;
 
  
  invisibleGround = createSprite(200,165,400,10);
  invisibleGround.visible = false;
  
  //creating Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  boy.setCollider("circle",0,0,50);   
  score = 0;
  
}

function draw() {
  
  background(bgImg);
  //displaying score
  text("Score: "+ score, 500,50);
  
  if(gameState === 0){
     hold();
    play_button.visible = true;
    gameOver.visible = false ;
    restart.visible = false ;
       if(mousePressedOver(play_button)){
        reset();
        gameState = 1;
        }
  }
  if(gameState === 1){
    gameOver.visible = false ;
    restart.visible = false ;
    play_button.visible = false;
   //move the ground
    ground.velocityX = -4;
    //scoring
    score = score + 1;
    //infinite ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& boy.y >= 140) {
        boy.velocityY = -9;
      jumpSound.play();
    }
    
    //add gravity
    boy.velocityY = boy.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(boy)){
        dieSound.play();
        gameState = 2;
    }
  }
   else if (gameState === 2) {
      gameOver.visible = true;
     restart.visible = true;
     play_button.visible = false;
     hold();
    
       
   }
   if(mousePressedOver(restart)){
    gameState=0
    }
 
  //stop boy from falling down
  boy.collide(invisibleGround);
  
 
  drawSprites();
}

function hold(){
  ground.velocityX = 0;
  boy.velocityY = 0
  //change the boy animation
  boy.changeAnimation("collided", boy_collided);
 
 obstaclesGroup.setVelocityXEach(0);
 cloudsGroup.setVelocityXEach(0);
 obstaclesGroup.setLifetimeEach(-1);
 cloudsGroup.setLifetimeEach(-1);
}

function reset(){
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  boy.changeAnimation("running",boy_running);
  
  score = 0;
  
}
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -6;
   
    //generate random obstacles
    var rn = Math.round(random(1,6));
    switch(rn) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 150 ;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -4;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    boy.depth = cloud.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

