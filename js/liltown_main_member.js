var tweetText = "";
var commentText = "";
var likeUser = "";
var selectedPlace;

var user_id;
var user_name;
var lat;
var lng;
user_name_map = new Array();
facebook_id_map = new Array();
var addplaceInfo;
var searchplace;
var selectgenre;
var addplaceWindow;

function initialize() {
         //PHPを実行
    var phpUrl="http://kajishima.boo.jp/LILTOWN/dbOperation.php";
    $.post(phpUrl,
    {
        'function':'selectDatas',
        'selectDatas':'place_id|place_name|address|phone_number|latitude|longtitude|twitter_id|twitter_accepted|create_user_id',
        'specifyDataName':'',
        'table':'PLACE',
        'specifyData':''
    },function(data){
        displaymap(eval("("+data+")"));
        },"text");
}
function displaymap(data){
    //Select結果を展開
    placeids = (data.place_id).split('|');
    placenames = (data.place_name).split('|');
    addresss = (data.address).split('|');
    phonenumbers = (data.phone_number).split('|');
    latitudes = (data.latitude).split('|');
    longtitudes = (data.longtitude).split('|');
    twitter_ids = (data.twitter_id).split('|');
    user_id = getCookie("LiltownUserId");
    
    //Cookieに記憶させている位置情報を取得する
    orgLat = getCookie("OrgLat:");
    orgLon = getCookie("OrgLon:");
    
    //無ければ東京駅
    if(orgLat == '' || orgLon == ''){
        orgLat = '35.681382';
        orgLon = '139.766084';
    }
    
    //地図を表示
	var latlng = new google.maps.LatLng(orgLat, orgLon);
	var mapOpts = {
		zoom: 16,
		center: latlng,
        mapTypeControlOptions:{
            style:google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        navigationControlOptions:{
            style:google.maps.NavigationControlStyle.SMALL
        },
        scaleControl:true,
        scaleControlOptions:{
            style:google.maps.ScaleControlStyle.DEFAULT
        },
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var mapDiv = document.getElementById("map_canvas");
	var mapCanvas = new google.maps.Map(mapDiv, mapOpts);
    

    addplaceInfo = new AddplaceInfo(mapCanvas);
    searchplace = new SearchPlace(mapCanvas);
    selectgenre = new GenreSelect(mapCanvas);
    addplaceWindow = new AddplaceWindow(mapCanvas);
    
    //現在位置を取得
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(pos){
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
            //Cookieに記録する
            clearCookie("OrgLat:");
            clearCookie("OrgLon:");
            setCookie("OrgLat:",lat);
            setCookie("OrgLon:",lng);
            
            var currentPos = new google.maps.LatLng(lat,lng);
            mapCanvas.setCenter(currentPos);
        },
        function(error){
            lat= orgLat;
            lng = orgLon;
            alert("位置情報の取得に失敗しました。");
        },
        {enableHightAccurracy:false,timeout:8000,maximumAge:0}
        );
    }
    //マーカーを作成（登録してある地点分作成する）
    for(i = 0; i < latitudes.length; i++){
        var mSpot = createMarker(
            mapCanvas,
            new google.maps.LatLng(latitudes[i], longtitudes[i]),
            placeids[i],
            twitter_ids[i]
        );

    }
    //Mapにイベント処理を追加
    google.maps.event.addListener(mapCanvas, 'click', function(event) {
        placeMarker(event.latLng,mapCanvas);
    });
    
    //自分の写真を持ってくる
    var phpUrl="http://kajishima.boo.jp/LILTOWN/dbOperation.php";
    $.post(phpUrl,
    {
        'function':'selectDatas',
        'selectDatas':'user_id|facebook_id|screen_name',
        'specifyDataName':'user_id',
        'table':'USER',
        'specifyData':user_id
    },function(data){
        if(data !=""){
            jsonData =JSON.parse(data);
            user_name = jsonData.screen_name;
            facebook_id = jsonData.facebook_id;
            fbURL = 'https://graph.facebook.com/'+facebook_id+'?fields=picture';
            alert(fbURL);
            $.getJSON(fbURL,function(fb_user){
            if(fb_user !=""){
                var photo = document.getElementById('me_photo');
                photo.setAttribute("src",fb_user.picture);
            }
            });
        }
    },"text");
   
}

