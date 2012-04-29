function LILInfoWindow(){
  //全体のDIVを入れるコンテナ
  this.container_= document.createElement("div");
  //↓DBから取ってくる
  this.container_.style.backgroundImage = "url('fukidashi.png')";
  this.container_.style.backgroundRepeat = "no-repeat";
  this.container_.style.width = "280px";
  this.container_.style.height = "430px";
  this.container_.style.position = "absolute";
  
  //クローズボタン
  this.closeBtn_ = document.createElement("div");
  this.closeBtn_.style.width = "17px";
  this.closeBtn_.style.height = "17px";
  this.closeBtn_.style.position = "absolute";
  this.closeBtn_.style.left = "245px";
  this.closeBtn_.style.top = "65px";
  this.closeBtn_.style.cursor = "pointer";
  this.container_.appendChild(this.closeBtn_);
  
  //内容
  this.contents_ = document.createElement("div");
  this.contents_.style.position = "absolute";
  this.contents_.style.width = "217px";
  this.contents_.style.height = "346px";
  this.contents_.style.position = "absolute";
  this.contents_.style.left = "21px";
  this.contents_.style.top = "71px";
  this.container_.appendChild(this.contents_);
  
  //クローズボタンがクリックされたら、地図から削除
  var that = this;
  google.maps.event.addDomListener(this.closeBtn_,"click",function(){
    that.setMap(null);
    });
  
};

//OverlayViewを継承
LILInfoWindow.prototype = new google.maps.OverlayView();

LILInfoWindow.prototype.onAdd = function(){
    /*
     *   (2)floatPaneに追加
     */
    this.layer_ = (this.getPanes()).floatPane;
    this.layer_.appendChild(this.container_);
};

LILInfoWindow.prototype.draw = function(){
    /*
     *   (3)地図に描画
     */
     var pixel = this.getProjection().fromLatLngToDivPixel(this.position);
     
     this.container_.style.left = pixel.x + "px";
     this.container_.style.top = pixel.y + "px";
};

LILInfoWindow.prototype.onRemove = function(){
    /*
     *   (4)floatPaneからdivを削除
     */
     if(this.layer_ != null){
        this.layer_.removeChild(this.container_);
        this.layer_ = null;
     }
};
LILInfoWindow.prototype.setContent = function(html){
  this.contents_.innerHTML = html;  
};
LILInfoWindow.prototype.setPosition = function(position){
  this.set("position",position);  
};
LILInfoWindow.prototype.open = function(marker){
    if("position" in marker){
        this.setPosition(marker.getPosition());
        this.setMap(marker.getMap());
    } else{
        this.setMap(map);
    }
};
LILInfoWindow.prototype.close = function(){
    this.setMap(null);
};






