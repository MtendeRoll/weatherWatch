var apiKey = "6fde8c5e7458f62b1a5410355e4aac5f";
var searchInputEl = document.querySelector("#city-search");
var weatherFormEl = document.querySelector("#city-form");
var weatherInfoEl = document.querySelector("#weather-div");
var cityHistoryEl = document.querySelector("#listed-cities");
var cityButtonEl;

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
weatherFormEl.addEventListener("click", searchSubmitHandler);

//fetching weather API
var cityData = function (cityName) {
  var weatherApi = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&units=metric&appid=" + apiKey;
  fetch(weatherApi)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var lat = data[0].lat;
          var long = data[0].lon;
          weatherCoordinates(lat, long, cityName);
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
var weatherCoordinates = function (lat, long, cityName) {
  var weatherApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,alerts&units=metric&appid=" + apiKey;
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
        alert("Error: City information Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Weather Dashboard");
    });
};

var displayWeather = function (cityName, icon, temp, hum, wind, uv, daily) {
  weatherInfoEl.innerHTML = " ";

  cityButtonRepeatEl = document.getElementById(cityName);
  if (!cityButtonRepeatEl) {
    cityButtonEl = document.createElement("button");
    cityButtonEl.setAttribute("class", "city-btn");
    cityButtonEl.setAttribute("id", cityName);
    cityButtonEl.textContent = cityName;
    cityHistoryEl.appendChild(cityButtonEl);
    saveSearch(cityName);
  }

  var headingDivEl = document.createElement("div");
  headingDivEl.setAttribute("class", "card forecast col-12");
  weatherInfoEl.append(headingDivEl);

  var weatherHeading = document.createElement("h3");
  weatherHeading.setAttribute("class", "card-header card-head-back today-date");
  weatherHeading.innerHTML = cityName + " (" + moment().format("LL") + ") " + "<img src=http://openweathermap.org/img/wn/" + icon + "@2x.png>";
  headingDivEl.append(weatherHeading);

  var weatherInfoDivEl = document.createElement("div");
  weatherInfoDivEl.setAttribute("class", "card-body");
  headingDivEl.appendChild(weatherInfoDivEl);

  var temp = Math.floor(temp);
  var wind = Math.floor(parseInt(wind) * 1.609);
  var infoArray = ["Temp: " + temp + "°C", "Wind: " + wind + " KM/H ", "Humidity: " + hum + " %"];
  for (var i = 0; i < infoArray.length; i++) {
    var infoItem = document.createElement("p");
    infoItem.setAttribute("class", "card-text");
    infoItem.innerHTML = infoArray[i];
    weatherInfoDivEl.appendChild(infoItem);
  }
  var infoItemUV = document.createElement("p");
  infoItemUV.innerHTML = "UV Index: " + "<span>" + uv + "</span>";
  infoItemUV.setAttribute("class", "card-text");
  weatherInfoDivEl.appendChild(infoItemUV);
  var spanUV = document.querySelector("span");

  if (uv < 3) {
    spanUV.setAttribute("id", "low");
  } else if (uv >= "3" && uv <= "5") {
    spanUV.setAttribute("id", "moderate");
  } else if (uv >= "6" && uv <= "7") {
    spanUV.setAttribute("id", "high");
  } else if (uv >= "8" && uv <= "10") {
    spanUV.setAttribute("id", "veryHigh");
  } else if (uv >= "11") {
    spanUV.setAttribute("id", "extreme");
  }

  var fiveDayHeaderDivEl = document.createElement("div");
  fiveDayHeaderDivEl.setAttribute("class", "col-12 mt-20");
  fiveDayHeaderDivEl.innerHTML = "<h4 class='five-day-header'>Five-Day Forecast:</h4>";
  weatherInfoEl.appendChild(fiveDayHeaderDivEl);

  for (var i = 1; i < daily.length - 2; i++) {
    var cardDivEl = document.createElement("div");
    cardDivEl.setAttribute("class", "card col-sm-12 col-lg-2 mb-2");
    weatherInfoEl.appendChild(cardDivEl);

    var forecastDate = document.createElement("h4");
    forecastDate.setAttribute("class", "card-header card-head-back forecast-head px-auto");
    forecastDate.textContent = moment().add([i], "d").format("LL");
    cardDivEl.append(forecastDate);

    var forecastInfoDiv = document.createElement("div");
    forecastInfoDiv.setAttribute("class", "card-body");
    cardDivEl.appendChild(forecastInfoDiv);

    var iconEl = daily[i].weather[0].icon;
    var forecastImg = document.createElement("div");
    forecastImg.innerHTML = "<img src=http://openweathermap.org/img/wn/" + iconEl + "@2x.png>";
    forecastInfoDiv.append(forecastImg);

    var tempEl = Math.floor(daily[1].temp.day);
    var windEl = Math.floor(parseInt(daily[i].wind_speed) * 1.609);
    var humEl = daily[i].humidity;
    var infoArrayForecast = ["Temp: " + tempEl + "°C", "Wind: " + windEl + " KM/H ", "Humidity: " + humEl + " %"];
    for (var j = 0; j < infoArrayForecast.length; j++) {
      var infoItemForecast = document.createElement("p");
      infoItemForecast.setAttribute("class", "card-text");
      infoItemForecast.innerHTML = infoArrayForecast[j];
      forecastInfoDiv.appendChild(infoItemForecast);
    }
  }
};

// function that saves search history
function saveSearch(cityName) {
  var cityArray = JSON.parse(window.localStorage.getItem("cityArray")) || [];
  if (!cityArray.includes(cityName)) {
    cityArray.push(cityName);
  }
  localStorage.setItem("cityArray", JSON.stringify(cityArray));
}

//function that gets search history
var getSearchHistory = function () {
  cityHistoryEl.innerHTML = "";
  var savedCities = JSON.parse(localStorage.getItem("cityArray")) || [];
  for (var i = 0; i < savedCities.length; i++) {
    cityData(savedCities[i]);
  }
};
getSearchHistory();

//function to get information on the button cityName
$("body").on("click", ".city-btn", function () {
  console.log("click!");
  var buttonText = $(this).text();
  console.log(buttonText);
  cityData(buttonText);
});
