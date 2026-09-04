(function(){
    const style=document.createElement('style');
    style.id='destroyer-style';
    style.innerHTML='* { cursor: crosshair; !important};';
    document.head.appendChild(style);
    function destroyElement(ev){
        ev.preventDefault();
        ev.stopPropagation();

        const target=ev.target;
        if(target===document.body||target===document.documentElement){
            return;
        }
        target.remove();
    }
    document.addEventListener('click',destroyElement,true);
})();