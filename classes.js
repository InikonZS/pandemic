class game {
    constructor(players, epidCards) {
        this.RATE=[2,2,2,3,3,4,4,4];
        this.outbreaks=0;
        this.infectionMark=0;
        this.playerList=players;
        this.currentPlayer=0;
        this.vaccine=[0,0,0,0];

        this.cardsInfection=mix(infectCardList);
        this.cardsInfectionLeft=[];
        this.cardsPlay=mix(playCardList);
        this.cardsPlayLeft=[];

        for (let i=0; i<this.playerList.length;i++){
            for (let j=0;j<(6-this.playerList.length);j++){
                var card=this.cardsPlay.pop();
                playerList[i].cards.push(card);
            }
        }
        this.cardsPlay=this.cardsPlay.concat(epidCards);
        this.cardsPlay=mix(this.cardsPlay);

        this.state="LIVE";
        world[0].station=true;
        for (let i=0;i<3;i++){
            var card=this.cardsInfection.pop();
            world[card.id].infect(3,world[card.id].color,[]);
            this.cardsInfectionLeft.push(card);
        }
        for (let i=0;i<3;i++){
            var card=this.cardsInfection.pop();
            world[card.id].infect(2,world[card.id].color,[]);
            this.cardsInfectionLeft.push(card);
        }
        for (let i=0;i<3;i++){
            var card=this.cardsInfection.pop();
            world[card.id].infect(1,world[card.id].color,[]);
            this.cardsInfectionLeft.push(card);
        }
        this.mergeCards();
    }
    get curPlayer(){
        return this.playerList[this.currentPlayer];
    }
    get infectionRate(){
        return this.RATE[this.infectionMark];
    }
    vacc(color){
        if (this.vaccine[color]==0){
            this.vaccine[color]=1;
            return true;
        }
        return false;
    }
    testWin(){
        if (this.vaccine[0]+this.vaccine[1]+this.vaccine[2]+this.vaccine[3]==4) {
            this.state="WIN";
            console.log("WIN!!!");
        }
    }
    finish(){
        this.state="DEATH";
        console.log("finished");
    }
    infectionMarkInc(){
        if ((this.infectionMark)<7){
            this.infectionMark++;
        }
    }
    outbreak(){
        if (this.outbreaks<8){
            this.outbreaks++;
        }
        else {
            this.finish();
        }
    }
    mergeCards(){
        this.cardsInfection=this.cardsInfection.concat(this.cardsInfectionLeft);
        this.cardsInfectionLeft=[];
        this.cardsInfection=mix(this.cardsInfection);
    }
    turn(){
      /*  for (let i=0;i<2;i++){
            if ((this.cardsPlay.length)==0){this.finish()} else {
                var card=this.cardsPlay.pop();
                if (card.name=="EPID"){
                    this.infectionMarkInc();
                    var card_=this.cardsInfection.pop();
                    world[card_.id].infect(3,world[card_.id].color,[]);
                    this.cardsInfectionLeft.push(card_);
                    this.mergeCards();    
                } else {
                    this.playerList[this.currentPlayer].cards.push(card);
                }
            }
        }
        */
        if (this.curPlayer.cards.length<8){
            for (let i=0;i<this.infectionRate;i++){
                if ((this.cardsInfection.length)==0){this.mergeCards();}

                var card=this.cardsInfection.pop();
                world[card.id].infect(1,world[card.id].color,[]);
                this.cardsInfectionLeft.push(card);
            }
            this.curPlayer.steps=4;
            this.curPlayer.passed=false;
            this.currentPlayer++;
            this.currentPlayer=this.currentPlayer%this.playerList.length;
        } else {console.log("You can't turn with more 7 cards");}
    }

    renderStat(st){
        var el=document.getElementById(st);  
        el.innerHTML="";
            el.innerHTML+="<div class='item'> распространение: "+this.infectionMark+" / 7</div>";
            el.innerHTML+="<div class='item'> вспышек: "+this.outbreaks+" / 8</div>";
            el.innerHTML+="<div class='item'> вакцины с,ж,ч,к: "+this.vaccine.toString()+"</div>";
            el.innerHTML+="<div class='item'> карт осталось: "+this.cardsPlay.length+"</div>";
            el.innerHTML+="<div class='item'> статус: "+this.state+"</div>";

           /* if (this.cards[i].select==true){
                el.innerHTML+="<div onclick='selecti("+i+","+j+")' class='item sel tp"+this.cards[i].color+"'>"+this.cards[i].name+"</div>"; 
            } else {
                el.innerHTML+="<div onclick='selecti("+i+","+j+")' class='item tp"+this.cards[i].color+"'>"+this.cards[i].name+"</div>";
            }  */
        // this.cards[i].render(el,i,j);
    }
}



