var apiKey = "b2e132f56dc09569a442a9db110b61f5";

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

// http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID={YOUR API KEY}
// api key b2e132f56dc09569a442a9db110b61f5
 //const apiKey = b2e132f56dc09569a442a9db110b61f5;
