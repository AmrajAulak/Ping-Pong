var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");
leftScore = 0;
rightScore = 0;


class Ball{
	constructor(){
    	this.radius = 15;
      	this.posX = c.width / 2;
        this.posY = c.height / 2;
        this.theta = Math.floor(Math.random() * 46);
        this.speed = 3;
        this.direction = this.set_direction();
        this.velX = - this.speed * Math.cos(this.theta * Math.PI / 180);
        this.velY = this.direction * this.speed * Math.sin(this.theta * Math.PI / 180);
        this.colour = 'yellow'
        this.speedIncrease = 0.2;

    }

    set_direction(){
        let direction = 0;

        if (Math.random() < 0.5){
            direction = -1
        } else{
            direction = 1
        }
        return direction;

    }

    move(){
        this.posX += this.velX;
        this.posY += this.velY;
    }

    increase_velocity(){
        if (this.velX > 0){
            this.velX += this.speedIncrease
        }
        if (this.velY > 0){
            this.velY += this.speedIncrease
        }
        if (this.velX < 0){
            this.velX -= this.speedIncrease
        }
        if (this.velY < 0){
            this.velX -= this.speedIncrease
        }
    }

  	draw(){

        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.setLineDash([]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black'
        ctx.stroke();
    }
}

class Paddle{
	constructor(posX, posY, paddleHeight, colour){
      	this.posX = posX;
        this.posY = posY;
        this.speed = 10;
        this.colour = colour;
        this.width = 15;
        this.height = paddleHeight;
    }

    moveUp(){
        if (this.posY > 0){
            this.posY -= this.speed;
        }
    }

    moveDown(){
        if (this.posY <= (c.height-this.height-this.speed)){
            this.posY += this.speed;
        }
    }

  	draw(){
        ctx.beginPath();
        ctx.rect(this.posX, this.posY, this.width, this.height);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black'
        ctx.stroke();
    }
}

function reset_game(intervalID){
    document.getElementById("Score").innerHTML = leftScore + " : " + rightScore;
    clearInterval(intervalID);
    run_game()
}

function check_collision(ball, paddleL, paddleR, intervalID){
    if ((ball.posY - ball.radius) <= 0){
        ball.velY = ball.velY * -1;
    }

    if ((ball.posY + ball.radius) >= c.height){
        ball.velY = ball.velY * -1;
    }

    if ((ball.posX + ball.radius) < 0){
        rightScore++;
        reset_game(intervalID)
        
    }

    if ((ball.posX - ball.radius) > c.width){
        leftScore++;
        reset_game(intervalID)
    }

    if ((ball.posY >= paddleL.posY) && (ball.posY <= (paddleL.posY + paddleL.height))){
        if ((ball.posX - ball.radius) <= (paddleL.posX + paddleL.width)){
            ball.posX = paddleL.posX + paddleL.width + ball.radius
            ball.velX = ball.velX * -1;
            ball.increase_velocity()
        }
    }

    if ((ball.posY >= paddleR.posY) && (ball.posY <= (paddleR.posY + paddleR.height))){
        if ((ball.posX + ball.radius) >= (paddleR.posX)){
            ball.posX = paddleR.posX - ball.radius
            ball.velX = ball.velX * -1;
            ball.increase_velocity()
        }
    }
    
}

function draw_net(){
    ctx.beginPath();
    ctx.moveTo(c.width/2, 0);
    ctx.lineTo(c.width/2, c.height);
    ctx.strokeStyle = 'white'
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2
    ctx.stroke();
}

function render(ball, paddleL, paddleR){
    ctx.clearRect(0, 0, c.width, c.height);
    draw_net()
    ball.draw()
    paddleL.draw()
    paddleR.draw()
}


function run_game(){
    const ball = new Ball()

    paddleHeight = 80;
    this.speed = 10;
    const paddleL = new Paddle(30, (c.height - paddleHeight)/2, paddleHeight, 'DodgerBlue')
    const paddleR = new Paddle(c.width - 45, (c.height - 80)/2, paddleHeight, 'Crimson')
    
    var start = false;


    document.body.addEventListener('keydown', function(event) {
        const key = event.key;
        switch (key) {
            
            case "ArrowUp":
                paddleR.moveUp()
                break;
            case "ArrowDown":
                paddleR.moveDown()
                break;
            case "w":
                paddleL.moveUp()
                break;
            case "s":
                paddleL.moveDown()
                break;
            case "Enter":
                start = true
                break
        }

    });

 
   var intervalID = setInterval(update, 20)
   render(ball, paddleL, paddleR);


   function update(){
    if (start){
        ball.move()
        check_collision(ball, paddleL, paddleR, intervalID)
        render(ball, paddleL, paddleR);
    }
    //requestAnimationFrame(update)
    }

}

run_game()