class city {
    constructor (name, color, nearList, x, y) {
        this.name=name;
        this.color=color;
        this.nearList=nearList;
        //this.near=this.loadNear();
        this.station=false;
        this.x=x;
        this.y=y;
        this.infection=[0,0,0,0];
    }
    get near(){
        var res=[];
        for (let i=0;i<this.nearList.length;i++){
            res.push(world[Number(this.nearList[i])]);  
        }
        return res;
    }
    isNear(target){
        var nl=this.near;
        for (let i=0;i<nl.length;i++){
            if (target.name==nl[i].name){return true;}
        }
        return false;
    }
    infect(cn,color,imun){
        if (imun.indexOf(this.name)==-1){
        imun.push(this.name);
        this.infection[color]+=cn;
        for (let i=0;i<this.infection.length;i++){
            if (this.infection[i]>3){
                this.infection[i]=3;
              //  gm.outbreaks++;
                gm.outbreak();
                console.log("outbreak "+gm.outbreaks);
               // if (gm.outbreaks<7){
                    for (let j=0;j<this.nearList.length;j++){
                      world[Number(this.nearList[j])].infect(1,color,imun);
                  }
                //} else 
            }    
        }
        }
    }
    renderLines(gWindow){
        for(let i=0;i<this.nearList.length;i++){
            if (Math.hypot(Number(this.x)-Number(this.near[i].x),Number(this.y)-Number(this.near[i].y))<400){
                gWindow.beginPath();
                gWindow.moveTo(Number(this.x),Number(this.y));
                gWindow.lineTo(world[Number(this.nearList[i])].x, world[Number(this.nearList[i])].y);
                gWindow.stroke();
            }
            else {
                //if (this.name == "San-Francisco")
                gWindow.fillText("to "+this.near[i].name,Number(this.x),Number(this.y)-26);
            }
        }
    }
    render(gWindow, active){
        

        gWindow.fillStyle = 'rgb(200, 200, 200)';
        gWindow.beginPath();
        if (this.station){
            gWindow.arc(this.x,this.y,16,0,Math.PI*2);
        } else {
            gWindow.arc(this.x,this.y,11,0,Math.PI*2);    
        }
        gWindow.fill();
        gWindow.closePath();
        if (active == false) {
            switch (this.color){
                case 0:gWindow.fillStyle = 'rgb(0, 0, 100)'; break;
                case 1:gWindow.fillStyle = 'rgb(100, 100, 0)'; break;
                case 2:gWindow.fillStyle = 'rgb(0, 0, 0)'; break;
                case 3:gWindow.fillStyle = 'rgb(100, 0, 0)'; break;
            }
        } else {
            switch (this.color){
                case 0:gWindow.fillStyle = 'rgb(0, 0, 200)'; break;
                case 1:gWindow.fillStyle = 'rgb(200, 200, 0)'; break;
                case 2:gWindow.fillStyle = 'rgb(50, 50, 50)'; break;
                case 3:gWindow.fillStyle = 'rgb(200, 0, 0)'; break;
            }
        }
        gWindow.font = "bold 10pt Arial";

        gWindow.beginPath();
        gWindow.arc(this.x,this.y,10,0,Math.PI*2);
        gWindow.fill();
        gWindow.closePath();
        gWindow.fillRect(this.x, this.y, 10, 10);
        gWindow.fillText(this.name, this.x, this.y-16);
        gWindow.strokeText(this.name, this.x, this.y-16);
        var sh=0;
        for (let i=0;i<this.infection.length;i++){
            switch (i){
                case 0:gWindow.fillStyle = 'rgb(0, 0, 100)'; break;
                case 1:gWindow.fillStyle = 'rgb(100, 100, 0)'; break;
                case 2:gWindow.fillStyle = 'rgb(0, 0, 0)'; break;
                case 3:gWindow.fillStyle = 'rgb(100, 0, 0)'; break;
             }
            for (let j=0;j<this.infection[i];j++){
                gWindow.fillRect(Number(this.x)+sh*9, Number(this.y)+16, 7, 7);
                gWindow.strokeRect(Number(this.x)+sh*9, Number(this.y)+16, 7, 7);
                //console.log("drawed"+ sh);
                sh++;
            }
        }
    }
}
//


