let cityDisplay = $("#city");
let tempDisplay = $("#temp");
let humidityDisplay = $("#humidity");
let windDisplay = $("#wind");
let UVDisplay = $("#uv");
let historyList = $("#history");

var today = new Date();
var todayFormat = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();

var previousSearches = [];
if(localStorage.getItem("recordedHistory")){
    previousSearches=localStorage.getItem("recordedHistory");
    previousSearches=JSON.parse(previousSearches);
    let city = previousSearches[0];
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=bf146f8b2cd713f851ae0f254eb2bd20",
        method: "GET"
    }).then(function (response) {

        generateMain(response);
        generateUV(response);
        generateForecast(response);

    })
    previousSearches.forEach(element => {
        let newHistory = $("<li>");
        newHistory.text(element);
        newHistory.addClass("list-group-item");
        newHistory.data("whichCity", element);

        historyList.append(newHistory);
    });
}


$("form").on("submit", function (event) {
    event.preventDefault();
    clearCurrent();

    let city = $("#searchBar").val();
    if(!city){
        return;
    }
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=bf146f8b2cd713f851ae0f254eb2bd20",
        method: "GET"
    }).then(function (response) {

        generateMain(response);
        generateUV(response);
        generateForecast(response);

        let newHistory = $("<li>");
        newHistory.text(response.name);
        newHistory.addClass("list-group-item");
        newHistory.data("whichCity", response.name);

        historyList.prepend(newHistory);
        
        previousSearches.unshift(response.name);
        if(previousSearches.length>=10){
            previousSearches.pop();
        }
        localStorage.setItem("recordedHistory", JSON.stringify(previousSearches));


    })
})


$("#history").on("click", function (event) {
    clearCurrent();
    let city = $(event.target).data("whichCity");
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=bf146f8b2cd713f851ae0f254eb2bd20",
        method: "GET"
    }).then(function (response) {

        generateMain(response);
        generateUV(response);
        generateForecast(response);

    })
})


function clearCurrent() {
    cityDisplay.empty();
    $("#mainIcon").remove();
    tempDisplay.empty();
    humidityDisplay.empty();
    windDisplay.empty();
    UVDisplay.empty();
}

function generateMain(response) {
    cityDisplay.text(`${response.name}   ${todayFormat}`);

    let weatherIcon = $("<img>");
    weatherIcon.attr("src", `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
    weatherIcon.attr("alt", response.weather[0].description);
    weatherIcon.attr("id","mainIcon")
    weatherIcon.addClass("img-fluid");
    weatherIcon.css("width", "8%")
    $("#cityLabel").append(weatherIcon);

    tempDisplay.text("Temperature: " + response.main.temp + " \u2109");
    humidityDisplay.text("Humidity: " + response.main.humidity + "%");
    windDisplay.text("Wind Speed: " + response.wind.speed + " MPH");

}

function generateUV(response) {

    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?appid=bf146f8b2cd713f851ae0f254eb2bd20&lat=${response.coord.lat}&lon=${response.coord.lon}`,
        method: "GET"
    }).then(function (result) {

        UVDisplay.text("UV Index: ");
        let uv = $("<button>");
        let uvIndex = parseFloat(result.value);
        if (uvIndex < 2.5) {
            uv.addClass("btn btn-success");
        } else if (uvIndex >= 2.5 && uvIndex < 5.5) {
            uv.addClass("btn btn-warning");
        } else if (uvIndex >= 5.5 && uvIndex < 8.5) {
            uv.addClass("btn btn-warning-high")
        } else {
            uv.addClass("btn btn-danger")
        }
        uv.text(uvIndex);
        UVDisplay.append(uv);
    })
}

function generateForecast(response) {

    $.ajax({
        url: `http://api.openweathermap.org/data/2.5/onecall?lat=${response.coord.lat}&lon=${response.coord.lon}&exclude=hourly,minutely&units=imperial&appid=bf146f8b2cd713f851ae0f254eb2bd20`,
        method: "GET"
    }).then(function (response) {
        for (let i = 0; i < 5; i++) {
            $(`#${i}Day`).text((today.getMonth() + 1) + '/' + (today.getDate() + 1 + i) + '/' + today.getFullYear())
            $(`#${i}Icon`).attr("src", `http://openweathermap.org/img/wn/${response.daily[i].weather[0].icon}@2x.png`).attr("alt", response.daily[i].description);
            $(`#${i}Temp`).text("Temp: " + response.daily[i].temp.day + " \u2109");
            $(`#${i}Humidity`).text("Humidity: " + response.daily[i].humidity + "%");
        }
    })

}