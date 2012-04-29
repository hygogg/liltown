
GenreSelect.prototype = new google.maps.OverlayView();

var userId;

function GenreSelect(map){

    //JQUERYをロードする
    loadJS("http://code.jquery.com/jquery-latest.js"); 
    loadJS("js/cookie.js");  
    userId = getCookie("LiltownUserId");
    
    
    this.tmpl = '<div id="genreSelect" class="genreSelect">\
     <table>\
     <tr><td><img src="img/celeb.png" onclick="select()" id="celeb">有名人・芸能人</img></td></tr>\
     <tr><td><img src="img/restaurant.png" onclick="select()" id="restaurant">飲食店・レストラン</img></td></tr>\
     <tr><td><img src="img/fashion.png" onclick="select()" id="fashion">ファッション</img></td></tr>\
     <tr><td><img src="img/beauty.png" onclick="select()" id="beauty">美容</img></td></tr>\
     <tr><td><img src="img/traffic.png" onclick="select()" id="traffic">交通</img></td></tr>\
     <tr><td><img src="img/shop.png" onclick="select()" id="shop">店舗・商業施設</img></td></tr>\
     <tr><td><img src="img/local_authority.png" onclick="select()" id="local_authority">地方自治体</img></td></tr>\
     <tr><td><img src="img/public_institution.png" onclick="select()" id="public_institution">公共機関</img></td></tr>\
     <tr><td><img src="img/business.png" onclick="select()" id="business">企業</img></td></tr>\
     <tr><td><img src="img/entertainment.png" onclick="select()" id="entertainment">エンタメ</img></td></tr>\
     <tr><td><img src="img/media.png" onclick="select()" id="media">メディア</img></td></tr>\
     <tr><td><img src="img/sports.png" onclick="select()" id="sports">スポーツ</img></td></tr>\
     <tr><td><img src="img/leisure.png" onclick="select()" id="leisure">旅・レジャー</img></td></tr>\
     <tr><td><img src="img/education.png" onclick="select()" id="education">教育</img></td></tr>\
     <tr><td><img src="img/weather.png" onclick="select()" id="weather">天気</img></td></tr>\
     </table>\
     </div>';
    
    this.map_ = map;
    this.setMap(map);
    
    var parentDiv = document.createElement('DIV');
    this.div_ = parentDiv;
    this.windowDisplay = false;
    
    var windowDiv = document.createElement('WINDOWDIV');
    windowDiv.style.border = "solid #848484 1px";
    windowDiv.style.width = "200px";
    windowDiv.style.height = "500px";
    windowDiv.style.top = "25px";
    windowDiv.style.left = "-7px";
    windowDiv.style.position = "absolute";
    windowDiv.style.backgroundColor = "#ecffed";
    windowDiv.style.overflow = "scroll";
    windowDiv.innerHTML = this.tmpl;
    this.windowDiv_ = windowDiv;
    
};

GenreSelect.prototype.onAdd = function(){

    this.map_.controls[google.maps.ControlPosition.TOP_LEFT].push(this.div_);
    
};


GenreSelect.prototype.draw = function(){
    
};
GenreSelect.prototype.onRemove = function(){

};

GenreSelect.prototype.toggle = function(){
    
    if(this.windowDisplay == false){
        this.div_.appendChild(this.windowDiv_);
        var images = this.div_.getElementsByTagName("GenreImage");
        var that = this;
        for(var i = 0; i < images.length; i++){
            google.maps.event.addDomListener(images[i],"click",function(evt){
            that.btnClicked_.call(that,evt);
            });
        }
        this.windowDisplay = true;
    }
    else{
        this.div_.removeChild(this.div_.childNodes.item(0));
        this.windowDisplay = false;
    }
      
};
GenreSelect.prototype.btnClicked_ = function(evt){
    var action = evt.target.getAttribute('action');
    switch(action){
    case "select":
        //フォームに入力された値を取得する
    case "close":
        if(this.windowDisplay == true){
            
        }
        break;
    }
}

function loadJS(url){
    var script=document.createElement("script");    //script要素を作る
    script.setAttribute("src",url);   //src属性にjquery.jsを設定
    script.setAttribute("type","text/javascript");  //type属性にtext/javascriptを設定
    document.body.appendChild(script);              //bodyにscriptを追加する
}
