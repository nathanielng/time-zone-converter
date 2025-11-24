// Theme management
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const htmlElement = document.documentElement;

// City management
const addCityBtn = document.getElementById('addCityBtn');
const citySelector = document.getElementById('citySelector');
const cityDropdown = document.getElementById('cityDropdown');
const citySearch = document.getElementById('citySearch');
const addSelectedCity = document.getElementById('addSelectedCity');
const cancelSelector = document.getElementById('cancelSelector');
const selectedCitiesContainer = document.getElementById('selectedCities');
const timeDisplay = document.getElementById('timeDisplay');
const dstIndicator = document.getElementById('dstIndicator');

// Time slider
const timeSlider = document.getElementById('timeSlider');
const sliderTimeDisplay = document.getElementById('sliderTimeDisplay');
const resetTimeSlider = document.getElementById('resetTimeSlider');

// Meeting finder
const toggleMeetingFinder = document.getElementById('toggleMeetingFinder');
const meetingFinderPanel = document.getElementById('meetingFinderPanel');
const meetingTimesDisplay = document.getElementById('meetingTimesDisplay');

// City timezone mappings with flags
const cities = {
    Singapore: { tz: 'Asia/Singapore', flag: '🇸🇬' },
    Los_Angeles: { tz: 'America/Los_Angeles', flag: '🇺🇸' },
    New_York: { tz: 'America/New_York', flag: '🇺🇸' },
    London: { tz: 'Europe/London', flag: '🇬🇧' },
    Paris: { tz: 'Europe/Paris', flag: '🇫🇷' },
    Frankfurt: { tz: 'Europe/Berlin', flag: '🇩🇪' },
    Kolkata: { tz: 'Asia/Kolkata', flag: '🇮🇳' },
    Jakarta: { tz: 'Asia/Jakarta', flag: '🇮🇩' },
    Tokyo: { tz: 'Asia/Tokyo', flag: '🇯🇵' },
    Sydney: { tz: 'Australia/Sydney', flag: '🇦🇺' },
    Dubai: { tz: 'Asia/Dubai', flag: '🇦🇪' },
    Hong_Kong: { tz: 'Asia/Hong_Kong', flag: '🇭🇰' },
    Mumbai: { tz: 'Asia/Kolkata', flag: '🇮🇳' },
    Toronto: { tz: 'America/Toronto', flag: '🇨🇦' },
    Chicago: { tz: 'America/Chicago', flag: '🇺🇸' },
    Denver: { tz: 'America/Denver', flag: '🇺🇸' },
    Mexico_City: { tz: 'America/Mexico_City', flag: '🇲🇽' },
    Sao_Paulo: { tz: 'America/Sao_Paulo', flag: '🇧🇷' },
    Buenos_Aires: { tz: 'America/Argentina/Buenos_Aires', flag: '🇦🇷' },
    Berlin: { tz: 'Europe/Berlin', flag: '🇩🇪' },
    Rome: { tz: 'Europe/Rome', flag: '🇮🇹' },
    Madrid: { tz: 'Europe/Madrid', flag: '🇪🇸' },
    Amsterdam: { tz: 'Europe/Amsterdam', flag: '🇳🇱' },
    Stockholm: { tz: 'Europe/Stockholm', flag: '🇸🇪' },
    Moscow: { tz: 'Europe/Moscow', flag: '🇷🇺' },
    Istanbul: { tz: 'Europe/Istanbul', flag: '🇹🇷' },
    Cairo: { tz: 'Africa/Cairo', flag: '🇪🇬' },
    Johannesburg: { tz: 'Africa/Johannesburg', flag: '🇿🇦' },
    Beijing: { tz: 'Asia/Shanghai', flag: '🇨🇳' },
    Shanghai: { tz: 'Asia/Shanghai', flag: '🇨🇳' },
    Seoul: { tz: 'Asia/Seoul', flag: '🇰🇷' },
    Bangkok: { tz: 'Asia/Bangkok', flag: '🇹🇭' },
    Kuala_Lumpur: { tz: 'Asia/Kuala_Lumpur', flag: '🇲🇾' },
    Manila: { tz: 'Asia/Manila', flag: '🇵🇭' },
    Auckland: { tz: 'Pacific/Auckland', flag: '🇳🇿' },
    Perth: { tz: 'Australia/Perth', flag: '🇦🇺' },
    Melbourne: { tz: 'Australia/Melbourne', flag: '🇦🇺' }
};

