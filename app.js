document.addEventListener('DOMContentLoaded', onReady);
document.addEventListener('keyup', kUp);
document.addEventListener('mousemove', mov);

function onReady(){
    gWd=document.getElementById("gWindow");
    gWd.onclick=onClick;
	gWindow=gWd.getContext('2d');
	gWindow.fillStyle = 'rgb(50, 50, 50)';
    gWindow.fillRect(0, 0, gWindow.canvas.width-1, gWindow.canvas.height-1);	
    
   // img = new Image();
   // img.src="image003.jpg";
  //  img.onload = function(){gWindow.drawImage(img,0,0,gWindow.canvas.width,gWindow.canvas.height);}
    render();
    renderstat();
   /* setTimeout(()=>{
    for (let i=0;i<world.length;i++){
        world[i].render(gWindow);
    }
    }
    ,3000);*/
}
//res="";
//var i=0;
function findXY(x,y){
    for (let i=0;i<world.length;i++){
        if (Math.hypot(world[i].x-x,world[i].y-y)<20){
            return i;
        }
    }
    return -1;
}

function findCity(x,y){
    var ind=findXY(x,y);
    if (ind==-1) {return false;}
    return world[ind];
}

function onClick(e){
    var cx = e.pageX - gWd.offsetLeft;
    var cy = e.pageY - gWd.offsetTop;
    
    //res=res+cx+" "+cy+" ";
    //res=res+String(findXY(cx,cy))+' ';
   // gm.playerList[gm.currentPlayer].city=world[findXY(cx,cy)];
//   if (!gm.curPlayer.goStep(findXY(cx,cy))){
 //   if (!gm.curPlayer.goSpec(findXY(cx,cy))){
 //       gm.curPlayer.goChart(findXY(cx,cy));
 //   }
//}
    var selCity=findCity(cx,cy);
    if (selCity){
        if (!gm.curPlayer.goStep(selCity)){
            if (!gm.curPlayer.goSpec(selCity)){
                gm.curPlayer.goChart(selCity);
            }
        }
    }
   // gWindow.fillStyle = 'rgb(200, 0, 0)';
    //gWindow.font = "bold 14pt Arial";
   // gWindow.fillText(cx+" "+cy,cx,cy);
  //  gWindow.fillRect(cx, cy, 10, 10);
    render();
    renderstat();
}

function kUp(kBoard){
 /*   gWindow.drawImage(img,0,0,gWindow.canvas.width,gWindow.canvas.height);
    //gWindow.fillStyle = 'rgb(50, 50, 50)';
    //gWindow.fillRect(0, 0, gWindow.canvas.width-1, gWindow.canvas.height-1);
    for (let i=0;i<world.length;i++){
        world[i].render(gWindow);
    }
	var key=kBoard.keyCode;
	//console.log(key);
	switch (key){
        case 87:res=res+","; gWindow.drawImage(img,0,0,gWindow.canvas.width,gWindow.canvas.height); world[i].render(gWindow); i++; break;
        case 83:(gm.currentPlayer++);gm.currentPlayer=gm.currentPlayer%gm.playerList.length;
        case 65:var ci=world[Math.floor(Math.random()*48)]; ci.infect(1,ci.color,[]);
    }
    console.log(gm.outbreaks);*/
}

function render(){
    //gWindow.drawImage(img,0,0,gWindow.canvas.width,gWindow.canvas.height);
    gWindow.fillStyle = 'rgb(50, 50, 50)';
    gWindow.fillRect(0, 0, gWindow.canvas.width-1, gWindow.canvas.height-1);
    for (let i=0;i<world.length;i++){
        world[i].render(gWindow,false);
        world[i].renderLines(gWindow);
    }
    for(let j=0;j<gm.playerList.length;j++){
        gm.playerList[j].render(gWindow,0);
    }
    gm.curPlayer.render(gWindow,1);
}

function renderstat(){
    gm.renderStat("info");
    gm.curPlayer.renderStat("stats",gm.currentPlayer);
    for(let j=0;j<gm.playerList.length;j++){
        if (j!=gm.currentPlayer){
            gm.playerList[j].renderStat("othr"+j,j);
        }
    }
}

function mov(e){
    var cx = e.pageX - gWd.offsetLeft;
    var cy = e.pageY - gWd.offsetTop;
    render();
    //var ind=findXY(cx,cy);
    //if (ind>-1){world[ind].render(gWindow,true);
    var selCity=findCity(cx,cy);
    if (selCity){selCity.render(gWindow,true);}
/*    for(let j=0;j<world[ind].nearList.length;j++){
        gWindow.beginPath();
        gWindow.moveTo(world[ind].x,world[ind].y);
        gWindow.lineTo(world[Number(world[ind].nearList[j])].x,world[Number(world[ind].nearList[j])].y);
        gWindow.stroke();
    }*/
   // }
}
function send(a){
    gm.curPlayer.doSendcard(a);
    renderstat();
}
function men(a){
    if (a==0){
        gm.curPlayer.goDirect();
    }
    if (a==1){
        gm.curPlayer.doCure(0);
    }
    if (a==2){
        gm.curPlayer.doCure(1);
    }
    if (a==3){
        gm.curPlayer.doCure(2);
    }
    if (a==4){
        gm.curPlayer.doCure(3);
    }
    if (a==5){
        gm.curPlayer.doBuild();
    }
    if (a==6){
        gm.curPlayer.doVaccine();
    }
    if (a==7){
        gm.curPlayer.doGetcard();
    }
    if (a==8){
        gm.curPlayer.doPlaycard();
        if (!gm.curPlayer.passed){gm.curPlayer.doPass();}
        gm.turn();
    }
    render();
    renderstat();
}