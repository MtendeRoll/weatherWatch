var apiKey = "5694cfe0f32c250ffefcb4867d8815e7";
var searchInputEl = document.querySelector("#search-city");
var searchBtnEl = document.querySelector("#search-btn");
var historyEl = document.querySelector(".history");
var moment = moment().format("LL");
var fiveDayForecastEl = document.querySelector("#five-days");
var currentWeather = document.querySelector("today");

//search input function
var searchSubmitHandler = function (event) {
  event.preventDefault();

  var cityName = searchInputEl.value.trim();
  if (cityName) {
    cityData(cityName);
    saveSearch(cityName);
    searchInputEl.value = "";
  } else {
    alert("Please enter a city name.");
  }
};
searchInputEl.addEventListener("click", searchSubmitHandler);

//fetching weather API
var cityData = function (cityName) {
  var weatherApi = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + apiKey;

  fetch(weatherApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var lat = data[0].lat;
          var long = data[0].long;
          getWeather(lat, long, cityName);
        });
      } else {
        alert("No City was found");
      }
    })
    .catch(function (error) {
      alert("Can't connect");
    });
};

//fetching weather API by cordinates
var getWeather = function (lat, long, cityName) {
  var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=minutely,hourly,alerts&units=imperial&appid=be7c6540adf0957dc646903e1ce56c09";
  fetch(weatherApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var icon = data.current.weather[0].icon;
          var temp = data.current.temp;
          var hum = data.current.humidity;
          var wind = data.current.wind_speed;
          var uv = data.current.uvi;
          var daily = data.daily;
          displayWeather(cityName, icon, temp, hum, wind, uv, daily);
        });
      } else {
        alert("Error: City Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weather Dashboard");
    });
};

var weatherCoordinates = function (lat, long) {
  var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;
  fetch(weatherApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(cityName, icon, temp, hum, wind, uv, daily);
        });
      } else {
        alert("Error: City Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weather Dashboard");
    });
};

var displayWeather = function (cityName, icon, temp, hum, wind, uv, daily) {};

function saveSearch(cityName) {
  var cityArray = JSON.parse(window.localStorage.getItem("cityArray")) || [];
  if (cityArray.indexOf(cityName) !== -1) {
    return;
  }
  cityArray.push(cityName);
  localStorage.setItem("city", JSON.stringify(cityArray));
  getRecentSearch();
}
