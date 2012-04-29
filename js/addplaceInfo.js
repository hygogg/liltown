//OverlayViewを継承
AddplaceInfo.prototype = new google.maps.OverlayView();

function AddplaceInfo(map){
    //templateを設定する
    this.tmpl = '<div id="addplaceInfo" class="addplaceInfo">\
    <table>\
    <tr><td>場所の追加方法は以下の通りです。</td></tr>\
    <tr><td>追加したい場所をクリックする</td></tr>\
    <tr><td>マーカーをクリックすると場所登録ウインドウが表示されます</td></tr>\
    </table>\
    </div>';
    

    
    //mapを設定する
    this.map_ = map;
    this.setMap(map);
    
    //ベースとなるDomを作成
    var parentDiv = document.createElement('parentDiv');
    this.parentDiv_ = parentDiv;
    this.windowDisplay = false;
    
    //Windowを作成
    var windowDiv = document.createElement('windowDiv');
    windowDiv.style.border = "solid #848484 1px";
    windowDiv.style.position = "absolute";
    windowDiv.style.width = "500px";
    windowDiv.style.height = "100px";
    windowDiv.style.top = "100px";
    windowDiv.style.left = "60px";
    windowDiv.style.padding = "5px";
    windowDiv.style.backgroundColor = "#ecffed";
    windowDiv.innerHTML = this.tmpl;
    
    this.windowDiv_ = windowDiv;
    

};

AddplaceInfo.prototype.onAdd = function(){
    //地図に追加する
    this.map_.controls[google.maps.ControlPosition.TOP_LEFT].push(this.parentDiv_);
};

AddplaceInfo.prototype.onRemove = function(){
};

AddplaceInfo.prototype.onDraw = function(){
};

AddplaceInfo.prototype.toggle = function(){
    if(this.windowDisplay == false){
        this.parentDiv_.appendChild(this.windowDiv_);
        this.windowDisplay = true;
    }
    else{
        this.parentDiv_.removeChild(this.parentDiv_.childNodes.item(0));
        this.windowDisplay = false;
    }
};


