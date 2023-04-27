var c = document.getElementById("Canvas");
var ctx = c.getContext("2d");


class Ball{
	constructor(){
    	this.radius = 15;
      	this.posX = c.width / 2;
        this.posY = c.height / 2;
        this.speed = 1;
        this.colour = 'yellow'

    }
  	draw(){

        //ctx.beginPath();
        ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = this.colour;
        ctx.fill();

    }
}

class Paddle{
	constructor(posX, posY, paddleHeight){
      	this.posX = posX;
        this.posY = posY;
        this.speed = 5;
        this.colour = 'white'
        this.width = 15;
        this.height = paddleHeight;

    }
  	draw(){

        ctx.beginPath();
        ctx.rect(this.posX, this.posY, this.width, this.height);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}


function run_game(){
    const ball = new Ball()

    paddleHeight = 80;
    const paddleL = new Paddle(30, (c.height - paddleHeight)/2, paddleHeight)
    const paddleR = new Paddle(c.width - 45, (c.height - 80)/2, paddleHeight)

    ball.draw()
    paddleL.draw()
    paddleR.draw()


}


run_game()