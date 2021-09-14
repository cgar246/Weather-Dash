var apiKey = "4f062d3d9ffc506ff6103fe8249b0a60";
var formEl = document.querySelector('#city-search');
var pongaLaCiudadEl = document.querySelector('#city-search-input');
var elButtonEl = document.querySelector('#search-btn');
var historiaEl = document.querySelector('#city-history');
var todaysForecastEl = document.querySelector('#current-forecast');
var elDiaDeSemanaEl = document.querySelector('#city-date');
var weatherEl = document.querySelector('#weather-icon');
var todaysTempEl = document.querySelector('#current-temp');
var laHumedadEl = document.querySelector('#current-humidity');
var elVientoEl = document.querySelector('#current-wind');
var currentSunEl = document.querySelector('#current-uv-number')
var currentSpan = document.querySelector('#current-uv-span');
var semanaTempEl = document.querySelector('#week-forecast');
var forecastweeklyEl = document.querySelector('#week-forecast-h2');

http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={4f062d3d9ffc506ff6103fe8249b0a60}
console.log(pongaLaCiudadEl);
//const apiKey = 4f062d3d9ffc506ff6103fe8249b0a60;
var submittingInfo = function(event) {
    event.preventDefault();
    console.log(event);
    console.log(pongaLaCiudadEl);
    // get value from input element
    var ciudad = pongaLaCiudadEl.value.trim();
    console.log(ciudad);
    if (ciudad) {
        agaraCiudad(ciudad); 
        pongaLaCiudadEl.value = "";
    } else {
        alert("Please enter a City");
    }
};

var cityChooseClick = function(event) {
    agaraCiudad(event.target.textContent);
};

var agaraCiudad = function(ciudad) {

    var dayUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + ciudad + "&appid=" + "4f062d3d9ffc506ff6103fe8249b0a60";
    console.log(ciudad);
    if (ciudad) {
        fetch(dayUrl)
            .then(function(response) {
                if (response.ok) {
                    response.json().then(function(data) {
                        console.log(data);
                        weatherForecast(data[0].name, data[0].lon, data[0].lat);
                    });
                } else {
                    alert("Error: " + response.statusText);
                }
            })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
    }    
};


var weatherForecast = function(ciudad, lon, lat) {
    var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
    fetch(weatherUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function({current, daily}) {
                    displayingTodaysWeather(ciudad, current, daily);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
};


function getIcon(iconCode) {
    return 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png';
}

var displayingTodaysWeather = function(ciudad, current, daily) {
    var date = new Date(current.dt * 1000);
    date = date.toLocaleDateString("en-us")
    var weatherDaily = current.weather[0].description;
    var iconincWeather= getIcon(current.weather[0].icon);
    var dayTemp = current.temp + String.fromCharCode(176) + "F";
    var humidifydaily = current.humidity + "%";
    var windyDay = current.wind_speed + " MPH";
    var sunRays = current.uvi;

    elDiaDeSemanaEl.textContent = ciudad + date;
    weatherEl.setAttribute("src", iconincWeather);
    weatherEl.setAttribute("alt", `Forcast is ${weatherDaily}`);
    todaysTempEl.textContent = "Temperature: " + dayTemp;
    laHumedadEl.textContent = "Humidity: " + humidifydaily;
    elVientoEl.textContent = "Wind: " + windyDay;
    currentSunEl.textContent = "UV:";
    currentSpan.textContent = sunRays;

    // week forecast
    forecastweeklyEl.textContent = "5 day forecast";
    for (i = 0; i < 5; i++) {

    var divEl = document.createElement("div");
        divEl.classList.add("future-forecast");
        console.log(daily[i].dt)
        var dateOfTheWeek = new Date(daily[i].dt * 1000);
        dateOfTheWeek = dateOfTheWeek.toLocaleDateString("en-us")
        console.log(dateOfTheWeek)
        var weekWeather = daily[i].weather[0].description;
        var weekWeatherIcon = getIcon(daily[i].weather[0].icon);
        var weekTemp = daily[i].temp.day + String.fromCharCode(176) + "F";
        var weekHumidity = daily[i].humidity + "%";

        var weekEl = document.createElement("h3");
            weekEl.textContent = dateOfTheWeek;
            divEl.appendChild(weekEl);

        var weekForecastImageEl = document.createElement("img");
            weekForecastImageEl.setAttribute("src", weekWeatherIcon);
            weekForecastImageEl.setAttribute("alt", `Forecast is ${weekWeather}`);
            divEl.appendChild(weekForecastImageEl);

        var weekTempEl = document.createElement("p");
            weekTempEl.textContent = "Temp: " + weekTemp;
            divEl.appendChild(weekTempEl);

        var weekHumEl = document.createElement("p");
            weekHumEl.textContent = "Humidity: " + weekHumidity;
            divEl.appendChild(weekHumEl);

            semanaTempEl.appendChild(divEl);
    }
};

// when a city is searched, save in localStorage
function searchesSaved(ciudad) {
        var history = JSON.parse(localStorage.getItem("history")) || [];
        history.push(ciudad);
        history = history.filter(function(value, index, array) {
            return array.indexOf(value) === index
    });
        if (history.length > 10) {
            history = history.slice(1, 11);
    }
    localStorage.setItem("history", JSON.stringify(history));
    loadingNow();
}

// when page is loaded or new city is added to searchHistory,
function loadingNow() {
    var history = JSON.parse(localStorage.getItem("history")) || [];
    searchHistoryListEl.innerHTML = "";

    for (let i = 0; i < history.length; i++) {
        var searchHistoryListItemEl = document.createElement("li");
        searchHistoryListItemEl.textContent = history[i];

        searchHistoryListEl.prepend(searchHistoryListItemEl);
    }
}

formEl.addEventListener("submit", submittingInfo);
