const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const notFound = document.querySelector(".Not-found");


//variables

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

getfromSessionStorage(); 



//function for switching of tab...

function switchTab(clickedTab){

    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");

        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            notFound.classList.remove("active");

            searchForm.classList.add("active");
        }

        else{
            searchForm.classList.remove("active");
            // grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active"); 
            notFound.classList.remove("actve");

            // userInfoContainer.classList.add("active");
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


function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");

    loadingScreen.classList.add("active");

    //API CALL...

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");
        notFound.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }

    catch(err){
        loadingScreen.classList.remove("active");
        //Homework...
    }
}


function renderWeatherInfo(data) {

    // firstly we have to fetch each elements...

    const cityName = document.querySelector(".data-cityName");

    const countryIcon = document.querySelector(".country-Icon");
    const desc  = document.querySelector(".weather-discription");
    const weatherIcon = document.querySelector(".weather-image");
    const temp = document.querySelector(".temperature");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    

    cityName.innerText = data?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText = `${data?.main?.temp} °C`;
    windspeed.innerText = `${data?.wind?.speed} m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloudiness.innerText = `${data?.clouds?.all}%`;


}



function getLocation() {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // Hw - show an alert for no geolocation support  available...
    }
}

function showPosition(position) {
    
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    
    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else
    fetchSearchWeatherInfo(cityName);
})



async function fetchSearchWeatherInfo(city) {
    
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        if (!response.ok) {
            loadingScreen.classList.remove("active");
            notFound.classList.add("active");
            // alert("Not Found");
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        loadingScreen.classList.remove("active");  
        userInfoContainer.classList.add("active");
    
        renderWeatherInfo(data);
    } 
    
    catch (error) {
        //hw
        // loadingScreen.classList.remove("active");

        // // Log the error to the console for debugging purposes
        // console.error("Failed to fetch weather data:", err);
        // alert("Not Found");

        // notFound.classList.add("active");

        // Display error message to the user (you can customize the UI part)
        // userInfoContainer.innerHTML = `<p>Unable to fetch weather data. Please try again later.</p>`;
        // userInfoContainer.classList.add("active");
    }


}


























































// console.log("Hello Jee...");

// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// async function showWeather() {

//     let city = "mumbai";

//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
//     const data = await response.json();

//     console.log("Weather data:-> " , data);

//     let newPara = document.createElement('p');
//     newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;

//     document.body.appendChild(newPara);

//     console.log(newPara.textContent);

// }

// // showWeather();