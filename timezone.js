// Theme management
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const htmlElement = document.documentElement;

// City management
const addCityBtn = document.getElementById('addCityBtn');
const citySelector = document.getElementById('citySelector');
const cityDropdown = document.getElementById('cityDropdown');
const addSelectedCity = document.getElementById('addSelectedCity');
const cancelSelector = document.getElementById('cancelSelector');
const selectedCitiesContainer = document.getElementById('selectedCities');
const timeDisplay = document.getElementById('timeDisplay');
const dstIndicator = document.getElementById('dstIndicator');

// City timezone mappings
const cities = {
    Singapore: 'Asia/Singapore',
    Los_Angeles: 'America/Los_Angeles',
    New_York: 'America/New_York',
    London: 'Europe/London',
    Paris: 'Europe/Paris',
    Frankfurt: 'Europe/Berlin',
    Kolkata: 'Asia/Kolkata',
    Jakarta: 'Asia/Jakarta',
    Tokyo: 'Asia/Tokyo',
    Sydney: 'Australia/Sydney',
    Dubai: 'Asia/Dubai',
    Hong_Kong: 'Asia/Hong_Kong',
    Mumbai: 'Asia/Kolkata',
    Toronto: 'America/Toronto',
    Chicago: 'America/Chicago',
    Denver: 'America/Denver',
    Mexico_City: 'America/Mexico_City',
    Sao_Paulo: 'America/Sao_Paulo',
    Buenos_Aires: 'America/Argentina/Buenos_Aires',
    Berlin: 'Europe/Berlin',
    Rome: 'Europe/Rome',
    Madrid: 'Europe/Madrid',
    Amsterdam: 'Europe/Amsterdam',
    Stockholm: 'Europe/Stockholm',
    Moscow: 'Europe/Moscow',
    Istanbul: 'Europe/Istanbul',
    Cairo: 'Africa/Cairo',
    Johannesburg: 'Africa/Johannesburg',
    Beijing: 'Asia/Shanghai',
    Shanghai: 'Asia/Shanghai',
    Seoul: 'Asia/Seoul',
    Bangkok: 'Asia/Bangkok',
    Kuala_Lumpur: 'Asia/Kuala_Lumpur',
    Manila: 'Asia/Manila',
    Auckland: 'Pacific/Auckland',
    Perth: 'Australia/Perth',
    Melbourne: 'Australia/Melbourne'
};

// State
let selectedCities = [];

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Initialize cities
function initCities() {
    const savedCities = localStorage.getItem('selectedCities');
    if (savedCities) {
        selectedCities = JSON.parse(savedCities);
    } else {
        // Default cities
        selectedCities = ['Singapore', 'Los_Angeles'];
    }
    renderSelectedCities();
    updateTime();
}

function saveCities() {
    localStorage.setItem('selectedCities', JSON.stringify(selectedCities));
}

function renderSelectedCities() {
    selectedCitiesContainer.innerHTML = '';
    selectedCities.forEach(city => {
        const cityTag = document.createElement('div');
        cityTag.className = 'city-tag';

        const cityName = document.createElement('span');
        cityName.textContent = city.replace(/_/g, ' ');

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.setAttribute('aria-label', `Remove ${city}`);
        removeBtn.addEventListener('click', () => removeCity(city));

        cityTag.appendChild(cityName);
        cityTag.appendChild(removeBtn);
        selectedCitiesContainer.appendChild(cityTag);
    });
}

function addCity(city) {
    if (!selectedCities.includes(city) && cities[city]) {
        selectedCities.push(city);
        saveCities();
        renderSelectedCities();
        updateTime();
    }
}

function removeCity(city) {
    selectedCities = selectedCities.filter(c => c !== city);
    saveCities();
    renderSelectedCities();
    updateTime();
}

function showCitySelector() {
    citySelector.classList.remove('hidden');
    cityDropdown.value = '';
    cityDropdown.focus();
}

function hideCitySelector() {
    citySelector.classList.add('hidden');
}

function updateTime() {
    timeDisplay.innerHTML = '';
    dstIndicator.innerHTML = '';

    if (selectedCities.length === 0) {
        timeDisplay.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No cities selected. Click "+ Add City" to get started.</p>';
        return;
    }

    const now = new Date();

    selectedCities.forEach(city => {
        const timeZone = cities[city];
        const options = {
            timeZone: timeZone,
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZoneName: 'short'
        };

        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedTime = formatter.format(now);

        const cityBlock = document.createElement('div');
        cityBlock.className = 'city-block';

        const cityName = document.createElement('div');
        cityName.className = 'city-name';
        cityName.textContent = city.replace(/_/g, ' ');
        cityBlock.appendChild(cityName);

        const currentTime = document.createElement('div');
        currentTime.className = 'current-time';
        currentTime.textContent = `Current time: ${formattedTime}`;
        cityBlock.appendChild(currentTime);

        const hoursDisplay = document.createElement('div');
        hoursDisplay.className = 'hours-display';

        for (let i = 0; i < 24; i++) {
            const hourBlock = document.createElement('div');
            hourBlock.className = 'hour-block';

            const hourDate = new Date(now);
            hourDate.setHours(i, 0, 0, 0);

            const hourFormatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timeZone,
                hour: 'numeric',
                hour12: true
            });

            const hourOptions = {
                timeZone: timeZone,
                hour: 'numeric',
                hour12: false
            };

            const cityHour = parseInt(new Intl.DateTimeFormat('en-US', hourOptions).format(hourDate));

            hourBlock.textContent = hourFormatter.format(hourDate);

            if (cityHour >= 9 && cityHour < 18) {
                hourBlock.classList.add('work-hours');
            }

            if (cityHour === parseInt(new Intl.DateTimeFormat('en-US', hourOptions).format(now))) {
                hourBlock.classList.add('current-hour');
            }

            hoursDisplay.appendChild(hourBlock);
        }

        cityBlock.appendChild(hoursDisplay);
        timeDisplay.appendChild(cityBlock);

        // Check for DST
        const januaryDate = new Date(now.getFullYear(), 0, 1);
        const julyDate = new Date(now.getFullYear(), 6, 1);

        const januaryOffset = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            timeZoneName: 'short'
        }).format(januaryDate).split(' ')[1];

        const julyOffset = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            timeZoneName: 'short'
        }).format(julyDate).split(' ')[1];

        if (januaryOffset !== julyOffset) {
            dstIndicator.innerHTML += `${city.replace(/_/g, ' ')} is currently observing ${formattedTime.split(' ')[2]}. `;
        }
    });
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme);
addCityBtn.addEventListener('click', showCitySelector);
cancelSelector.addEventListener('click', hideCitySelector);

addSelectedCity.addEventListener('click', () => {
    const selectedCity = cityDropdown.value;
    if (selectedCity) {
        addCity(selectedCity);
        hideCitySelector();
    }
});

cityDropdown.addEventListener('change', () => {
    if (cityDropdown.value) {
        addSelectedCity.disabled = false;
    }
});

// Allow adding city by pressing Enter in dropdown
cityDropdown.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && cityDropdown.value) {
        addCity(cityDropdown.value);
        hideCitySelector();
    }
});

// Initialize app
initTheme();
initCities();

// Update time every minute
setInterval(updateTime, 60000);
