const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

let currentTab = userTab;
currentTab.classList.add("current-tab");

function switchTab(switchedTab) {
  if (switchedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = switchedTab;
    currentTab.classList.add("current-tab");
  }
}

userTab.addEventListener("click", () => {
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});
