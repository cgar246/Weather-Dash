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
var currentUvEl = document.querySelector('#current-uv-number')
var currentUvSpan = document.querySelector('#current-uv-span');
var semanaTempEl = document.querySelector('#week-forecast');
var weekForcastH2El = document.querySelector('#week-forecast-h2');

http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={4f062d3d9ffc506ff6103fe8249b0a60}
console.log(pongaLaCiudadEl);
//const apiKey = 4f062d3d9ffc506ff6103fe8249b0a60;
var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);
    console.log(pongaLaCiudadEl);
    // get value from input element
    var ciudad = pongaLaCiudadEl.value.trim();
    console.log(ciudad);
    //pongaLaCiudadEl.reset();
    if (ciudad) {
        agaraCiudad(ciudad); 
        pongaLaCiudadEl.value = "";
    } else {
        alert("Please enter a City");
    }
};

var buttonClickHandler = function(event) {
    agaraCiudad(event.target.textContent);
};

var agaraCiudad = function(ciudad) {

    var dayApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + ciudad + "&appid=" + "4f062d3d9ffc506ff6103fe8249b0a60";
    console.log(ciudad);
    if (ciudad) {
        fetch(dayApiUrl)
            .then(function(response) {
                if (response.ok) {
                    response.json().then(function(data) {
                        console.log(data);
                        //searchHistory(data.name);
                        weatherInfo(data[0].name, data[0].lon, data[0].lat);
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


var weatherInfo = function(ciudad, lon, lat) {
    console.log(ciudad, lon, lat)
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
    fetch(weatherApiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function({current, daily}) {
                    console.log(current, daily)
                    displayCurrentWeather(ciudad, current, daily);
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

var displayCurrentWeather = function(ciudad, current, daily) {
    //console.log(ciudad);
    //console.log(lon);
    //console.log(lat);
    // current forecast
    var date = new Date(current.dt * 1000);
    date = date.toLocaleDateString("en-us")
    var dayWeather = current.weather[0].description;
    var dayWeatherIcon= getIcon(current.weather[0].icon);
    var dayTemp = current.temp + String.fromCharCode(176) + "F";
    var dayHumidity = current.humidity + "%";
    var dayWind = current.wind_speed + " MPH";
    var dayUv = current.uvi;

    elDiaDeSemanaEl.textContent = ciudad + date;
    weatherEl.setAttribute("src", dayWeatherIcon);
    weatherEl.setAttribute("alt", `Forcast is ${dayWeather}`);
    todaysTempEl.textContent = "Temperature: " + dayTemp;
    laHumedadEl.textContent = "Humidity: " + dayHumidity;
    elVientoEl.textContent = "Wind: " + dayWind;
    currentUvEl.textContent = "UV:";
    currentUvSpan.textContent = dayUv;

    // week forecast
    weekForcastH2El.textContent = "5 day forecast";
    console.log(daily)
    console.log(semanaTempEl)
    for (i = 0; i < 5; i++) {

    var weekForecastDivEl = document.createElement("div");
        weekForecastDivEl.classList.add("future-forecast");
        console.log(daily[i].dt)
        var weekDate = new Date(daily[i].dt * 1000);
        weekDate = weekDate.toLocaleDateString("en-us")
        console.log(weekDate)
        var weekWeather = daily[i].weather[0].description;
        var weekWeatherIcon = getIcon(daily[i].weather[0].icon);
        var weekTemp = daily[i].temp.day + String.fromCharCode(176) + "F";
        var weekHumidity = daily[i].humidity + "%";

        var weekEl = document.createElement("h3");
            weekEl.textContent = weekDate;
            weekForecastDivEl.appendChild(weekEl);

        var weekForecastImageEl = document.createElement("img");
            weekForecastImageEl.setAttribute("src", weekWeatherIcon);
            weekForecastImageEl.setAttribute("alt", `Forecast is ${weekWeather}`);
            weekForecastDivEl.appendChild(weekForecastImageEl);

        var weekTempEl = document.createElement("p");
            weekTempEl.textContent = "Temp: " + weekTemp;
            weekForecastDivEl.appendChild(weekTempEl);

        var weekHumEl = document.createElement("p");
            weekHumEl.textContent = "Humidity: " + weekHumidity;
            weekForecastDivEl.appendChild(weekHumEl);

            semanaTempEl.appendChild(weekForecastDivEl);
    }
};

// when a city is searched, save in localStorage
function saveSearchHistory(ciudad) {
        var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searchHistory.push(ciudad);
        searchHistory = searchHistory.filter(function(value, index, array) {
            return array.indexOf(value) === index
    });
        if (searchHistory.length > 10) {
            searchHistory = searchHistory.slice(1, 11);
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    loadSearchHistory();
}

// when page is loaded or new city is added to searchHistory,
function loadSearchHistory() {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistoryListEl.innerHTML = "";

    for (let i = 0; i < searchHistory.length; i++) {
        var searchHistoryListItemEl = document.createElement("li");
        searchHistoryListItemEl.textContent = searchHistory[i];

        searchHistoryListEl.prepend(searchHistoryListItemEl);
    }
}

formEl.addEventListener("submit", formSubmitHandler);
