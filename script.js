let cityDisplay = $("#city");
let tempDisplay = $("#temp")
let humidityDisplay = $("#humidity");
let windDisplay = $("#wind");
let UVDisplay = $("#uv");

var today = new Date();
var todayFormat = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();


$("form").on("submit", function (event) {
    event.preventDefault();
    clearCurrent();
    
    let city = $("#searchBar").val();
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=bf146f8b2cd713f851ae0f254eb2bd20",
        method: "GET"
    }).then(function (response) {

        generateMain(response);
        generateUV(response);

        $("#history").append($("<li>").text(response.name).addClass("list-group-item"))
    })

    
})


function clearCurrent() {
    cityDisplay.empty();
    tempDisplay.empty();
    humidityDisplay.empty();
    windDisplay.empty();
    UVDisplay.empty();
}

function generateMain(response) {
    console.log(response);
    cityDisplay.text(`${response.name}   ${todayFormat}`);
    let weatherIcon = $("<img>");
    weatherIcon.attr("src", `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`).attr("alt", response.weather[0].description);
    weatherIcon.addClass("img-fluid")
    cityDisplay.append(weatherIcon);

    tempDisplay.text("Temperature: " + response.main.temp + " \u2109");
    humidityDisplay.text("Humidity: " + response.main.humidity + "%");
    windDisplay.text("Wind Speed: " + response.wind.speed + " MPH");

}

function generateUV(response) {

    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?appid=bf146f8b2cd713f851ae0f254eb2bd20&lat=${response.coord.lat}&lon=${response.coord.lon}`,
        method: "GET"
    }).then(function (result) {
        console.log(result)
        UVDisplay.text("UV Index: ");
        let uv = $("<button>");
        uv.addClass("btn btn-danger")
        uv.text(result.value);
        UVDisplay.append(uv);
    })
}