// State
let selectedCities = [];
let meetingFinderActive = false;
let hourDisplays = [];
let isScrollingSynced = false;

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
        selectedCities = ['Singapore', 'Los_Angeles'];
    }
    populateCityDropdown();
    renderSelectedCities();
    updateTime();
}

function populateCityDropdown() {
    // Keep the first "Choose a city..." option
    const options = Array.from(cityDropdown.options);
    const firstOption = options[0];

    cityDropdown.innerHTML = '';
    cityDropdown.appendChild(firstOption);
}

function saveCities() {
    localStorage.setItem('selectedCities', JSON.stringify(selectedCities));
}

function renderSelectedCities() {
    selectedCitiesContainer.innerHTML = '';
    selectedCities.forEach(city => {
        const cityTag = document.createElement('div');
        cityTag.className = 'city-tag';

        const cityInfo = document.createElement('span');
        const flag = cities[city]?.flag || '🌍';
        cityInfo.innerHTML = `<span class="city-flag">${flag}</span> ${city.replace(/_/g, ' ')}`;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerHTML = '×';
        removeBtn.setAttribute('aria-label', `Remove ${city}`);
        removeBtn.addEventListener('click', () => removeCity(city));

        cityTag.appendChild(cityInfo);
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
    citySearch.value = '';
    filterCities('');
    citySearch.focus();
}

function hideCitySelector() {
    citySelector.classList.add('hidden');
}

// City search/filter functionality
function filterCities(searchTerm) {
    const term = searchTerm.toLowerCase();
    cityDropdown.innerHTML = '<option value="">Choose a city...</option>';

    const matchedCities = Object.keys(cities).filter(city => {
        const cityName = city.replace(/_/g, ' ').toLowerCase();
        return cityName.includes(term);
    }).sort();

    matchedCities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city.replace(/_/g, ' ');
        cityDropdown.appendChild(option);
    });
}

// Time slider functionality
function updateSliderDisplay() {
    const sliderValue = parseInt(timeSlider.value);
    if (sliderValue === -1) {
        sliderTimeDisplay.textContent = 'Current Time';
    } else {
        const hour12 = sliderValue === 0 ? 12 : (sliderValue > 12 ? sliderValue - 12 : sliderValue);
        const ampm = sliderValue < 12 ? 'AM' : 'PM';
        sliderTimeDisplay.textContent = `${hour12}:00 ${ampm}`;
    }
    updateTime();
}

function resetTimeToNow() {
    timeSlider.value = -1;
    updateSliderDisplay();
}

// Meeting finder functionality
function toggleMeetingFinderPanel() {
    meetingFinderActive = !meetingFinderActive;
    toggleMeetingFinder.classList.toggle('active', meetingFinderActive);

    if (meetingFinderActive) {
        findMeetingTimes();
        meetingFinderPanel.classList.remove('hidden');
    } else {
        meetingFinderPanel.classList.add('hidden');
    }

    updateTime();
}

