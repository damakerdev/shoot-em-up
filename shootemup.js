(function(){
    if(window.shootEmUpRunning) return;
    window.shootEmUpRunning=true;

    let score=0;
    let elemDestroyed=0;
    let playerHp=100;
    let isGameOver=false;

    const hud = document.createElement('div');
    hud.id = 'shootemup-hud';
    hud.style.cssText = `
    position: fixed;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.9);
    color: #000000;
    font-family: 'Courier New', monospace, sans-serif;
    font-size: 20px;
    font-weight: bold;
    padding: 10px 14px;
    border: 3px solid;
    border-radius: 8px;
    z-index: 999999;
    pointer-events: none;
    user-select: none;
    min-width: 180px;
    line-height: 1.5;
    `;

    document.body.appendChild(hud);

    function displayHUD(){

        const healthColor = playerHp < 30 ? '#900b0b' : playerHp < 70 ? '#cbbb03' : '#008200';
        hud.style.borderColor=healthColor;
        hud.innerHTML=`
        <div style="color: ${healthColor}; margin-bottom: 4px;font-weight: bold;">shooot 'em up</div>
    <div>SCORE: <span style="color:#000;">${score}</span></div>
    <div>DESTROYED: <span style="color:#000;">${elemDestroyed}</span></div>
    <div style="margin-bottom:20px;">HEALTH: <span style="color:${healthColor};">${playerHp}%</span></div>
    <div style="font-size:13px;"><b>CONTROLS:</b></div>
    <div style="border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #282d34; margin-bottom:20px;line-height: 1.4;">
            <div><b>aim:</b>hover over elements</div>
            <div><b>fire:</b>left-click</div>
            <div><b>DANGER:</b>avoid red bullets</div>
        </div>    
    <div style="font-size:13px;"><b>OBJECTIVE:</b></div>
    <div style="font-size:13px; color: #f30d0d;"><b>destroy all elements</b></div>

    `;
    }

    displayHUD();
    
    const style=document.createElement('style');
    style.innerHTML=`
    * { cursor: crosshair!important;}
    .shootemup-hit { outline: 1px solid #ff0000 !important; }
    `;
    document.head.appendChild(style);

    function initializeHealth(e){
        if(e.dataset.health) return;
        let healthNormal=50;
        if(['H1','H2','H3','IMG','BUTTON'].includes(e.tagName)) {
            healthNormal=100;
        } else if(['P','SPAN','A','LI','INPUT'].includes(e.tagName)) {
            healthNormal=20;
        }
        e.dataset.healthMax=healthNormal;
        e.dataset.health=healthNormal;

    }

    const healthbar=document.createElement('div');
    healthbar.id='hp-bar';
    healthbar.style.cssText=`
        position: absolute;
        height: 6px;
        background: rgba(255,0,0,0.5);
        z-index: 999;
        display: none
    `;
    const healthbarDiv=document.createElement('div');
    healthbarDiv.style.cssText=`
        height: 100%;
        width:100%;
        background: #00ff00;
        border-radius: 2px;
    `;

    healthbar.appendChild(healthbarDiv);
    document.body.appendChild(healthbar);

    function updateHealthBar(e){
        if(!e||!e.dataset.health){
            healthbar.style.display='none';
            return;
        }
        const rect=e.getBoundingClientRect();
        const currHp=parseFloat(e.dataset.health);
        const maxHp=parseFloat(e.dataset.healthMax);
        const percentHp=Math.max(0,(currHp/maxHp)*100);
        healthbar.style.top=`${rect.top+window.scrollY-10}px`;
        healthbar.style.left=`${rect.left+window.scrollX}px`;
        healthbar.style.width=`${Math.max(rect.width/4,40)}px`;
        healthbarDiv.style.width=`${percentHp}%`;
        healthbarDiv.style.background= percentHp<30?'#ff3333':'#00ff00';
        healthbar.style.display='block';
    }

    let currTarget=null;
    const damagePerShot=25;
    document.addEventListener('mouseover',(e)=>{
        if(isGameOver||playerHp<=0) return;
        const target=e.target;
        if(target===document.body||target===document.documentElement||target.id?.startsWith('shootemup'|| target.classList?.contains('shootemup-bullet'))){
            currTarget=null;
            healthbar.style.display='none';
            return;
        }
        currTarget=target;
        initializeHealth(currTarget);
        updateHealthBar(currTarget);
    },true);


    let mouseX=window.innerWidth/2;
    let mouseY=window.innerHeight/2;
    const activeBullets=[];
    document.addEventListener('mousemove',(e)=>{
        mouseX=e.clientX;
        mouseY=e.clientY;
        if(currTarget) {
            updateHealthBar(currTarget);
        }
    })

    function getValidTargets(){
        return Array.from(document.querySelectorAll('h1,h2,h3,img,button,p,span,a,li,input,video,canvas')
        ).filter(
                elem=>
                    !elem.id?.startsWith('shootemup') && 
                    !elem.classList?.contains('shootemup-bullet') &&
                    !hud.contains(elem) &&
                    !healthbar.contains(elem)
        );
    }

    function gameWon(){
        if(isGameOver) return;
        isGameOver=true;
        if(document.getElementById('shootemup-gamewon')) return;
        const modal=document.createElement('div');
        modal.id='shootemup-gamewon';
        modal.style.cssText=`
            position:fixed;
            top:50%;
            left:50%;
            transform: translate(-50%,-50%);
            background: rgba(4, 54, 1, 0.95);
            color:#ff3333;
            padding: 40px 60px;
            font-family: 'Courier New',monospace,sans-serif;
            opacity:0;
            z-index:9999999;
        `;
        modal.innerHTML = `
        <h1 style="font-size: 42px; margin: 0 0 10px 0; color: #09ff00;">
            :D YOU WIN
        </h1>
        <p style="font-size: 18px; color: #c4ffaa; margin-bottom: 20px;">
            All webpage elements destroyed!
        </p>
        <div style="font-size: 16px; color: #fff; margin-bottom: 25px; line-height: 1.6;">
            <strong>FINAL SCORE:</strong> ${score}<br>
            <strong>ELEMENTS DESTROYED:</strong> ${elemDestroyed}
        </div>
        <button id="shootemup-restart-btn" style="
            background: #25cd3b;
            color: #fff;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: bold;
            font-family: inherit;
            border-radius: 8px;
        ">
            PLAY AGAIN :)
        </button>
        `;

        document.body.appendChild(modal);
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
        document.getElementById('shootemup-restart-btn').addEventListener('click',()=>{
            window.location.reload();
        })
    }

    function checkWinCondition() {
        const remainingTargets = getValidTargets();
        if (remainingTargets.length === 0) {
            gameWon();
        }
    }




    document.addEventListener('click',(e)=>{
        if(isGameOver||playerHp<=0) return;
        if(!currTarget) return;
        e.preventDefault();
        e.stopPropagation();
        let currHp = parseFloat(currTarget.dataset.health) - damagePerShot;
        currTarget.dataset.health = currHp;
        currTarget.classList.add('shootemup-hit');
        setTimeout(() => {
            if (currTarget) {
                currTarget.classList.remove('shootemup-hit');
            }
        }, 100);

        if(currHp<=0){
            healthbar.style.display='none';
            currTarget.style.transition = 'transform 0.15s ease, opacity 0.15s ease';
            currTarget.style.transform = 'scale(1.15)';
            currTarget.style.opacity = '0';

            const maxHp=parseFloat(currTarget.dataset.healthMax)||50;
            score+=maxHp*10;
            elemDestroyed+=1;
            displayHUD();

            const todelete = currTarget;
            currTarget = null;

            setTimeout(() => {
                todelete.remove();
                checkWinCondition();
            }, 150);
        } else {
            updateHealthBar(currTarget);
        }
    },true);

    function gameOver(){
        if(isGameOver) return;
        isGameOver=true;
        if(document.getElementById('shootemup-gameover')) return;
        const modal=document.createElement('div');
        modal.id='shootemup-gameover';
        modal.style.cssText=`
            position:fixed;
            top:50%;
            left:50%;
            transform: translate(-50%,-50%);
            background: rgba(20, 13, 13, 0.95);
            color:#ff3333;
            padding: 40px 60px;
            font-family: 'Courier New',monospace,sans-serif;
            opacity:0;
            z-index:9999999;
        `;
        modal.innerHTML=`
        <h1 style="font-size: 42px; margin: 0 0 10px 0; color: #ff3333;">
            x_x GAME OVER
        </h1>
        <p style="font-size: 18px; color: #ffaaaa; margin-bottom: 20px;">
            The webpage destroyed you!
        </p>
        <div style="font-size: 16px; color: #fff; margin-bottom: 25px; line-height: 1.6;">
            <strong>FINAL SCORE:</strong> ${score}<br>
            <strong>ELEMENTS DESTROYED:</strong> ${elemDestroyed}
        </div>
        <button id="shootemup-retry-btn" style="
            background: #cd2525;
            color: #fff;
            border: none;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: bold;
            font-family: inherit;
            border-radius: 8px;
        ">
            TRY AGAIN :)
        </button>
        `;

        document.body.appendChild(modal);
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });

        document.getElementById('shootemup-retry-btn').addEventListener('click', () => {
            window.location.reload();
        });

    }

    
    function enemyShoot(enemyElem){
        if(!enemyElem||!enemyElem.getBoundingClientRect) return;
        const rect=enemyElem.getBoundingClientRect();
        const startX=rect.left+rect.width/2;
        const startY=rect.top+rect.height/2;
        if(rect.bottom<0||rect.top > window.innerHeight) return;


        const delX=mouseX-startX;
        const delY=mouseY-startY;
        const dist=Math.hypot(delX,delY);
        if(dist===0) return;
        const angleRad = Math.atan2(delY, delX);
        const angleDeg = angleRad * (180 / Math.PI) + 90;
        const speed=6;
        const vx=(delX/dist)*speed;
        const vy=(delY/dist)*speed;

        const bullet=document.createElement('div');
        bullet.className='shootemup-bullet';
        bullet.style.cssText=`
            position:fixed;
            width:4px;
            height:12px;
            background-color:#ff0055;
            border:1px solid #920606;
            pointer-events:none;
            z-index:999999;
            left:${startX}px;
            top:${startY}px;
            transform: translate(-50%, -50%) rotate(${angleDeg}deg);
        `;
        document.body.appendChild(bullet);

        activeBullets.push({
            element: bullet,
            x: startX,
            y:startY,
            vx:vx,
            vy:vy,
            rotation: angleDeg
        });

    }

    function gameloop(){
        if(isGameOver) return;
        for(let i = activeBullets.length-1;i>=0;i--){
            const b=activeBullets[i];

            b.x +=b.vx;
            b.y+= b.vy;
            b.element.style.left =`${b.x}px`;
            b.element.style.top = `${b.y}px`;
            b.element.style.transform = `translate(-50%, -50%) rotate(${b.rotation}deg)`;
            const cursorDist = Math.hypot(b.x - mouseX, b.y - mouseY);
            if (cursorDist< 12) {
                document.body.style.backgroundColor='#550000';
                setTimeout(() => {
                    document.body.style.backgroundColor=''
                }, 100);
                playerHp=Math.max(0,playerHp-10);
                displayHUD();
                b.element.remove();
                activeBullets.splice(i,1);

                if(playerHp<=0){
                    gameOver();
                    return;
                }

                continue;
            }
            if(b.x<0||b.x>window.innerWidth || b.y<0||b.y>window.innerHeight){
                b.element.remove();
                activeBullets.splice(i,1);
            }
        }
        requestAnimationFrame(gameloop);
    }
    requestAnimationFrame(gameloop);

    setInterval(() => {
        if(isGameOver||playerHp<=0) return;
        const killers = document.querySelectorAll('img,button,canvas,video,input');
        if(killers.length===0) return;
        const randomKiller= killers[Math.floor(Math.random()*killers.length)];
        enemyShoot(randomKiller);
    }, 1500);
})();