var apiKey = "4f062d3d9ffc506ff6103fe8249b0a60";
var formEl = document.querySelector('#city-search');
var cityInputEl = document.querySelector('#city-search-input');
var searchButtonEl = document.querySelector('#search-btn');
var searchHistoryEl = document.querySelector('#city-history');
var dayForecastEl = document.querySelector('#current-forecast');
var cityDateEl = document.querySelector('#city-date');
var weatherIconEl = document.querySelector('#weather-icon');
var currentTempEl = document.querySelector('#current-temp');
var currentHumidityEl = document.querySelector('#current-humidity');
var currentWindEl = document.querySelector('#current-wind');
var currentUvEl = document.querySelector('#current-uv-number')
var currentUvSpan = document.querySelector('#current-uv-span');
var weekForecastEl = document.querySelector('#week-forecast');
var weekForcastH2El = document.querySelector('#week-forecast-h2');

http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={4f062d3d9ffc506ff6103fe8249b0a60}
console.log(cityInputEl);
//const apiKey = 4f062d3d9ffc506ff6103fe8249b0a60;
var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);
    console.log(cityInputEl);
    // get value from input element
    var cityName = cityInputEl.value.trim();
    console.log(cityName);
    //cityInputEl.reset();
    if (cityName) {
        getCityInfo(cityName); 
        cityInputEl.value = "";
    } else {
        alert("Please enter a City");
    }
};

var buttonClickHandler = function(event) {
    getCityInfo(event.target.textContent);
};



//var buttonClickHandler = function(event) 
var getCityInfo = function(cityName) {
    //var city = event.target.getAttribute("data-city");
    var dayApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + "4f062d3d9ffc506ff6103fe8249b0a60";
    console.log(cityName);
    if (cityName) {
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


var weatherInfo = function(cityName, lon, lat) {
    console.log(cityName, lon, lat)
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
    fetch(weatherApiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function({current, daily}) {
                    console.log(current, daily)
                    displayCurrentWeather(cityName, current, daily);
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

var displayCurrentWeather = function(cityName, current, daily) {
    //console.log(cityName);
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

    cityDateEl.textContent = cityName + date;
    weatherIconEl.setAttribute("src", dayWeatherIcon);
    weatherIconEl.setAttribute("alt", `Forcast is ${dayWeather}`);
    currentTempEl.textContent = "Temperature: " + dayTemp;
    currentHumidityEl.textContent = "Humidity: " + dayHumidity;
    currentWindEl.textContent = "Wind: " + dayWind;
    currentUvEl.textContent = "UV:";
    currentUvSpan.textContent = dayUv;

    // week forecast
    weekForcastH2El.textContent = "5 day forecast";
    console.log(daily)
    console.log(weekForecastEl)
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

        weekForecastEl.appendChild(weekForecastDivEl);
    }
};

// // when a city is searched, save in localStorage and add to search history. search history filters out duplicates and holds up to 10 city names.
function saveSearchHistory(cityName) {
        var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
        searchHistory.push(cityName);
        searchHistory = searchHistory.filter(function(value, index, array) {
            return array.indexOf(value) === index
    });
        if (searchHistory.length > 10) {
            searchHistory = searchHistory.slice(1, 11);
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    loadSearchHistory();
}

// // when page is loaded or new city is added to searchHistory, turn searchHistory from localStorage into clickable <li> elements that load weather data into the dashboard
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
//searchButtonEl.addEventListener("click", buttonClickHandler);