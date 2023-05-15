document.getElementById("c-btn").disabled = true;
// Select DOM elements
const cityInput = document.querySelector('.city');
const getWeatherBtn = document.querySelector('.btn-get-weather');
const getLocationBtn = document.querySelector('.btn-get-location');
const celsiusBtn = document.querySelector('.btn-celsius');
const fahrenheitBtn = document.querySelector('.btn-fahrenheit');
const weatherDiv = document.querySelector('.weather');
const forecastDiv = document.querySelector('.forecast');

// API key and URL
const apiKey = '39f88cee3651bfeec14368fdb6cd9381';
const apiUrl = 'https://api.openweathermap.org/data/2.5';

// Function to fetch weather data from API
const fetchWeatherData = async (city) => {
	try {
		// Fetch data from API
		const response = await fetch(`${apiUrl}/weather?q=${city}&units=metric&appid=${apiKey}`);
		const data = await response.json();
		
		// Update weather information
		const weather = {
			city: data.name,
			country: data.sys.country,
			icon: data.weather[0].icon,
			description: data.weather[0].description,
			temp: parseInt(data.main.temp),
			feels_like: parseInt(data.main.feels_like),
			humidity: data.main.humidity,
			wind_speed: parseInt(data.wind.speed)
		};

		return weather;
	} catch (error) {
		console.log(error);
	}
};

// Function to fetch 5-day forecast data from API
const fetchForecastData = async (city) => {
	try {
		// Fetch data from API
		const response = await fetch(`${apiUrl}/forecast?q=${city}&units=metric&appid=${apiKey}`);
		const data = await response.json();

		// Filter data to get 5-day forecast
		const forecast = data.list.filter((item) => item.dt_txt.includes('12:00:00'));

		// Update forecast information
		const forecastData = forecast.map((item) => ({
			date: item.dt_txt.slice(0, 10),
			icon: item.weather[0].icon,
			temp: item.main.temp
		}));

		return forecastData;
	} catch (error) {
		console.log(error);
	}
};

// Function to display weather information
const displayWeather = (weather) => {
	weatherDiv.innerHTML = `
		<h2>${weather.city}, ${weather.country}</h2>
		<div class="weather-icon">
			<img src="http://openweathermap.org/img/w/${weather.icon}.png" alt="${weather.description}">
		</div>
		<div class="weather-info">
			<p>${weather.description}</p>
			<p>Temperature: ${weather.temp}°C</p>
			<p>Feels like: ${weather.feels_like}°C</p>
			<p>Humidity: ${weather.humidity}%</p>
			<p>Wind speed: ${weather.wind_speed} m/s<br><hr><h3><u>5 Day Forecast</u></h3></p>
		</div>
	`;
};

// Function to display forecast information
const displayForecast = (forecast) => {
	forecastDiv.innerHTML = `
		<div class="forecast-cards">
			${forecast.map((item) => `
				<div class="forecast-card">
					<p class="forecast-date">${item.date}</p>
					<div class="forecast-icon">
						<img src="http://openweathermap.org/img/w/${item.icon}.png" alt="">
					</div>
					<p class="forecast-temp">${parseInt(item.temp)}°C</p>
				</div>
			`).join('')}
		</div>
	`;
};

// Event listeners
getWeatherBtn.addEventListener('click', async () => {
	const city = cityInput.value;
	if (city !== '') {
		const weatherData = await fetchWeatherData(city);
		const forecastData = await fetchForecastData(city);
		displayWeather(weatherData);
		displayForecast(forecastData);
	} else {
		alert('Please enter a city');
	}
});

getLocationBtn.addEventListener('click', async () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(async (position) => {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;
			const response = await fetch(`${apiUrl}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
			const data = await response.json();
			const city = data.name;
			const weatherData = await fetchWeatherData(city);
			const forecastData = await fetchForecastData(city);
			displayWeather(weatherData);
			displayForecast(forecastData);
		}, (error) => {
			alert('Unable to retrieve location');
		});
	} else {
		alert('Geolocation is not supported by your browser');
	}
});

celsiusBtn.addEventListener('click', () => {
	document.getElementById("c-btn").disabled = true;
	document.getElementById("f-btn").disabled = false;
	celsiusBtn.classList.add('active');
	fahrenheitBtn.classList.remove('active');
	const tempElements = document.querySelectorAll('.forecast-temp, .weather-info p:nth-child(2), .weather-info p:nth-child(3)');
	tempElements.forEach((element) => {
		const temp = parseFloat(element.textContent.replace(/[^\d.-]/g, ''));
		const newTemp = Math.round((temp - 32) * (5 / 9));
		element.textContent = `${newTemp}°C`;
	});
});

fahrenheitBtn.addEventListener('click', () => {
	document.getElementById("f-btn").disabled = true;
	document.getElementById("c-btn").disabled = false;
	fahrenheitBtn.classList.add('active');
	celsiusBtn.classList.remove('active');
	const tempElements = document.querySelectorAll('.forecast-temp, .weather-info p:nth-child(2), .weather-info p:nth-child(3)');
	tempElements.forEach((element) => {
		const temp = parseFloat(element.textContent.replace(/[^\d.-]/g, ''));
		const newTemp = Math.round((temp * (9 / 5)) + 32);
		element.textContent = `${newTemp}°F`;
	});
});
