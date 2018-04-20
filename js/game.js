//to exit 
function logout(){
    var c=confirm("Are you sure you want exit ?")
    if(c){window.location = "login.html"}
}

//Game code
var canvas, canvascontext;
var bX,bY;
var ballSpeedX=-5,ballSpeedY=3, P1score=0,P2score=0, paddle1Y=250,paddle2Y=250;
var ballSpeedDelta=0.35,compPadSpeed=9,x=0, PADDLE_LENGTH=100, WINSCORE=1;
const PADDLE_WIDTH=10;
var showWinDisp=false, start=true;

window.onload=function() {
    canvas=document.getElementById("gamecanvas")
    canvascontext=canvas.getContext("2d")
    canvascontext.font="25px Arial";

     // Retrieve and set difficulty
     var fps = localStorage.getItem("diff");  
     if(fps==50){
          ballSpeedDelta=0.25; compPadSpeed=9; x=0; WINSCORE=5;
        }
     else if(fps==60){ 
         ballSpeedDelta=0.35; compPadSpeed=12; x=0; WINSCORE=5;
        }
     else if(fps==75){ 
         ballSpeedDelta=0.4; compPadSpeed=15; x=25; WINSCORE=5;
        }
     else if(fps==90){ 
         ballSpeedDelta=0.4; compPadSpeed=18; x=55; WINSCORE=3;
        }    


    ballReset();
    setInterval(function (){
                moveBall();
                drawEverything();
            },1000/fps);

    canvas.addEventListener('mousedown',
            function(evt){
                if(start){
                    start=false;
                }
                if(showWinDisp){
                    P1score=P2score=0;
                    showWinDisp=false;
                }
            });

    canvas.addEventListener('mousemove',
            function(evt){
                var mousePos=calcMousePos(evt);
                paddle1Y=mousePos.y-PADDLE_LENGTH/4.5;
            });        
}    

function calcMousePos(evt){
    //evt is mouse info
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return{
        x:mouseX,
        y:mouseY
        //(x,y) of mouse is returned to functionlistener
    };
}
function compMovement(){
    if(paddle2Y+PADDLE_LENGTH/1.5<bY-15 && bX>canvas.width/6){
        paddle2Y+=compPadSpeed;
    }
    else if(paddle2Y+PADDLE_LENGTH/1.5>bY+15  && bX>canvas.width/6){
        paddle2Y-=compPadSpeed;
    }

}
function moveBall(){

    if(showWinDisp){
        return;
    }

    compMovement();
    bX+=ballSpeedX;
    bY+=ballSpeedY;
    //change X
    //P1
    if(bX<25){
        if(bY>paddle1Y && bY<paddle1Y+PADDLE_LENGTH){
            ballSpeedX=-ballSpeedX;
            //change speed upon where it hits
            var deltaY=bY-(paddle1Y+PADDLE_LENGTH/2);
            ballSpeedY=deltaY * ballSpeedDelta;
        }
        else{
            P2score++;
            ballReset();       
        }
    }
    //P2
    if(bX>canvas.width-25){
        if(bY>paddle2Y && bY<paddle2Y+PADDLE_LENGTH){
            ballSpeedX=-ballSpeedX;
            //change speed upon where it hits
            var deltaY=bY-(paddle2Y+PADDLE_LENGTH/2);
            ballSpeedY=deltaY*ballSpeedDelta;
        }
        else{
            P1score++;
            ballReset();
        }
    }
    
    //change Y  P1,P2
    if(bY>canvas.height){
        ballSpeedY=-ballSpeedY;
    }
    if(bY<0){
        ballSpeedY=-ballSpeedY;
    }
}

function ballReset(){
    if(P1score>=WINSCORE || P2score>=WINSCORE){
        showWinDisp=true;
    }
    ballSpeedX=-ballSpeedX;
    ballSpeedY=3;
    bX=canvas.width/2;
    bY=canvas.height/2;
} 

function colorRect(leftX,topY,width,height,color){
    canvascontext.fillStyle=color;
    canvascontext.fillRect(leftX,topY,width,height);
}

function colorBall(X,Y,r){
    canvascontext.fillStyle="white";
    canvascontext.beginPath();
    canvascontext.arc(X,Y,r,0,Math.PI*2,true);
    canvascontext.fill();
}

function drawEverything(){ 
    canvascontext.font="25px Arial";
    colorRect(0,0,canvas.width,canvas.height,'black');
    canvascontext.fillStyle="yellow";
    if(start){
        canvascontext.fillText("Click to Start !",canvas.width/2-70,250);
        return;
    }

    if(showWinDisp){
        if(P1score>=WINSCORE){
            canvascontext.fillText("Congratulations You WON !",canvas.width/2-115,canvas.height/2-50);
        }
        else{
            canvascontext.fillText("You LOST !",canvas.width/2-55,canvas.height/2-50);
        }
        canvascontext.fillText("Click to Continue",canvas.width/2-85,300);
        return;
    }
    colorRect(0,0,canvas.width,canvas.height,'limegreen');
    canvascontext.font="16px Arial";
    //draw net
    for(var i=0;i<canvas.height;i+=50){
        colorRect(canvas.width/2,i+15,3,20,"white");
    }
    //left pad
    colorRect(10,paddle1Y,PADDLE_WIDTH,PADDLE_LENGTH-x/0.8,'red');
    //right pad CPU
    colorRect(canvas.width-PADDLE_WIDTH-10,paddle2Y,PADDLE_WIDTH,PADDLE_LENGTH+x/3,'blue');
    //ball
    colorBall(bX,bY,10);
    //score p1
    canvascontext.fillStyle="black";
    canvascontext.fillText("P1 score : ",100,50);
    canvascontext.fillText(P1score,180,50);
    //score p2
    canvascontext.fillText("CPU score : ",canvas.width-240,50);
    canvascontext.fillText(P2score,canvas.width-145,50);
}