function findMeetingTimes() {
    if (selectedCities.length < 2) {
        meetingTimesDisplay.innerHTML = '<p>Add at least 2 cities to find meeting times.</p>';
        return;
    }

    const meetingHours = [];
    const now = new Date();

    // Find hours where all cities are in work hours (9 AM - 6 PM)
    for (let localHour = 0; localHour < 24; localHour++) {
        const testDate = new Date(now);
        testDate.setHours(localHour, 0, 0, 0);

        let allInWorkHours = true;
        const cityTimes = [];

        selectedCities.forEach(city => {
            const cityData = cities[city];
            const timeZone = cityData.tz;

            const hourOptions = {
                timeZone: timeZone,
                hour: 'numeric',
                hour12: false
            };

            const cityHour = parseInt(new Intl.DateTimeFormat('en-US', hourOptions).format(testDate));

            if (cityHour < 9 || cityHour >= 18) {
                allInWorkHours = false;
            }

            const hour12 = cityHour === 0 ? 12 : (cityHour > 12 ? cityHour - 12 : cityHour);
            const ampm = cityHour < 12 ? 'AM' : 'PM';
            cityTimes.push({
                city: city.replace(/_/g, ' '),
                time: `${hour12} ${ampm}`
            });
        });

        if (allInWorkHours) {
            meetingHours.push({
                localHour,
                cityTimes
            });
        }
    }

    if (meetingHours.length === 0) {
        meetingTimesDisplay.innerHTML = '<p style="color: #d32f2f;">No overlapping work hours found across all cities.</p>';
    } else {
        meetingTimesDisplay.innerHTML = `<p style="margin-top: 0; color: var(--text-primary);"><strong>Found ${meetingHours.length} time slot(s) where all cities are in work hours:</strong></p>`;

        meetingHours.forEach(slot => {
            const slotDiv = document.createElement('div');
            slotDiv.className = 'meeting-time-slot';

            let html = `<strong>Your time: ${formatHour12(slot.localHour)}</strong><br>`;
            slot.cityTimes.forEach(ct => {
                html += `${ct.city}: ${ct.time} &nbsp;`;
            });

            slotDiv.innerHTML = html;
            meetingTimesDisplay.appendChild(slotDiv);
        });
    }
}

