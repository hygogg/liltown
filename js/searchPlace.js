var map_;
function SearchPlace(map){
 //コンストラクタ
 map_ = map;
 this.searchService_ = new google.maps.Geocoder();
};

SearchPlace.prototype.search = function(queryWord){
    this.searchService_.geocode({
        "address" :queryWord,
        "bounds"  :map_.getBounds(),
        "region" :"jp"
    },function(results,status){
        if(status == google.maps.GeocoderStatus.OK){
            var result = results[0];
            var bounds = result.geometry.bounds;
            if(bounds != undefined){
                map_.fitBounds(bounds);
            }else{
                map_.panTo(result.geometry.location);
            }
        }
        else{
            alert("みつかりませんでした");
        }
    });
    
};