class card{
    constructor(id, name){
        this.name=name;
        this.id=id;
        this.select=false;
    }
    get city(){
        return world[this.id];
    }
    setColor(color){
        this.color=color;
    }
    render(el,i,j){
        if (this.name[0]!="_"){
            if (this.select==true){
                el.innerHTML+="<div onclick='selecti("+i+","+j+")' class='item sel tp"+this.color+"'>"+this.name+"</div>"; 
            } else {
                el.innerHTML+="<div onclick='selecti("+i+","+j+")' class='item tp"+this.color+"'>"+this.name+"</div>";
            }      
        } else {
            if (this.select==true){
                el.innerHTML+="<div onclick='selecti("+i+","+j+")' class='item sel tp"+4+"'>"+this.name+"</div>"; 
            } else {
                el.innerHTML+="<div onclick='selecti("+i+","+j+")' class='item tp"+4+"'>"+this.name+"</div>";
            }  
        }
    }
}


function rand(a){
    return Math.trunc(Math.random()*a);
}

function mix(ar_){
    var ar=ar_.concat([]);
    var ai;
    var bi;
    var buf;
    for (let i=0;i<2000;i++){
        ai=rand(ar.length);
        bi=rand(ar.length);
        buf=ar[ai];
        ar[ai]=ar[bi];
        ar[bi]=buf;
    }
    return ar;
}

/*function select(a){
    gm.curPlayer.cards[a].select=!gm.curPlayer.cards[a].select;
    console.log(gm.curPlayer.cards[a].select);
}*/
function selecti(a,i){
    gm.playerList[i].cards[a].select=!gm.playerList[i].cards[a].select;
    console.log(gm.playerList[i].cards[a].select);
    render();
    renderstat();
}

class player{
    constructor(name,color,role,desc,city) {
        this.name=name;
        this.cards=[];
        this.role=role;
        this.desc=desc;
        this.color=color;
        this.city=city;
        this.steps=4;
        this.passed=false;
    }
    get selCards(){
        var res=[];
        for (let i=0; i<this.cards.length; i++){
            if (this.cards[i].select==true) {res.push(this.cards[i]);}
        }
        return res;
    }
    get unselCards(){
        var res=[];
        for (let i=0; i<this.cards.length; i++){
            if (this.cards[i].select==false) {res.push(this.cards[i]);}
        }
        return res;
    }
    leftCards(){
        gm.cardsPlayLeft=gm.cardsPlayLeft.concat(this.selCards);
        this.cards=this.unselCards;
    }
    renderStat(st,j){
        var el=document.getElementById(st);  
        el.innerHTML="";
        el.innerHTML+="<div class='item tp4'> <b>"+this.role+"</b><br>"+this.desc+"</div>";
        for (let i=0;i<this.cards.length;i++){
           /* if (this.cards[i].select==true){
                el.innerHTML+="<div onclick='selecti("+i+","+j+")' class='item sel tp"+this.cards[i].color+"'>"+this.cards[i].name+"</div>"; 
            } else {
                el.innerHTML+="<div onclick='selecti("+i+","+j+")' class='item tp"+this.cards[i].color+"'>"+this.cards[i].name+"</div>";
            }  */
            this.cards[i].render(el,i,j);
        }
    }
    render(gWindow,active){
        switch (this.color){
            case 0:gWindow.fillStyle = 'rgb(0, 100, 100)'; break;
            case 1:gWindow.fillStyle = 'rgb(0, 100, 0)'; break;
            case 2:gWindow.fillStyle = 'rgb(100, 0, 100)'; break;
            case 3:gWindow.fillStyle = 'rgb(100, 100, 100)'; break;
         }
         //gWindow.font = "bold 14pt Arial";
         gWindow.beginPath();
         if (active){
             gWindow.arc(Number(this.city.x)+this.color*3,Number(this.city.y)+this.color*0,8,0,Math.PI*2);
         }
         else{
            gWindow.arc(Number(this.city.x)+this.color*3,Number(this.city.y)+this.color*0,6,0,Math.PI*2);    
         }
         gWindow.fill();    
        // gWindow.fillRect(this.city.x, this.city.y, 10, 10);
    }
    goStep(target){
        if (!this.city.isNear(target)) {console.log("reject"); return false;}
        if (this.steps==0){console.log("no steps"); return false;}
        this.city=target;
        this.steps--;
        return true;
    }

    goDirect(){
        var cs=this.selCards;
        if (!(cs.length==1)){console.log("select 1 card"); return false;}
        if (!cs[0].city){console.log("wrong card"); return false;}
        if (this.steps==0){console.log("no steps"); return false;}
        this.city=cs[0].city;
        this.leftCards();
        this.steps--;
        return true;
    }

