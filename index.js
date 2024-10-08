const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location");
const searchContainer = document.querySelector(".form-container");
const loader = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".info-container");
const errorContainer = document.querySelector(".error-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");

let currentTab = userTab;
currentTab.classList.add("current-tab");
const API_KEY = "";

function switchTab(switchedTab) {
  // If we are not clicking on same(current) Tab
  if (switchedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = switchedTab;
    currentTab.classList.add("current-tab");

    // If we are now present in Search Weather Tab after switching
    if (!searchContainer.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchContainer.classList.add("active");
    }
    // If we are now present in Your Weather Tab after switching
    else {
      searchContainer.classList.remove("active");
      userInfoContainer.classList.remove("active");
      getfromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

// Check if location coordinates are present in storage session or not
function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");

  // If Coordinates not found, show Grant Location Access UI
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  }
  // Coordinates Found, fetch Weather Data
  else {
    const coordinates = JSON.parse(localCoordinates); // Convert Json String to JSON Object
    fetchWeatherInfo(coordinates);
  }
}

// Fetch Weather Data from API using coordinates
async function fetchWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;

  // Remove Grant Access Container
  grantAccessContainer.classList.remove("active");

  // Show Loader till the data is being fetched
  loader.classList.add("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    // Remove Loader after getting data
    loader.classList.remove("active");
    console.log(data);

    // Show information conatiner
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loader.classList.remove("active");
    // Show error UI
    errorContainer.classList.add("active");
  }
}

// Show fetched data from API on UI
function renderWeatherInfo(weatherInfo) {
  // Fetch elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  // Destructure weather data and put into UI
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  // Check if browser supports Geolocation API or not
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation support is not available for your browser");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates)); // Store latitude & longitude in session storage
  fetchWeatherInfo(userCoordinates); // Fetch Weather for these coordinates
}

grantAccessButton.addEventListener("click", getLocation);
