function login(){
    loadJS("js/cookie.js");
    
    //Cookieを取得する
    userId = getCookie("LiltownUserId");
    
    //FBでログインする
    //その前に、初期化
    window.fbAsyncInit = function(){
        FB.init({
        appId: '176404182459965',
        status: true,
        cookie: true,
        xfbml: true,
        oauth: true,
    });
    
    
    //FBでログインしたら、
    
    //取得できたら、存在するIDかを確認しにいく
    if(userId != ''){
    <!--空白でなかったらDBに確認しにいく-->
    var phpUrl="http://kajishima.boo.jp/LILTOWN/dbOperation.php";
    $.post(phpUrl,
            {
                'function':'select',
                'selectData':'user_id',
                'specifyDataName':'user_id',
                'table':'USER',
                'specifyData':userId
                 
            },function(data){
                checkUserId(data);
            },
            "text");
    }
 　else{
    <!--FBログイン画面を出す-->
    if(window.confirm("FaceBookIDでログインします。よろしいですか？")){
            window.open("loginFromFBID.html","_self");
    }
    else{
        alert("ゲストモードで地図を表示します");
        window.open("liltown_main_guest.html","_self");

    }
 　}
 　function checkUserId(userId){
    if(userId != ''){
        <!--地図画面を出す-->
         window.open("liltown_main_member.html","_self");
    }
    else{
        <!--ユーザ登録画面を出す-->
        if("FaceBookIDでログインします。よろしいですか？"){
            window.open("liltown_register.html","_self");
        }
        else{
            alert("ゲストモードで地図を表示します");
            window.open("liltown_main_guest.html","_self");

        }
    }
　} 

};