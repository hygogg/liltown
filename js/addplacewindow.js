
AddplaceWindow.prototype = new google.maps.OverlayView();

var userId;
var currentAddress;

function AddplaceWindow(map){

    //JQUERYをロードする
    loadJS("http://code.jquery.com/jquery-latest.js"); 
    loadJS("js/cookie.js");  
    userId = getCookie("LiltownUserId");
    
    
    this.tmpl = '<div id="addPlaceWindow" class="addplacewindow">\
     <table>\
     <tr><td class="label">名称</td><td><input name="place_name" id="place" type="text" value=""/></td></tr>\
     <tr><td class="label">住所</td><td><input name="address" id="address" type="text" value=""/></td></tr>\
     <tr><td class="label">電話番号</td><td><input name="phone_number" id="phone"　type="text" value=""/></td></tr>\
     <tr><td class="label">ジャンル</td><td><select name="genre_id" id="genre"><option>有名人・芸能人</option><option>飲食店・レストラン</option><option>ファッション</option><option>美容</option><option>交通</option><option>店舗・商業施設</option><option>地方自治体</option><option>公共機関</option><option>企業</option><option>エンタメ</option><option>メディア</option><option>メディア</option><option>スポーツ</option><option>旅・レジャー</option><option>教育</option><option>天気</option></select></td></tr>\
     <tr><td class="label">アイコン</td><td><input name="icon_id" id="icon" type="text" value=""/></td></tr>\
     <tr><td class="label">TwitterId</td><td><input name="twitter_id" id="twitter"　type="text" value=""/></td></tr>\
     <tr><td><a href="#" action="close" id="cancel">閉じる</div></td>\
     <td><a href="#" action="add" id="button">追加</div></td></tr>\
     </table>\
     </div>';
    
    this.map_ = map;
    this.setMap(map);
    
    var parentDiv = document.createElement('DIV');
    this.div_ = parentDiv;
    this.windowDisplay = false;
    
    var windowDiv = document.createElement('DIV');
    windowDiv.style.border = "none";
    windowDiv.style.borderWidth = "5px";
    windowDiv.style.width = "320px";
    windowDiv.style.height = "320px";
    windowDiv.style.top = "30px";
    windowDiv.style.left = "100px";
    windowDiv.style.position = "absolute";
    windowDiv.style.backgroundColor = "B4EAFA";
    windowDiv.innerHTML = this.tmpl;
    this.windowDiv_ = windowDiv;
    
    this.searchService_ = new google.maps.Geocoder();

};

AddplaceWindow.prototype.onAdd = function(){

    this.map_.controls[google.maps.ControlPosition.TOP_LEFT].push(this.div_);
    
};


AddplaceWindow.prototype.draw = function(){
    
};
AddplaceWindow.prototype.onRemove = function(){

};

AddplaceWindow.prototype.toggle = function(latLng){
    
    if(this.windowDisplay == false){
        this.div_.appendChild(this.windowDiv_);
        var buttons = this.div_.getElementsByTagName("button");
        var that = this;
        for(var i = 0; i < buttons.length; i++){
            google.maps.event.addDomListener(buttons[i],"click",function(evt){
            that.btnClicked_.call(that,evt);
            });
        }
        
        //緯度・経度から住所を検索する
        this.latLng_ = latLng;
        this.searchService_.geocode(
            {
                "latLng":this.latLng_
            },function(results,status){
                if(status == google.maps.GeocoderStatus.OK){
                    result = results[0];
                    var tmp;
                    length = result.address_components.length - 2;
                    for (count = length;count >= 0;count--){
                        if(count == length){
                            tmp = result.address_components[count].short_name;
                        }
                        else{
                            tmp = tmp + result.address_components[count].short_name;
                        }
                    }
                    //住所をキャッシュしておく
                    currentAddress = tmp;
                    //住所をフォームに反映
                    var inputs = that.div_.getElementsByTagName("input");
                    inputs[1].value = currentAddress;

                    
                }
                that.windowDisplay = true;
            });

         //住所をフォームに反映
        //var inputs = this.div_.getElementsByTagName("input");
        //inputs[1].value = currentAddress;

        //this.windowDisplay = true;
    }
      
};
AddplaceWindow.prototype.btnClicked_ = function(evt){
    var action = evt.target.getAttribute('action');
    switch(action){
    case "add":
        
        //フォームに入力された値を取得する
        var inputs = this.div_.getElementsByTagName("input");

        var place_name = inputs[0].value;
        var address = inputs[1].value;
        var phone_number = inputs[2].value;
        var genre_id = inputs[3].value;
        var icon_id = inputs[4].value;
        var twitter_id = inputs[4].value;
        var lat;
        var lng;
        var userId = getCookie("LiltownUserId");
        
        //緯度・経度を取得
        if(currentAddress != address){
            this.searchService_.geocode(
                {
                "address": address
                },function(results,status){
                    if(status == google.maps.GeocoderStatus.OK){
                        result = results[0];
                        lat = result.geometry.location.lat();
                        lng =  result.geometry.location.lng();
                    }
                    insertToSQL(place_name,address,phone_number,lat,lng,genre_id,icon_id,twitter_id,userId);
                });
        }else{
            lat = this.latLng_.lat();
            lng = this.latLng_.lng();
            insertToSQL(place_name,address,phone_number,lat,lng,genre_id,icon_id,twitter_id,userId);
        }
            

        break;
    case "close":
        if(this.windowDisplay == true){
            this.div_.removeChild(this.div_.childNodes.item(0));
            this.windowDisplay = false;
        }
        break;
    }
}
function insertToSQL(place_name,address,phone_number,lat,lng,genre_id,icon_id,twitter_id,userId){
        //SQL文を発行
        var phpUrl="http://kajishima.boo.jp/LILTOWN/dbOperation.php";
        $.post(phpUrl,
        {
            'function':'insert',
            'insertDataName':'place_name|address|phone_number|latitude|longtitude|genre_id|icon_id|twitter_id|twitter_accepted|create_user_id|create_time|update_time',
            'insertData':place_name+'|'+address+'|'+phone_number+'|'+lat+'|'+lng+'|'+genre_id+'|'+icon_id+'|'+twitter_id+'||'+userId+'|||',
            'primaryKeyName':'place_id',
            'table':'PLACE'
        },function(data){
            alert("地点が追加されました。閉じるボタンで閉じてください。");
        },
        "text");    
}
function loadJS(url){
    var script=document.createElement("script");    //script要素を作る
    script.setAttribute("src",url);   //src属性にjquery.jsを設定
    script.setAttribute("type","text/javascript");  //type属性にtext/javascriptを設定
    document.body.appendChild(script);              //bodyにscriptを追加する
}