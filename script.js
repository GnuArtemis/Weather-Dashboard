// bf146f8b2cd713f851ae0f254eb2bd20
// api.openweathermap.org/data/2.5/forecast?id=524901&APPID=bf146f8b2cd713f851ae0f254eb2bd20;
$.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=bf146f8b2cd713f851ae0f254eb2bd20",
    method: "GET"
  }).then(function(response){
    console.log(response);
})