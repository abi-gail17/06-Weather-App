const apiKey = '10304b1943ce2a849d95ba1a10814561';

var weatherDaily = document.getElementById('dailyWeather');
var searchBtn = document.getElementById('searchBtn');
var cityInput = document.getElementById('city-input');
var weeklyForecastContainer = document.getElementById('weeklyForecast');
var searchHistoryList = document.getElementById('historyList');

const historyList = JSON.parse(localStorage.getItem("historyList")) || [];

function updateSearchHistory() {
    searchHistoryList.innerHTML = '';

    historyList.forEach(function (city) {
        createRow(city);
    });
}

function createRow(text) {
    var listItem = document.createElement('li');
    listItem.classList.add('search-history-list');
    listItem.textContent = text;
    searchHistoryList.appendChild(listItem);
}

function saveToLocalStorage(searchCity) {
    if (historyList.indexOf(searchCity) === -1) {
        historyList.push(searchCity);
        localStorage.setItem('historyList', JSON.stringify(historyList));
        updateSearchHistory();
    }
}

searchBtn.addEventListener('click', function () {
    var searchCity = cityInput.value.trim();
    if (searchCity !== '') {
        dailyWeather(searchCity);
        weekWeather(searchCity);
        saveToLocalStorage(searchCity);
    }
});

searchBtn.addEventListener('keypress', function (event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode === 13) {
        event.preventDefault();
        var searchCity = cityInput.value.trim();
        dailyWeather(searchCity);
        weekWeather(searchCity);
        saveToLocalStorage(searchCity);
    }
});

if (historyList.length > 0) {
    var lastSearchedCity = historyList[historyList.length - 1];
    dailyWeather(lastSearchedCity);
    weekWeather(lastSearchedCity);
}

updateSearchHistory();

function dailyWeather(searchCity) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&appid=" + apiKey + "&units=metric")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (historyList.includes(searchCity) === -1) {
                historyList.push(searchCity);
                localStorage.setItem("historyList", JSON.stringify(historyList));
                createRow(searchCity);
            }

            weatherDaily.innerHTML = "";

            var title = document.createElement("h3");
            title.textContent = data.name + " (" + new Date().toLocaleDateString() + ")";

            var imgTag = document.createElement("img");
            imgTag.src = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";

            var dailyCard = document.createElement("div");
            dailyCard.classList.add('day-weather-card')

            var dailyCardBody = document.createElement("div");
            dailyCardBody.classList.add('day-weather-body');

            var dailyWind = document.createElement("p");
            dailyWind.textContent = "Wind: " + data.wind.speed + " KMH";

            var dailyHumid = document.createElement("p");
            dailyHumid.textContent = "Humidity: " + data.main.humidity + " %";

            var dailyTemp = document.createElement("p");
            dailyTemp.textContent = "Temperature: " + data.main.temp + "°C";

            dailyCardBody.appendChild(dailyWind);
            dailyCardBody.appendChild(dailyHumid);
            dailyCardBody.appendChild(dailyTemp);

            title.appendChild(imgTag);
            dailyCardBody.appendChild(title);

            dailyCard.appendChild(dailyCardBody);
            weatherDaily.appendChild(dailyCard);
        });
}

function weekWeather(searchCity) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&appid=" + apiKey + "&units=metric")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            weeklyForecastContainer.innerHTML = "<h4>Forecast for the Week:</h4><div>";

            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.includes("15:00:00")) {
                    var fiveDayWeather = document.createElement("div");
                    fiveDayWeather.classList.add("five-days");

                    var weekCard = document.createElement("div");
                    weekCard.classList.add('week-card');

                    var weekCardBody = document.createElement("div");
                    weekCardBody.classList.add('week-card-body');

                    var weekTitle = document.createElement("h3");
                    const date = new Date(data.list[i].dt_txt);
                    const dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
                    weekTitle.textContent = dayOfWeek;


                    var weekImg = document.createElement("img");
                    weekImg.src = "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png";

                    var weekWind = document.createElement("p");
                    weekWind.textContent = "Wind: " + data.list[i].wind.speed + " KMH";

                    var weekHumidity = document.createElement("p");
                    weekHumidity.textContent = "Humidity: " + data.list[i].main.humidity + "%";

                    var weekTemp = document.createElement("p");
                    weekTemp.textContent = "Temperature: " + data.list[i].main.temp + " °C";

                    weekCardBody.appendChild(weekTitle);
                    weekCardBody.appendChild(weekImg);
                    weekCardBody.appendChild(weekWind);
                    weekCardBody.appendChild(weekHumidity);
                    weekCardBody.appendChild(weekTemp);

                    weekCard.appendChild(weekCardBody);
                    fiveDayWeather.appendChild(weekCard);
                    weeklyForecastContainer.appendChild(fiveDayWeather);
                }
            }
        });
}