    goChart(target){
        var cs=this.selCards;
        if (!(cs.length==1)){console.log("select 1 card to charter"); return false;}
        var nm=cs[0].name;
        if (!(this.city.name==nm)){console.log("wrong city"); return false;}
        if (this.steps==0){console.log("no steps"); return false;}
        this.city=target;
        this.leftCards();
        this.steps--;
        return true;
    }

    goSpec(target){
        if (!(this.city.station&&target.station==true)){console.log("no station"); return false;}
        if (this.steps==0){console.log("no steps"); return false;}
        this.city=target;
        this.steps--;
        return true;
    }

    doCure(color){
        if (this.city.infection[color]==0){console.log("not infected"); return false;}
        if (this.steps==0){console.log("no steps"); return false;}
        if (((gm.vaccine[color])==0)&&(this.role!=rol_ar[2])){ //doctor
            this.city.infection[color]--;
        } else {
            this.city.infection[color]=0;
        }
        if (!(((gm.vaccine[color])!=0)&&(this.role==rol_ar[2]))){this.steps--;} //doctor
        return true;
    }

    doBuild(){
        if (this.role==rol_ar[3]){ //builder
            if (this.steps==0){console.log("no steps"); return false;}
            this.steps--;
            this.city.station=true;
            return true;    
        }

        var cs=this.selCards;
        if (!(cs.length==1)){console.log("select 1 card"); return false;}
        var nm=cs[0].name;
        if (!(this.city.name==nm)){console.log("wrong city"); return false;}
        if (this.city.station!=false){console.log("reject"); return false;}
        if (this.steps==0){console.log("no steps"); return false;}
        this.city.station=true;
        this.leftCards();
        this.steps--;
        return true;
    }

    doVaccine(){
        var cs=this.selCards; //scientist
        if (!((cs.length==5)||((cs.length==4)&&(this.role==rol_ar[0])))){console.log("select 5 cards or 4 for scientist"); return false;}
        if (this.city.station!=true){console.log("you need a station"); return false;}
        var col=cs[0].color;
        for (let i=1;i<cs.length;i++){
            if (cs[i].color!=col){console.log("wrong colors"); return false;}
        }
        if (this.steps==0){console.log("no steps"); return false;}
        this.steps--;
        gm.vacc(col);
        this.leftCards();
        console.log("vaccine done");
        gm.testWin();
        return true;
    }

    doPlaycard(){
        this.leftCards();
    }

    doPlayEvent(){
        var cs=this.selCards;
        if (!(cs.length==1)){console.log("select 1 card"); return false;}
        var nm=cs[0].name;
        if (!(nm[0]=="_")){console.log("select event card"); return false;}
        if ((nm=="_SIL")){}
        this.leftCards();
        return true;
    }

    doGetcard(){
        var sp;
        var cn=0;
        for(let j=0;j<gm.playerList.length;j++){
            if (j!=gm.currentPlayer){
                if (gm.playerList[j].city.name==this.city.name){
                    if (gm.playerList[j].selCards.length==1){
                        if (gm.playerList[j].selCards[0].name==this.city.name){
                        cn++;
                        sp=gm.playerList[j];
                     }
                    }    
                }
            }
        }
        if (cn==1){
            if (sp.selCards.length==1){
                //sp.selCards[0].select=false;
                this.cards.push(sp.selCards[0]);
                //this.cards[this.cards.]
                sp.cards=sp.unselCards;
                this.cards[this.cards.length-1].select=false;
                //sp.leftCards();
            }
        }
    }

    doSendcard(pl){
        if (pl!=gm.currentPlayer){
        if (gm.playerList[pl].city.name==this.city.name){
            if (this.selCards.length==1){
                if (this.selCards[0].name==this.city.name){
                    gm.playerList[pl].cards.push(this.selCards[0]);
                    this.cards=this.unselCards;
                    gm.playerList[pl].cards[gm.playerList[pl].cards.length-1].select=false;
             }
            }    
        }    
        }
    }

    doPass(){
        this.steps=0;
        this.passed=true;
        //this.doPlaycard();
        for (let i=0;i<2;i++){
            if ((gm.cardsPlay.length)==0){gm.finish()} else {
                var card=gm.cardsPlay.pop();
                if (card.name=="EPID"){
                    gm.infectionMarkInc();
                    var card_=gm.cardsInfection.pop();
                    //world[card_.id].infect(3,world[card_.id].color,[]);
                    card_.city.infect(3,card_.city.color,[]);
                    gm.cardsInfectionLeft.push(card_);
                    gm.mergeCards();
                    console.log("Epidemia "+card_.name+" infected");    
                } else {
                    this.cards.push(card);
                }
            }
        }
    }
}

