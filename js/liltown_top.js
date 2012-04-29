var tweetText = "";
var commentText = "";
var likeUser = "";

var user_id;
var lat;
var lng;
user_name_map = new Array();
facebook_id_map = new Array();
var addplacewindow;
var searchplace;
var ftLayer;
var fID = 3621281;
var mapCanvas;

function initialize() {
    //Cookieに記憶させている位置情報を取得する
    orgLat = getCookie("OrgLat:");
    orgLon = getCookie("OrgLon:");
    if(orgLat == '' || orgLon == ''){
        orgLat = '35.681382';
        orgLon = '139.766084';
    }
    
    //地図を表示
	var latlng = new google.maps.LatLng(orgLat, orgLon);
	var mapOpts = {
		zoom: 17,
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
	mapCanvas = new google.maps.Map(mapDiv, mapOpts);
    searchplace = new SearchPlace(mapCanvas);
    selectgenre = new GenreSelect(mapCanvas);
    
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
         //PHPを実行
    var phpUrl="http://kajishima.boo.jp/LILTOWN/dbOperation.php";
    $.post(phpUrl,
    {
        'function':'selectPlaces',
        'selectDatas':'place_id|place_name|address|phone_number|latitude|longtitude|twitter_id|twitter_accepted|create_user_id',
        'specifyDataName':'',
        'table':'PLACE',
        'specifyData':''
        'lat':lat,
        'lng':lng,
    },function(data){
        displaymap(eval("("+data+")"));
        },"text");
}
function selectGenre(genre){
    //PHPを実行
    var phpUrl="http://kajishima.boo.jp/LILTOWN/dbOperation.php";
    $.post(phpUrl,
    {
        'function':'selectDatas',
        'selectDatas':'place_id|place_name|address|phone_number|latitude|longtitude|twitter_id|twitter_accepted|create_user_id',
        'specifyDataName':'genre_id',
        'table':'PLACE',
        'specifyData':genre
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
    

    //マーカーを作成（現在地から近い２０件を作成する）
    for(i = 0; i < latitudes.length; i++){
        var mSpot = createMarker(
            mapCanvas,
            new google.maps.LatLng(latitudes[i], longtitudes[i]),
            placeids[i],
            twitter_ids[i]
        );
    }
    
    
}
function createMarker(map, latlng,place_id,twitter_id) {
	//マーカーを作成
	var marker = new google.maps.Marker();
	marker.setPosition(latlng);
	marker.setMap(map);
    google.maps.event.addListener(marker,"click",function(){
        var myInfoWnd = new LILInfoWindow();
        myInfoWnd.setMap(map);
        tweetText = "";
        commentText = "";
        //コメントを取得
        var phpUrl="http://kajishima.boo.jp/LILTOWN/dbOperation.php";
        $.post(phpUrl,
        {
            'function':'selectDatas',
            'selectDatas':'comment_text|user_id',
            'specifyDataName':'place_id',
            'table':'COMMENT',
            'specifyData':place_id
        },function(data){
            //jsonData = (eval("("+data+")"));
            jsonData =JSON.parse(data);
            
            comments = (jsonData.comment_text).split('|');
            for(i in comments){
                
                commentText = commentText + comments[i] +"<br/>";
            }
            var placeComment = document.getElementById("comment");
            var comment = document.createElement("div");
            comment.innerHTML =commentText;
            placeComment.appendChild(comment);

        
        },"text");
        //Contentを設定
        if(twitter_id != ''){
            //tweetを取得する
            var tweetURL = "https://api.twitter.com/1/statuses/user_timeline.json?screen_name="+twitter_id+"&callback=?&count=1";
            $.getJSON(tweetURL, function(timeline) {
            for(i in timeline){
                tweetText = tweetText + timeline[i].text + "<br/>";
            }
            var placeTweet = document.getElementById("placeTweet");
            var tweet = document.createElement("div");
            tweet.innerHTML =tweetText;
            placeTweet.appendChild(tweet);
            myInfoWnd.setContent(tweetText);
            myInfoWnd.open(marker);
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

        var placeFun = document.getElementById("fun");
        var fun = document.createElement("div");
        fun.innerHTML =tweetText;
        placeFun.appendChild(fun);
        
    });
	
	return marker;
}
function openGenreWindow(){
    selectgenre.toggle();
}
function searchPlaceFromQuery(){
    var query = document.getElementById("placeQuery");
    searchplace.search(query.value);
}