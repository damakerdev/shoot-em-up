(function(){
    if(window.shootEmUpRunning) return;
    window.shootEmUpRunning=true;

    let score=0;
    let elemDestroyed=0;
    let playerHp=100;

    const hud = document.createElement('div');
    hud.id = 'shootemup-hud';
    hud.style.cssText = `
    position: fixed;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.9);
    color: #000000;
    font-family: 'Courier New', monospace, sans-serif;
    font-size: 13px;
    font-weight: bold;
    padding: 10px 14px;
    border: 2px solid #ff8400;
    border-radius: 8px;
    z-index: 999999;
    pointer-events: none;
    user-select: none;
    line-height: 1.5;
    `;

    document.body.appendChild(hud);

    function displayHUD(){
        hud.innerHTML=`
        <div style="color: #000000; margin-bottom: 4px;">shooot 'em up</div>
    <div>SCORE: <span style="color:#000;">${score}</span></div>
    <div>DESTROYED: <span style="color:#000;">${elemDestroyed}</span></div>
    <div>HEALTH: <span style="color:${playerHp < 30 ? '#991414' : '#0c780c'};">${playerHp}%</span></div>
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
        healthbarDiv.style.background=percentHp<30?'#ff3333':'#00ff00';
        healthbar.style.display='block';
    }

    let currTarget=null;
    const damagePerShot=25;
    document.addEventListener('mouseover',(e)=>{
        const target=e.target;
        if(target===document.body||target===document.documentElement||target.id?.startsWith('shootempup'|| target.classList?.contains('shootemup-bullet'))){
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

    document.addEventListener('click',(e)=>{
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
                todelete.remove()
            }, 150);
        } else {
            updateHealthBar(currTarget);
        }
    },true);

    function enemyShoot(enemyElem){
        if(!enemyElem||!enemyElem.getBoundingClientRect) return;
        const rect=enemyElem.getBoundingClientRect();
        const startX=rect.left+rect.width/2;
        const startY=rect.top+rect.height/2;
        if(rect.bottom<0||rect.top > window.innerHeight) return;
        const bullet=document.createElement('div');
        bullet.className='shootemup-bullet';
        bullet.style.cssText=`
            position:fixed;
            width:10px;
            height:10px;
            background-color:#ff0055;
            border-radius:50%;
            pointer-events:none;
            z-index:999999;
            left:${startX}px;
            top:${startY}px;
            transform:translate(-50%,-50%);
        `;
        document.body.appendChild(bullet);

        const delX=mouseX-startX;
        const delY=mouseY-startY;
        const dist=Math.hypot(delX,delY);
        if(dist===0) return;
        const speed=6;
        const vx=(delX/dist)*speed;
        const vy=(delY/dist)*speed;
        activeBullets.push({
            element: bullet,
            x: startX,
            y:startY,
            vx:vx,
            vy:vy
        });
    }

    function gameloop(){
        for(let i = activeBullets.length-1;i>=0;i--){
            const b=activeBullets[i];

            b.x +=b.vx;
            b.y+= b.vy;
            b.element.style.left =`${b.x}px`;
            b.element.style.top = `${b.y}px`;
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
        const killers = document.querySelectorAll('h1,h2,img,button,p');
        if(killers.length===0) return;
        const randomKiller= killers[Math.floor(Math.random()*killers.length)];
        enemyShoot(randomKiller);
    }, 1500);
})();