roles="Scientist Researcher Doctor Builder Karantine Dispatcher Eventer";
desc="Требуется только 4 карты для изобретения вакцины"+"--"+
     "Может обмениваться любыми картами с игроком в одном городе"+"--"+
     "Излечивает все кубики болезни одного цвета в городе, а так же не требует хода на лечение с вакциной"+"--"+
     "Не требуется карта для строительства станции в своем городе"+"--"+
     "Болезни не появляются в городе и соседних городах"+"--"+
     "Может управлять другими игроками как своими, и так же переместить игрока в город с другим игроком"+"--"+
     "Берет карту события из сброса";
rol_ar=roles.split(" ");
desc_ar=desc.split("--");

world = [];
cit="Atlanta Chicago Monreal New-York Washington San-Francisco London Madrid Paris Milan Essa St-Peterburg "+
    "Los-Angeles Mexico Mayami Bogota Lima Santyago Lagos Kinshasa Yohansburg Hartum Buenos-Aires San-Paulo "+
    "Алжир Стамбул Москва Багдад Эр-Рияд Карачи Тегеран Дели Мумбай Ченнаи Калькутта Kairo "+
    "Пекин Шанхай Бангкок Джакарта Хошимин Манила Сидней Осака Тайбэй Сеул Токио Гонконг";
pos="231 330 206 266 289 262 356 270 328 324 101 297 509 221 497 306 570 264 625 244 589 207 682 191 "+
    "119 381 196 409 292 397 282 479 252 567 265 659 560 467 612 524 662 607 666 451 350 644 399 580 "+
    "587 351 662 297 725 248 720 340 728 414 798 365 782 285 860 342 807 426 873 472 918 363 649 366 "+
    "962 268 969 325 928 432 926 541 975 488 1064 487 1107 655 1105 357 1046 381 1038 265 1098 297 978 395";
rel="14 4 1 ,0 2 5 12 13 ,1 4 3 ,2 4 7 6 ,14 0 2 3 ,12 1 46 41 ,3 7 8 10 ,23 24 8 6 3 ,"+
"6 7 24 9 10 ,8 25 10 ,6 8 9 11 ,10 25 26 ,5 1 13 42 ,12 14 15 16 1 ,"+
"13 15 0 4 ,13 14 16 23 22 ,17 15 13 ,16 ,23 19 21 ,18 21 20 ,19 21 ,18 19 20 35 ,15 23 ,22 15 7 18 ,"+
"7 8 25 35 ,24 9 11 26 27 35 ,11 25 27 30 ,35 25 26 30 29 28 ,35 27 29 ,28 27 30 31 32 ,26 27 29 31 ,"+
"30 29 32 33 34 ,29 31 33 ,32 31 34 38 39 ,31 33 38 47 ,24 25 27 28 21 ,37 45 ,36 45 46 43 44 47 ,33 34 47 40 39 ,"+
"33 38 40 42 ,39 38 47 41 ,40 47 44 42 5 ,12 39 41 ,44 46 ,41 47 37 43 ,36 37 46 ,45 37 43 5 ,38 34 37 44 41 40";
var cit_ar=cit.split(" ");
var pos_ar=pos.split(' ');
var rel_ar=rel.split(" ,");
for (let i=0;i<cit_ar.length;i++){
    world.push(new city(cit_ar[i], Math.floor(i/12),rel_ar[i].split(" "),pos_ar[Math.floor(i*2)], pos_ar[Math.floor(i*2)+1]));
}

infectCardList=[];
for (let i=0;i<cit_ar.length;i++){
    infectCardList.push(new card(i, cit_ar[i]));
}
playCardList=[];
for (let i=0;i<cit_ar.length;i++){
    var cd=new card(i, cit_ar[i]);
    cd.setColor(Math.floor(i/12));
    playCardList.push(cd);
}
playCardList.push(new card(48+0,"_SIEL"));
playCardList.push(new card(48+1,"_BIUL"));
playCardList.push(new card(48+2,"_PROG"));
playCardList.push(new card(48+3,"_MOVE"));
playCardList.push(new card(48+4,"_IMMU"));
//playCardList.push(new card(48+5,"_"));

var epidCards=[];
for (let i=0;i<7;i++){
    epidCards.push(new card(48+5+i,"EPID"));
}


var playerList=[];
playerList.push(new player("pl1",0,rol_ar[0],desc_ar[0],world[0]));
playerList.push(new player("pl2",2,rol_ar[2],desc_ar[2],world[0]));
playerList.push(new player("pl3",1,rol_ar[3],desc_ar[3],world[0]));
gm=new game(playerList, epidCards);