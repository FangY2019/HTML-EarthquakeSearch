function showMap()
{
	navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position)
{
	lat=position.coords.latitude;
	lon=position.coords.longitude;
	latlon=new google.maps.LatLng(lat, lon)
	mapholder=document.getElementById('mapholder')
	mapholder.style.height='250px';
	mapholder.style.width='400px';

	var myOptions={
		center:latlon,zoom:14,
		mapTypeId:google.maps.MapTypeId.ROADMAP,
		mapTypeControl:false,
		navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
	};
	var map=new google.maps.Map(document.getElementById("mapholder"),myOptions);
	var marker=new google.maps.Marker({position:latlon,map:map,title:"You are here!"});
}

function getCoordinate(){
    navigator.geolocation.getCurrentPosition(getPosition);
}

function getPosition(position){
    window.parent.document.getElementById("latitude").value = position.coords.latitude;
    window.parent.document.getElementById("longitude").value = position.coords.longitude;
}
