var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");


class Ball{
	constructor(){
    	this.radius = 15;
      	this.posX = c.width / 2;
        this.posY = c.height / 2;
        this.theta = Math.floor(Math.random() * 91);
        this.speed = 5;
        this.direction = this.set_direction();
        this.velX = - this.speed * Math.cos(this.theta * Math.PI / 180);
        this.velY = this.direction * this.speed * Math.sin(this.theta * Math.PI / 180);
        this.colour = 'yellow'

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

  	draw(){

        ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.setLineDash([]);
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Paddle{
	constructor(posX, posY, paddleHeight){
      	this.posX = posX;
        this.posY = posY;
        this.speed = 10;
        this.colour = 'white'
        this.width = 15;
        this.height = paddleHeight;
        this.score = 0

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
        ctx.stroke();
    }
}

function check_collision(ball, paddleL, paddleR){
    if ((ball.posY - ball.radius) <= 0){
        ball.velY = ball.velY * -1;
    }

    if ((ball.posY + ball.radius) >= c.height){
        ball.velY = ball.velY * -1;
    }

    if ((ball.posX - ball.radius) <= 0){
        paddleR.score++;
        document.getElementById("Score").innerHTML = paddleL.score + " : " + paddleR.score;
        run_game()
    }

    if ((ball.posX + ball.radius) >= c.width){
        paddleL.score++;
        document.getElementById("Score").innerHTML = paddleL.score + " : " + paddleR.score;
        run_game()
    }

    if ((ball.posY >= paddleL.posY) && (ball.posY <= (paddleL.posY + paddleL.height))){
        if ((ball.posX - ball.radius) <= (paddleL.posX + paddleL.width)){
            ball.velX = ball.velX * -1;
        }
    }

    if ((ball.posY >= paddleR.posY) && (ball.posY <= (paddleR.posY + paddleR.height))){
        if ((ball.posX + ball.radius) >= (paddleR.posX)){
            ball.velX = ball.velX * -1;
        }
    }
    
}

function draw_net(){
    ctx.beginPath();
    ctx.moveTo(c.width/2, 0);
    ctx.lineTo(c.width/2, c.height);
    //ctx.strokeStyle = 'white'
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 1
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
    const paddleL = new Paddle(30, (c.height - paddleHeight)/2, paddleHeight)
    const paddleR = new Paddle(c.width - 45, (c.height - 80)/2, paddleHeight)

    document.body.addEventListener('keydown', function(event) {
        var str = "";
        const key = event.key;
        switch (key) {
            
            case "ArrowUp":
                str = 'Up';
                paddleR.moveUp()
                break;
            case "ArrowDown":
                str = 'Down';
                paddleR.moveDown()
                break;
            case "w":
                str = 'W';
                paddleL.moveUp()
                break;
            case "s":
                str = 'S';
                paddleL.moveDown()
                break;
        }

        console.log(str)
    });

    const intervalID = setInterval(update, 50)//Runs the "func" function every second

   // window.requestAnimationFrame(render(ball, paddleL, paddleR));

   function update(){
    ball.move()
    check_collision(ball, paddleL, paddleR)
    render(ball, paddleL, paddleR);
    }


}


run_game()