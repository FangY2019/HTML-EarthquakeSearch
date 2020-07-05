// create express server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//link to mysql database
var mysql = require('mysql');
var mysqlconnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root2020',
    database : 'era'
});
var  sql = 'SELECT * FROM earthquake';
mysqlconnection.connect();

//request data and respond to the client request
app.post('/earthquakelist',urlencodedParser, function (req, res) {
    //gets the input in the form 
    global.lat = req.body.latitude;
    global.lng = req.body.longitude;
    global.radius = req.body.radius;
    //query in mysql
    mysqlconnection.query(sql,function (err, results) {
        var count = 0;
        if (!err) {
            res.write("Date" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
                      "Latitude" + "&nbsp;&nbsp;&nbsp;" + 
                      "Longitude" + "&nbsp;&nbsp;&nbsp;" + 
                      "Magnitude" +"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + 
                      "Place" +"<br>");
            for(var i = 0; i < results.length; i++){
                if(distanceTo(parseFloat(results[i].latitude), parseFloat(results[i].longitude)) < radius){
                    var line = results[i].date.substring(0, 10) + "&nbsp;&nbsp;&nbsp;" + 
                    parseFloat(results[i].latitude).toFixed(3) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                    parseFloat(results[i].longitude).toFixed(3) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                    parseFloat(results[i].magnitude).toFixed(1) + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                    results[i].place +
                    "<br>";
                    res.write(line);
                    count++;
                }                
            }            
            res.end("<br>The number of historical earthquakes within " +  radius + " km is: " + count);
        }
        else{
            console.log(err);
        }
    });   
})

//gets the distance from the input location to a location of a specific historical earthquake location 
function distanceTo(lat2, lng2){
    var earthRadius = 6371;
	var deltaLat = degToRad(lat2 - lat);
	var deltaLong = degToRad(lng2 - lng);
	var a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(degToRad(lat))
			* Math.cos(degToRad(lat2)) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var distance = earthRadius * c;
	return distance;
}

//conver a degree to radian
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
  };

//bond the port
app.listen(3000, function() {
    console.log('listening on port 3000!');
  });