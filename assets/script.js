const apiKey = "3e4d6f614ff0f8ef33d65fe860319afd";

// DRAW THE PAGE
function main() {
  // Calls last searched city from local storage
  const previousCitiesArr = fetchLocalStorage();

  const cityName = previousCitiesArr[0];
  drawCityButtons(previousCitiesArr);
  // call weather API
  const queryURL = createQueryURL(cityName);
  fetchCityData(queryURL);
}

// RETRIEVES LAST CITY THAT WAS SEARCHED
function fetchLocalStorage() {
  const previousCitiesString = JSON.parse(
    localStorage.getItem("previousCities")
  );
  const previousCitiesArr = JSON.parse(previousCitiesString);
  console.log(
    "in local storage fetch",
    typeof previousCitiesArr,
    previousCitiesArr
  );
  if (!previousCitiesArr) {
    return ["Minneapolis"];
  } else {
    return previousCitiesArr;
  }
}

function setLocalStorage(previousCitiesArr) {
  localStorage.setItem("previousCities", JSON.stringify(previousCitiesArr));
}

// RETRIEVES INPUT FROM THE SEARCH BAR
function searchCity(e) {
  const newCity = $("#searchInput").val();
  // If the search button is clicked with no text, return
  if (newCity === "") {
    return;
  }
  updatePreviousCitiesCalled(newCity);
  console.log(newCity);
  const newURL = createQueryURL(newCity);
  fetchCityData(newURL);
}

function searchPreviousCity(city) {
  const newURL = createQueryURL(city);
  fetchCityData(newURL);
}

function fetchCityData(url) {
  console.log(url);
  $.ajax({
    url: url,
    method: "GET",
  }).then((resp) => {
    console.log("This is the first resp", resp);
    const cityData = parseResp(resp);
    console.log("CityData in da house");

    uvIndex(cityData);
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

// SECOND API CALL FOR UV INDEX VALUE
function uvIndex(cityData) {
  const url = createUVQueryUrl(
    cityData.day0.coordinates.lat,
    cityData.day0.coordinates.lon
  );
  //this function above takes 2 arguments  ^^

  $.ajax({
    url: url,
    method: "GET",
  }).then((resp) => {
    // adds UV Index value to cityData object
    cityData.day0.uvInd = resp.value;

    drawPage(cityData);
  });
}

function createUVQueryUrl(lat, lon) {
  return `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
}

// window.uvIndex = uvIndex;

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
  // Display UV index
  $("#uv").html(
    '<div>UV Index: <span id="badge-id" class="badge">' +
      cityData.day0.uvInd +
      "</span></div>"
  );

  function addUVcolor(UV) {
    if (cityData.day0.uvInd <= 5) {
      $("#badge-id").attr("class", "badge-warning");
    }
    if (cityData.day0.uvInd >= 6 && cityData.day0.uvInd <= 7) {
      $("#badge-id").attr("class", "badge-orange");
    }
    if (cityData.day0.uvInd >= 8 && cityData.day0.uvInd <= 10) {
      $("#badge-id").attr("class", "badge-danger");
    }
    if (cityData.day0.uvInd >= 11) {
      $("#badge-id").attr("class", "badge-purple");
    }
  }
  addUVcolor(cityData.day0.uvInd);

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

// CLICK EVENT FOR SEARCH BUTTON
$("#searchButton").on("click", () => {
  console.log("CLICK");
  searchCity();
});

function updatePreviousCitiesCalled(newCity) {
  // get local storage and parse the string to usable JSON
  const previousCitiesArr = fetchLocalStorage();
  // add newCity to the front (index 0) of the array
  previousCitiesArr.unshift(newCity);
  // store in local storage
  setLocalStorage(JSON.stringify(previousCitiesArr));
  // pass that array into a function that draws the city buttons
  drawCityButtons(previousCitiesArr);
}

function drawCityButtons(previousCitiesArr) {
  let cityNamesButtonsHTML = "";

  previousCitiesArr.forEach((city) => {
    cityNamesButtonsHTML += `<button type="button" class="btn-group-vertical city-button">${city}</button>`;
  });

  // add cityNamesButtonsHTML to the div with the right ID on the page
  $("#previous-cities-called").html(cityNamesButtonsHTML);
  // CLICK EVENT FOR CITY BUTTONS
  $(".btn-group-vertical").on("click", (e) => {
    let city = e.target.innerText;
    searchPreviousCity(city);
  });
}

main();
