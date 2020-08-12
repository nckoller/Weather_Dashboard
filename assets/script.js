const apiKey = "3e4d6f614ff0f8ef33d65fe860319afd";

// DRAW THE PAGE
function main() {
  // set LocalStorage var = const
  const previousCitiesArr = fetchLocalStorage();

  const cityName = previousCitiesArr[0];
  // call weather API
  const queryURL = createQueryURL(cityName);
  fetchCityData(queryURL);
  // parse the data

  // display the data
}

// RETRIEVES LAST CITY THAT WAS SEARCHED
function fetchLocalStorage() {
  const previousCitiesArr = JSON.parse(localStorage.getItem("previousCities"));
  if (!previousCitiesArr) {
    return ["Minneapolis"];
  } else {
    return previousCitiesArr;
  }
}

function setLocalStorage() {
  localStorage.setItem("previousCities", JSON.stringify(newCity));
}

// RETRIEVES INPUT FROM THE SEARCH BAR
function searchCity(e) {
  const newCity = $("#searchInput").val();
  if (newCity === "") {
    return;
  }
  updatePreviousCitiesCalled(newCity);
  console.log(newCity);
  const newURL = createQueryURL(newCity);
  fetchCityData(newURL);
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
    //change this next line to your UV Index function instead of drawPage()
    //have it take cityData as an arg
    drawPage(cityData);
    //
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

function uvIndex(cityData) {
  //const url = createUVQueryUrl(cityData.day0.coordinates.lat, cityData.day0.coordinates.lon)
  //this function above takes 2 arguments  ^^

  $.ajax({
    url: url,
    method: "GET",
  }).then((resp) => {
    //add UV index from the response to cityData.day0.uvIndex = resp.uvIndex
    //finally, call drawPage(cityData) and delete the drawPage call above
  });
  //this ajax call will work just like the ajax call above
  // `https://api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37`+API KEY     <-- pop this URL out into its own function like the other URL
}

// Draws the page
function drawPage(cityData) {
  const currentDate = new Date();
  console.log("In drawPage", cityData);
  const iconURL = `https://openweathermap.org/img/wn/${cityData.day0.icon}@2x.png`;
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
  $("#temp").text("Temperature: " + cityData.day0.temperature + " °F");
  // Display current humidity
  $("#humidity").text("Humidity: " + cityData.day0.humidity + "%");
  // Display current wind speed
  $("#wind").text("Wind Speed: " + cityData.day0.windSpeed + " MPH");

  // Five Day Forecast Cards
  const cardRow = $("#forecastCards");
  let forecastCardTemplate = "";

  for (i = 1; i < 6; i++) {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + i);

    const iconSrc = `https://openweathermap.org/img/wn/${
      cityData[`day${i}`].icon
    }@2x.png`;
    const temp = cityData[`day${i}`].temperature;
    const humidity = cityData[`day${i}`].humidity;
    forecastCardTemplate += `<div class="card" style="width: 9rem;"><div class="card-body"><div class="card-title">${nextDay.toLocaleDateString()}</div><img id="forecastIcon" src=${iconSrc}><img><div class="card-text">Temp: ${temp} °F</div><div class="card-text">Humidity: ${humidity}%</div></div></div>`;
  }
  cardRow.html(forecastCardTemplate);
}

$("#searchButton").on("click", () => {
  console.log("CLICK");
  searchCity();
});
function generateNewBtn() {}

function updatePreviousCitiesCalled(newCity) {
  // get local storage and parse the string to usable JSON
  // if the local storage array is 8 items long, remove the last item
  // add newCity to the front (index 0) of the array
  // store all that in local storage
  // pass that array into a function that draws the city buttons
}

function drawCityButtons(cityNamesArr) {
  let cityNamesButtonsHTML = "";
  cityNamesArr.forEach((cityName) => {
    // do some templating here
    // add that templating to cityNamesButtonsHTML
  });
  // add cityNamesButtonsHTML to the div with the right ID on the page
}

main();

//   UV Index Number
// weatherObj.UV = api.openweathermap.org/data/2.5/uvi?lat=37.75&lon=-122.37