function createMarker(map, latlng,place_id,twitter_id) {
	//マーカーを作成
	var marker = new google.maps.Marker();
	marker.setPosition(latlng);
	marker.setMap(map);
    
    //マーカーをクリックしたときのイベントを作成
    google.maps.event.addListener(marker,"click",function(){
        selectedPlace = place_id;
        var myInfoWnd = new LILInfoWindow();
        myInfoWnd.setMap(map);
        tweetText = "";
        commentText = "";
        //場所情報を取得
        var phpUrl="http://kajishima.boo.jp/LILTOWN/dbOperation.php";
        $.post(phpUrl,
        {
            'function':'selectDatas',
            'selectDatas':'place_name|address|phone_number|twitter_id',
            'specifyDataName':'place_id',
            'table':'PLACE',
            'specifyData':place_id
        },function(data){
            if(data != ""){
                jsonData =JSON.parse(data);
                
                
                var spot_name = document.getElementById("spot_name");
                var tmp = document.createElement("div");
                tmp.innerHTML =jsonData.place_name;
                spot_name.appendChild(tmp); 

                var spot_addr = document.getElementById("spot_addr");
                tmp = document.createElement("div");
                tmp.innerHTML =jsonData.address;
                spot_addr.appendChild(tmp); 
                
                var spot_phone = document.getElementById("spot_phone");
                tmp = document.createElement("div");
                tmp.innerHTML =jsonData.phone_number;
                spot_phone.appendChild(tmp); 

                
                var tw_id = document.getElementById("tw_id");
                tmp = document.createElement("div");
                tmp.innerHTML =jsonData.twitter_id;
                tw_id.appendChild(tmp); 
                
                var twitterURL = "https://twitter.com/#!/"+jsonData.twitter_id;
                var placeTweet = document.getElementById("placeTweet");
                tmp = document.createElement("div");
                tmp.innerHTML =twitterURL;
                placeTweet.appendChild(tmp); 
                
            }
        },"text");

        //コメントを取得
        phpUrl="http://kajishima.boo.jp/LILTOWN/dbOperation.php";
        $.post(phpUrl,
        {
            'function':'selectDatas',
            'selectDatas':'comment_text|user_id',
            'specifyDataName':'place_id',
            'table':'COMMENT',
            'specifyData':place_id
        },function(data){
            if(data != ""){
                jsonData =JSON.parse(data);
                
                comments = (jsonData.comment_text).split('|');
                for(i in comments){
                
                    commentText = commentText + comments[i] +"<br/>";
                }
                var placeComment = document.getElementById("comment1");
                placeComment;
                comment.innerHTML =commentText;
                placeComment.appendChild(comment);
            }

        },"text");
        //Fun情報を取得
        $.post(phpUrl,
        {
            'function':'selectDatas',
            'selectDatas':'user_id|create_time',
            'specifyDataName':'place_id',
            'table':'FUN',
            'specifyData':place_id
        },function(data){
            if(data != ""){
                jsonData =JSON.parse(data);
                funs = (jsonData.user_id).split('|');
                for(fun in funs){
                    $.post(phpUrl,
                    {
                        'function':'selectDatas',
                        'selectDatas':'screen_name|facebook_id',
                        'specifyDataName':'user_id',
                        'table':'USER',
                        'specifyData':fun
                    },function(result){
                        if(result != ""){
                            jsonData = JSON.parse(result);
                            likeUser = likeUser + jsonData.screen_name;
                            var fun = document.getElementById("fun");
                            var funs = fun
                            fun.innerHTML =likeUser;
                            placeFun.appendChild(fun);
                        }
                    },"text");
                } 
            }
        
        },"text");
        //Contentを設定
        if(twitter_id != ''){
            //tweetを取得する
            var tweetURL = "https://api.twitter.com/1/statuses/user_timeline.json?screen_name="+twitter_id+"&callback=?&count=1";
            $.getJSON(tweetURL, function(timeline) {
            for(i in timeline){
                tweetText = tweetText + timeline[i].text + "<br/>";
            }
            myInfoWnd.setContent(tweetText);
            myInfoWnd.open(marker);
            });
            var tweetPicture = "https://api.twitter.com/1/users/show.json?screen_name="+twitter_id;
            $.getJSON(tweetPicture, function(user) {
                pictureURL = user.profile_image_url;
                var tw_photo = document.getElementById("tw_photo");
                tw_photo.setAttribute("src",pictureURL);
            });
        }
        else{
            tweetText = "TwitterIDが登録されていません。";
            myInfoWnd.setContent(tweetText);
            myInfoWnd.open(marker);
            var placeTweet = document.getElementById("placeTweet");
            var tweet = document.createElement("div");
            tweet.innerHTML =tweetText;
            placeTweet.appendChild(tweet);
        } 
    });
	return marker;
}
function openGenreWindow(){
    selectgenre.toggle();
}
function openAddPlaceInfo(){
    addplaceInfo.toggle();
    }
function searchPlaceFromQuery(){
    var query = document.getElementById("placeQuery");
    searchplace.search(query.value);
}
function placeMarker(location,map) {
  var clickedLocation = new google.maps.LatLng(location);
  var marker = new google.maps.Marker({
      position: location, 
      draggable :true,
      map: map
  });
  
  //マーカーをクリックしたときのイベントを作成
  google.maps.event.addListener(marker,'click',function(event){
    addPlace(event,marker);
    });
    

}
function addPlace(event,marker){
    addplaceWindow.toggle(marker.getPosition());
}
function addComment(){
    user_id = getCookie("LiltownUserId");
    comment = document.getElementById("commentQuery").value;
    //コメントの追加
    var phpUrl="http://kajishima.boo.jp/LILTOWN/dbOperation.php";
        $.post(phpUrl,
        {
        'function':'insert',
         'insertDataName':'place_id|comment_text|user_id|create_time',
          'insertData':selectedPlace+'|'+comment+'|'+user_id+'|2012-03-09 00:00:00',
          'primaryKeyName':'comment_id',
          'table':'COMMENT'
        },function(data){
            alert("コメントを登録しました");
        
        },"text");

}
function addFun(){
    user_id = getCookie("LiltownUserId");
    
    //コメントの追加
    var phpUrl="http://kajishima.boo.jp/LILTOWN/dbOperation.php";
        $.post(phpUrl,
        {
        'function':'insert',
         'insertDataName':'place_id|user_id|create_time',
          'insertData':selectedPlace+'|'+user_id+'|2012-03-09 00:00:00',
          'primaryKeyName':'fun_id',
          'table':'FUN'
        },function(data){
            alert("ファンになりました");
        
        },"text");

}