function formatHour12(hour) {
    const hour12 = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${hour12}:00 ${ampm}`;
}

// Synchronized scrolling
function setupSyncedScrolling() {
    hourDisplays.forEach((display, index) => {
        display.addEventListener('scroll', (e) => {
            if (!isScrollingSynced) {
                isScrollingSynced = true;
                const scrollLeft = e.target.scrollLeft;

                hourDisplays.forEach((otherDisplay, otherIndex) => {
                    if (otherIndex !== index) {
                        otherDisplay.scrollLeft = scrollLeft;
                    }
                });

                setTimeout(() => {
                    isScrollingSynced = false;
                }, 50);
            }
        });
    });
}

function updateTime() {
    timeDisplay.innerHTML = '';
    dstIndicator.innerHTML = '';
    hourDisplays = [];

    if (selectedCities.length === 0) {
        timeDisplay.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No cities selected. Click "+ Add City" to get started.</p>';
        return;
    }

    const sliderValue = parseInt(timeSlider.value);
    const now = new Date();

    // If slider is active, set the time based on slider value
    let referenceTime = now;
    if (sliderValue !== -1) {
        referenceTime = new Date(now);
        referenceTime.setHours(sliderValue, 0, 0, 0);
    }

    // Find meeting hours if active
    let meetingHours = new Set();
    if (meetingFinderActive && selectedCities.length >= 2) {
        for (let localHour = 0; localHour < 24; localHour++) {
            const testDate = new Date(now);
            testDate.setHours(localHour, 0, 0, 0);

            let allInWorkHours = true;
            selectedCities.forEach(city => {
                const cityData = cities[city];
                const timeZone = cityData.tz;

                const hourOptions = {
                    timeZone: timeZone,
                    hour: 'numeric',
                    hour12: false
                };

                const cityHour = parseInt(new Intl.DateTimeFormat('en-US', hourOptions).format(testDate));

                if (cityHour < 9 || cityHour >= 18) {
                    allInWorkHours = false;
                }
            });

            if (allInWorkHours) {
                meetingHours.add(localHour);
            }
        }
    }

    selectedCities.forEach(city => {
        const cityData = cities[city];
        const timeZone = cityData.tz;
        const options = {
            timeZone: timeZone,
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZoneName: 'short'
        };

        const formatter = new Intl.DateTimeFormat('en-US', options);
        const formattedTime = formatter.format(referenceTime);

        const cityBlock = document.createElement('div');
        cityBlock.className = 'city-block';

        const cityName = document.createElement('div');
        cityName.className = 'city-name';
        const flag = cityData.flag || '🌍';
        cityName.innerHTML = `<span class="city-flag">${flag}</span> ${city.replace(/_/g, ' ')}`;
        cityBlock.appendChild(cityName);

        const currentTime = document.createElement('div');
        currentTime.className = 'current-time';
        currentTime.textContent = sliderValue === -1 ? `Current time: ${formattedTime}` : `Time at ${formatHour12(sliderValue)}: ${formattedTime}`;
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

            // Check if it's a meeting time (takes priority)
            if (meetingFinderActive && meetingHours.has(i)) {
                hourBlock.classList.add('meeting-time');
            }
            // Check if it's work hours
            else if (cityHour >= 9 && cityHour < 18) {
                hourBlock.classList.add('work-hours');
            }

            // Check if it's the current hour (or slider hour)
            const checkHour = sliderValue === -1 ?
                parseInt(new Intl.DateTimeFormat('en-US', hourOptions).format(now)) :
                parseInt(new Intl.DateTimeFormat('en-US', hourOptions).format(referenceTime));

            if (cityHour === checkHour) {
                hourBlock.classList.add('current-hour');
            }

            hoursDisplay.appendChild(hourBlock);
        }

        cityBlock.appendChild(hoursDisplay);
        timeDisplay.appendChild(cityBlock);
        hourDisplays.push(hoursDisplay);

        // Check for DST
        const januaryDate = new Date(now.getFullYear(), 0, 1);
        const julyDate = new Date(now.getFullYear(), 6, 1);

        const januaryOffset = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            timeZoneName: 'short'
        }).format(januaryDate).split(' ').pop();

        const julyOffset = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            timeZoneName: 'short'
        }).format(julyDate).split(' ').pop();

        if (januaryOffset !== julyOffset) {
            dstIndicator.innerHTML += `${city.replace(/_/g, ' ')} is currently observing ${formattedTime.split(' ').pop()}. `;
        }
    });

    // Setup synced scrolling after all displays are created
    setupSyncedScrolling();
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme);
addCityBtn.addEventListener('click', showCitySelector);
cancelSelector.addEventListener('click', hideCitySelector);
toggleMeetingFinder.addEventListener('click', toggleMeetingFinderPanel);

addSelectedCity.addEventListener('click', () => {
    const selectedCity = cityDropdown.value;
    if (selectedCity) {
        addCity(selectedCity);
        hideCitySelector();
    }
});

cityDropdown.addEventListener('change', () => {
    addSelectedCity.disabled = !cityDropdown.value;
});

cityDropdown.addEventListener('dblclick', () => {
    if (cityDropdown.value) {
        addCity(cityDropdown.value);
        hideCitySelector();
    }
});

// Search functionality
citySearch.addEventListener('input', (e) => {
    filterCities(e.target.value);
});

citySearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const firstOption = cityDropdown.options[1]; // Skip "Choose a city..."
        if (firstOption && firstOption.value) {
            addCity(firstOption.value);
            hideCitySelector();
        }
    }
});

// Time slider
timeSlider.addEventListener('input', updateSliderDisplay);
resetTimeSlider.addEventListener('click', resetTimeToNow);

// Initialize app
initTheme();
initCities();

// Update time every minute
setInterval(() => {
    if (parseInt(timeSlider.value) === -1) {
        updateTime();
    }
}, 60000);
