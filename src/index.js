import './style.scss';
import fetch from 'node-fetch';
import { createHeader, showWeather } from './utils';
import { listFavorites } from './favorites'

const fetchJSON = async (url) => {
  const response = await fetch(url);
  return await response.json();
}

function resetSearchForm() {
  let textField = document.getElementById('search');
  textField.value = '';
  textField.placeholder = 'Search city';
}


function processWeather(rawWeather) {
  return {
    location: `${rawWeather.name}, ${rawWeather.sys.country}`,
    cloudCond: rawWeather['weather'][0]['description'],
    tempFah: ((rawWeather['main']['temp'] - 273.15) * 1.8 + 32).toFixed(),
    humidity: 'Humidity: ' + (rawWeather.main.humidity).toFixed() + '%',
    windSpeed: 'Wind: ' + (rawWeather['wind']['speed']).toFixed() + ' mph',
    icon: `http://openweathermap.org/img/wn/${rawWeather.weather[0].icon}@2x.png`,
  }
}


let wWrap = document.createElement('div')
wWrap.id = 'w-wrap';
wWrap.style.display = 'none'


function getWeatherData(location) {
  if(location){
    let city = location.split(/[\s, ]+/)[0];
    let country = location.split(/[\s, ]+/)[1];
    wWrap.innerHTML = '';
    fetchJSON(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&APPID=ee0d92f2309953f56ed99eb09e4e1159`).then(jsonData => {
      wWrap.innerHTML = '';   
      showWeather(processWeather(jsonData), document.getElementById('w-wrap'));
      resetSearchForm();
    }).catch(e => alert('Oops! Something went wrong.\n Check your input and try again!'))
  }else{
    alert("input can't be blank");
  }
}

function searchHandler(event) {
  event.preventDefault();
  getWeatherData(document.getElementById('search').value)  
}

const pageHeading = document.createElement('H1');
pageHeading.className = 'page-heading';
pageHeading.innerText = 'WEATHER WEBSITE';

const noticeBar = document.createElement('H7');
noticeBar.id = 'notice';

window.onload = () => {
  document.body.appendChild(pageHeading);
  document.body.appendChild(createHeader());
  document.body.appendChild(noticeBar);
  document.body.appendChild(wWrap);

  localStorage.removeItem('favorites');

  document.querySelector('#search-button').addEventListener('click', searchHandler)
  document.getElementById('favorites').addEventListener('click', listFavorites);
};

