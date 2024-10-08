const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location");
const searchContainer = document.querySelector(".form-container");
const loader = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".info-container");

let currentTab = userTab;
currentTab.classList.add("current-tab");

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
