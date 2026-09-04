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
    if(target===document.body||target===document.documentElement||target.id?.startsWith('shootempup')){
        currTarget=null;
        healthbar.style.display='none';
        return;
    }
    currTarget=target;
    initializeHealth(currTarget);
    updateHealthBar(currTarget);
},true);