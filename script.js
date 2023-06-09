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
        this.directionY = this.set_direction();
        this.velX = - this.speed * Math.cos(this.theta * Math.PI / 180);
        this.velY = this.directionY * this.speed * Math.sin(this.theta * Math.PI / 180);
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

    increase_speed(){
        this.speed += this.speedIncrease;
    }

    paddle_hit(paddle_center, player){
        let range = [10, 25, 35] 
        let y_direction = ""

        if ((Math.abs(this.posY - paddle_center)) <= range[0]){
            this.theta = 0
        } else if ((Math.abs(this.posY - paddle_center)) <= range[1]){
            this.theta = 20
        } else if ((Math.abs(this.posY - paddle_center)) <= range[2]){
            this.theta = 40
        } else {
            this.theta = 65
        }

        if ((this.posY - paddle_center) < 0){
            y_direction = "up"
        } else{
            y_direction = "down"
        }


        if (player === "left"){
            this. velX = this.speed * Math.cos(this.theta * Math.PI / 180);
        } else{
            this. velX = -1 * this.speed * Math.cos(this.theta * Math.PI / 180);
        }

        if (y_direction === "up"){
            this. velY = -1 * this.speed * Math.sin(this.theta * Math.PI / 180);
        } else{
            this. velY = 1 * this.speed * Math.sin(this.theta * Math.PI / 180);
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
	constructor(posX, posY, paddleHeight, colour, speed){
      	this.posX = posX;
        this.posY = posY;
        this.speed = speed;
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
            let left_center = paddleL.posY + (paddleL.height / 2)
            ball.increase_speed();
            ball.paddle_hit(left_center, "left")
        }
    }

    if ((ball.posY >= paddleR.posY) && (ball.posY <= (paddleR.posY + paddleR.height))){
        if ((ball.posX + ball.radius) >= (paddleR.posX)){
            ball.posX = paddleR.posX - ball.radius
            let right_center = paddleR.posY + (paddleR.height / 2)
            ball.increase_speed();
            ball.paddle_hit(right_center, "right")
        }
    }
    
}

function AI_move(ball, paddleR){
    if (ball.posY < paddleR.posY){
        paddleR.moveUp()
    }

    if (ball.posY > (paddleR.posY + paddleR.height)){
        paddleR.moveDown()
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
    paddleL_speed = 10;
    paddleR_speed = 4;
    const paddleL = new Paddle(30, (c.height - paddleHeight)/2, paddleHeight, 'DodgerBlue', paddleL_speed)
    const paddleR = new Paddle(c.width - 45, (c.height - 80)/2, paddleHeight, 'Crimson', paddleR_speed)
    
    var start = false;


    document.body.addEventListener('keydown', function(event) {
        const key = event.key;
        switch (key) {
            
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
        AI_move(ball, paddleR)
        check_collision(ball, paddleL, paddleR, intervalID)
        render(ball, paddleL, paddleR);
    }
    //requestAnimationFrame(update)
    }

}

run_game()