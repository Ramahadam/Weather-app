const app = document.querySelector(".app");
const loader = document.getElementById("autoLoader");
const errorMessage = document.getElementById("error-message ");
const searchBtn = document.getElementById("searchButton");

const state = {
  weekForcast: [],
};

const getLocation = new Promise(
  (resolve) => {
    return navigator.geolocation.getCurrentPosition(resolve);
  },
  (reject) => {
    console.log("Rejected");
  }
);

/*________________________________ Fetching user's location from browser TODO: Convert to Async Await function ________________________________________*/
getLocation
  .then((pos) => {
    const { latitude: lat, longitude: lon } = pos.coords;

    return fetch(
      `https://geocode.xyz/${lat},${lon}?geoit=json&auth=490818789357540377893x113955`
    );
    // return fetch(
    //   `https://api.openweathermap.org/data/2.5/forecast?q=london&appid=c4527f71d691e7e12d76b81a49767c52`
    // ); TODO this links fetch weather forcast for more than 5 days.
    // return fetch(
    //   `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=c4527f71d691e7e12d76b81a49767c52`
    // );TODO: this works with lat and long
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    // console.log(data);
    return fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${data.region}&appid=c4527f71d691e7e12d76b81a49767c52`
    );
  })
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
  });

/*________________________________ Set state ________________________________________*/
const setData = function (data) {
  const { name, country } = data.city;
  const list = data.list.slice(0, 7);
  const celsiusConvert = 273.15;

  state.region = { name, country };

  list.forEach((week) => {
    state.weekForcast.push({
      date: week.dt_txt,
      visibility: week.visibility,
      windSpeed: week.wind.speed,
      windDeg: week.wind.deg,
      weather: week.weather[0].description,
      icon: week.weather[0].icon,
      humidity: week.main.humidity,
      pressure: week.main.pressure,
      tempreture: Math.ceil(week.main.temp - celsiusConvert),
    });
  });

  console.log(state);
};

/*________________________________ Get weather data  API ________________________________________*/
const getWeatherData = async function (city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c4527f71d691e7e12d76b81a49767c52`
    );

    const data = await res.json();
    setData(data);
  } catch (error) {
    console.log(`Oops!! ${error}`);
  }
};

/*________________________________ Validate user input data ________________________________________*/
const validateInputUser = function (inputUser) {
  validRegEx = /^[^\\\/&$#_)(*&^%$#@!~><)]*$/;
  return inputUser.match(validRegEx);
};

/*________________________________ Markup ________________________________________*/
const renderMarkup = function () {
  console.log(state);
};

/*________________________________Events➡️ ________________________________________*/
searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  const inputUser = document.getElementById("inputUser").value.trim();
  errorMessage.innerHTML = "";

  //if the user entered wrong city name
  if (!validateInputUser(inputUser) || inputUser === "") {
    errorMessage.innerHTML = " Oops!! Invalid city name";
    return;
  }

  //TODO:if the user eneter valid name
  getWeatherData(inputUser);
});
