const apiKey = "3e4d6f614ff0f8ef33d65fe860319afd";

// DRAW THE PAGE
function main() {
  // set LocalStorage var = const
  const previousSearch = fetchLocalStorage();
  const cityName = "minneapolis";
  // call weather API
  const queryURL = createQueryURL(cityName);
  fetchCityData(queryURL);
  // parse the data

  // display the data
}

// RETRIEVES LAST CITY THAT WAS SEARCHED
function fetchLocalStorage() {
  return ["Minneapolis"];
}

function setLocalStorage() {
  localStorage.setItem("previousCities", JSON.stringify(newCity));
}

// RETRIEVES INPUT FROM THE SEARCH BAR
function searchCity(e) {
  console.log("e", e);
  const newCity = $("#searchInput").val();
  console.log(newCity);
  //   if the API doesn't return data, don't make a button
}

// theFunctionForCallingAPI (cityName) {
// }

function fetchCityData(url) {
  console.log(url);
  $.ajax({
    url: url,
    method: "GET",
  }).then((resp) => {
    console.log("This is the first resp", resp);
    const cityData = parseResp(resp);
    console.log("CityData in da house");
    drawPage(cityData);
  });
}

function createQueryURL(cityName) {
  return `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
}

function parseResp(resp) {
  //   JSON object with current and 5 day forecast
  const weatherObj = {
    day0: {},
    day1: {},
    day2: {},
    day3: {},
    day4: {},
    day5: {},
  };
  for (i = 0; i < 6; i++) {
    // Name of City
    weatherObj[`day${i}`].name = resp.city.name;
    // Current Weather Icon
    weatherObj[`day${i}`].icon = resp.list[i].weather[0].icon;
    // Temp converted to Farenheit
    const tempF = (resp.list[i].main.temp - 273.15) * 1.8 + 32;
    weatherObj[`day${i}`].temperature = tempF.toFixed(1);
    //Humidity
    weatherObj[`day${i}`].humidity = resp.list[0].main.humidity;
    // Wind Speed
    weatherObj[`day${i}`].windSpeed = resp.list[0].wind.speed;
    // City coordinates
    weatherObj[`day${i}`].coordinates = resp.city.coord;
  }
  console.log(weatherObj);
  return weatherObj;
}

function uvIndex() {
  // `https://api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37`+API KEY
}

// Draws the page
function drawPage(cityData) {
  const currentDate = new Date();
  console.log("In drawPage", cityData);
  const iconURL = `http://openweathermap.org/img/wn/${cityData.day0.icon}@2x.png`;
  // Heading for City and Date
  $("#currentForecast").html(
    "<h1>" +
      cityData.day0.name +
      " (" +
      currentDate.toLocaleDateString() +
      ")</h1>" +
      "<img src=" +
      iconURL +
      "><img>"
  );
  // Display current temp
  $("#temp").text("Temperature: " + cityData.day0.temperature + " F");
  // Display current humidity
  $("#humidity").text("Humidity: " + cityData.day0.humidity + "%");
  // Display current wind speed
  $("#wind").text("Wind Speed: " + cityData.day0.windSpeed + " MPH");

  // Five Day Forecast Cards
  const cardRow = $("#forecastCards");
  for (i = 1; i < 6; i++) {
    // currentDate += numberofsecondsinday
    const iconSrc = `http://openweathermap.org/img/wn/${cityData[`day${i}`]icon}@2x.png`;
    const temp = cityData[`day${i}`].temperature;
    const forecastCardTemplate = `<div class="card" style="width: 9rem;">
    <div class="card-body">
      <div class="card-title" id="forecastDate">Future Date</div>
      <img id="forecastIcon" src="http://openweathermap.org/img/wn/10d@2x.png"><img>
      <div class="card-text" id="forecastTemp">Temp</div>
      <div class="card-text" id="forecastHumidity">Humdity</div>
    </div>`;
  }
}

$("#searchButton").on("click", () => {
  console.log("CLICK");
  searchCity();
});
function generateNewBtn() {}

main();

//   UV Index Number
// weatherObj.UV = api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37
