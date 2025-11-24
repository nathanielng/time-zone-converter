// Theme management
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const htmlElement = document.documentElement;

// Layout management
const layoutToggle = document.getElementById('layoutToggle');
const layoutIcon = document.querySelector('.layout-icon');

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

// Time selector
const timeSelector = document.getElementById('timeSelector');
const headerTime = document.getElementById('headerTime');

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

// Initialize layout
function initLayout() {
    const savedLayout = localStorage.getItem('layout') || 'horizontal';
    htmlElement.setAttribute('data-layout', savedLayout);
    updateLayoutIcon(savedLayout);
}

function updateLayoutIcon(layout) {
    layoutIcon.textContent = layout === 'vertical' ? '⇅' : '⇄';
}

function toggleLayout() {
    const currentLayout = htmlElement.getAttribute('data-layout');
    const newLayout = currentLayout === 'vertical' ? 'horizontal' : 'vertical';
    htmlElement.setAttribute('data-layout', newLayout);
    localStorage.setItem('layout', newLayout);
    updateLayoutIcon(newLayout);
    updateTime(); // Refresh the display with new layout
}

// Initialize time selector
function initTimeSelector() {
    // Populate with all 24 hours
    for (let i = 0; i < 24; i++) {
        const option = document.createElement('option');
        option.value = i;
        const hour12 = i === 0 ? 12 : (i > 12 ? i - 12 : i);
        const ampm = i < 12 ? 'AM' : 'PM';
        option.textContent = `${hour12}:00 ${ampm}`;
        timeSelector.appendChild(option);
    }
    // Default to current time
    timeSelector.value = '-1';
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

    const now = new Date();
    const tier1Hours = []; // 9 AM - 6 PM
    const tier2Hours = []; // 8 AM - 7 PM
    const tier3Hours = []; // Avoids 12 AM - 7 AM

    // Check all 24 hours and categorize them
    for (let localHour = 0; localHour < 24; localHour++) {
        const testDate = new Date(now);
        testDate.setHours(localHour, 0, 0, 0);

        let tier1Valid = true;
        let tier2Valid = true;
        let tier3Valid = true;
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

            // Check tier 1: 9 AM - 6 PM
            if (cityHour < 9 || cityHour >= 18) {
                tier1Valid = false;
            }

            // Check tier 2: 8 AM - 7 PM
            if (cityHour < 8 || cityHour >= 19) {
                tier2Valid = false;
            }

            // Check tier 3: Avoid 12 AM - 7 AM
            if (cityHour >= 0 && cityHour < 7) {
                tier3Valid = false;
            }

            const hour12 = cityHour === 0 ? 12 : (cityHour > 12 ? cityHour - 12 : cityHour);
            const ampm = cityHour < 12 ? 'AM' : 'PM';
            cityTimes.push({
                city: city.replace(/_/g, ' '),
                time: `${hour12} ${ampm}`
            });
        });

        const timeSlot = { localHour, cityTimes };

        if (tier1Valid) {
            tier1Hours.push(timeSlot);
        } else if (tier2Valid) {
            tier2Hours.push(timeSlot);
        } else if (tier3Valid) {
            tier3Hours.push(timeSlot);
        }
    }

    // Display results based on best available tier
    let meetingHours = [];
    let tierMessage = '';

    if (tier1Hours.length > 0) {
        meetingHours = tier1Hours;
        tierMessage = `<p style="margin-top: 0; color: var(--text-primary);"><strong>✅ Found ${meetingHours.length} ideal time slot(s) (all cities 9 AM - 6 PM):</strong></p>`;
    } else if (tier2Hours.length > 0) {
        meetingHours = tier2Hours;
        tierMessage = `<p style="margin-top: 0; color: #FF9800;"><strong>⚠️ Found ${meetingHours.length} acceptable time slot(s) (all cities 8 AM - 7 PM):</strong></p>`;
    } else if (tier3Hours.length > 0) {
        meetingHours = tier3Hours;
        tierMessage = `<p style="margin-top: 0; color: #FF5722;"><strong>⏰ Found ${meetingHours.length} possible time slot(s) (avoids midnight-7 AM):</strong></p>`;
    } else {
        meetingTimesDisplay.innerHTML = '<p style="color: #d32f2f;"><strong>❌ No suitable meeting times found.</strong> All possible times would require someone to meet between midnight and 7 AM.</p>';
        return;
    }

    meetingTimesDisplay.innerHTML = tierMessage;

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

function formatHour12(hour) {
    const hour12 = hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${hour12}:00 ${ampm}`;
}

function getUTCOffset(date, timeZone) {
    // Get the UTC offset for a specific timezone at a given date
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timeZone,
        timeZoneName: 'longOffset'
    });

    try {
        const parts = formatter.formatToParts(date);
        const offsetPart = parts.find(part => part.type === 'timeZoneName');
        if (offsetPart && offsetPart.value !== 'GMT') {
            return offsetPart.value.replace('GMT', 'UTC');
        }
    } catch (e) {
        // Fallback for browsers that don't support longOffset
    }

    // Fallback: calculate offset manually
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
    const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';

    if (minutes === 0) {
        return `UTC${sign}${hours}`;
    } else {
        return `UTC${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
    }
}

function updateHeaderTime() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    });

    // Get system timezone
    const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = getUTCOffset(now, systemTimeZone);

    headerTime.textContent = `${formatter.format(now)} ${offset}`;
}

function updateTime() {
    timeDisplay.innerHTML = '';
    dstIndicator.innerHTML = '';

    if (selectedCities.length === 0) {
        timeDisplay.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No cities selected. Click "+ Add City" to get started.</p>';
        return;
    }

    const selectorValue = parseInt(timeSelector.value);
    const now = new Date();

    // If time selector is not set to current time, set the time based on selector value
    let referenceTime = now;
    if (selectorValue !== -1) {
        referenceTime = new Date(now);
        referenceTime.setHours(selectorValue, 0, 0, 0);
    }

    // Find meeting hours if active (using same three-tier logic)
    let meetingHours = new Set();
    if (meetingFinderActive && selectedCities.length >= 2) {
        const tier1Hours = new Set();
        const tier2Hours = new Set();
        const tier3Hours = new Set();

        for (let localHour = 0; localHour < 24; localHour++) {
            const testDate = new Date(now);
            testDate.setHours(localHour, 0, 0, 0);

            let tier1Valid = true;
            let tier2Valid = true;
            let tier3Valid = true;

            selectedCities.forEach(city => {
                const cityData = cities[city];
                const timeZone = cityData.tz;

                const hourOptions = {
                    timeZone: timeZone,
                    hour: 'numeric',
                    hour12: false
                };

                const cityHour = parseInt(new Intl.DateTimeFormat('en-US', hourOptions).format(testDate));

                // Check tier 1: 9 AM - 6 PM
                if (cityHour < 9 || cityHour >= 18) {
                    tier1Valid = false;
                }

                // Check tier 2: 8 AM - 7 PM
                if (cityHour < 8 || cityHour >= 19) {
                    tier2Valid = false;
                }

                // Check tier 3: Avoid 12 AM - 7 AM
                if (cityHour >= 0 && cityHour < 7) {
                    tier3Valid = false;
                }
            });

            if (tier1Valid) {
                tier1Hours.add(localHour);
            } else if (tier2Valid) {
                tier2Hours.add(localHour);
            } else if (tier3Valid) {
                tier3Hours.add(localHour);
            }
        }

        // Use the best available tier
        if (tier1Hours.size > 0) {
            meetingHours = tier1Hours;
        } else if (tier2Hours.size > 0) {
            meetingHours = tier2Hours;
        } else {
            meetingHours = tier3Hours;
        }
    }

    // Create the timeline container
    const timelineContainer = document.createElement('div');
    timelineContainer.className = 'timeline-container';

    // Create city info column (fixed on left)
    const cityInfoColumn = document.createElement('div');
    cityInfoColumn.className = 'city-info-column';

    // Create hours scroll container (scrollable on right)
    const hoursScrollContainer = document.createElement('div');
    hoursScrollContainer.className = 'hours-scroll-container';

    const hoursGrid = document.createElement('div');
    hoursGrid.className = 'hours-grid';

    selectedCities.forEach(city => {
        const cityData = cities[city];
        const timeZone = cityData.tz;

        // Create city info row (left side - fixed)
        const cityInfoRow = document.createElement('div');
        cityInfoRow.className = 'city-info-row';

        const cityName = document.createElement('div');
        cityName.className = 'city-name';
        const flag = cityData.flag || '🌍';
        cityName.innerHTML = `<span class="city-flag">${flag}</span> ${city.replace(/_/g, ' ')}`;

        const currentTime = document.createElement('div');
        currentTime.className = 'current-time';
        // Format time and get UTC offset
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone,
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        const offset = getUTCOffset(referenceTime, timeZone);
        currentTime.textContent = `${timeFormatter.format(referenceTime)} ${offset}`;

        cityInfoRow.appendChild(cityName);
        cityInfoRow.appendChild(currentTime);
        cityInfoColumn.appendChild(cityInfoRow);

        // Create hours row (right side - scrollable)
        const hoursRow = document.createElement('div');
        hoursRow.className = 'hours-row';

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
            // Check if it's sleep hours (12am-7am)
            else if (cityHour >= 0 && cityHour < 7) {
                hourBlock.classList.add('sleep-hours');
            }
            // Check if it's work hours
            else if (cityHour >= 9 && cityHour < 18) {
                hourBlock.classList.add('work-hours');
            }

            // Check if it's the current hour (or selected hour)
            const checkHour = selectorValue === -1 ?
                parseInt(new Intl.DateTimeFormat('en-US', hourOptions).format(now)) :
                parseInt(new Intl.DateTimeFormat('en-US', hourOptions).format(referenceTime));

            if (cityHour === checkHour) {
                hourBlock.classList.add('current-hour');
            }

            hoursRow.appendChild(hourBlock);
        }

        hoursGrid.appendChild(hoursRow);

        // Check for DST
        const januaryDate = new Date(now.getFullYear(), 0, 1);
        const julyDate = new Date(now.getFullYear(), 6, 1);

        const januaryOffset = getUTCOffset(januaryDate, timeZone);
        const julyOffset = getUTCOffset(julyDate, timeZone);

        if (januaryOffset !== julyOffset) {
            const currentOffset = getUTCOffset(referenceTime, timeZone);
            dstIndicator.innerHTML += `${city.replace(/_/g, ' ')} is currently observing ${currentOffset}. `;
        }
    });

    hoursScrollContainer.appendChild(hoursGrid);
    timelineContainer.appendChild(cityInfoColumn);
    timelineContainer.appendChild(hoursScrollContainer);
    timeDisplay.appendChild(timelineContainer);

    // Auto-scroll to the selected time (including current time)
    setTimeout(() => {
        const currentLayout = htmlElement.getAttribute('data-layout');
        const hourBlocks = hoursScrollContainer.querySelectorAll('.hour-block');
        if (hourBlocks.length > 0) {
            let targetHour;
            if (selectorValue === -1) {
                // For current time, scroll to the current hour
                targetHour = now.getHours();
            } else {
                // For selected time, scroll to that hour
                targetHour = selectorValue;
            }

            if (targetHour < hourBlocks.length) {
                const targetBlock = hourBlocks[targetHour];

                if (currentLayout === 'vertical') {
                    // Vertical scroll
                    const scrollTop = targetBlock.offsetTop - (hoursScrollContainer.clientHeight / 2) + (targetBlock.offsetHeight / 2);
                    hoursScrollContainer.scrollTo({
                        top: Math.max(0, scrollTop),
                        behavior: 'smooth'
                    });
                } else {
                    // Horizontal scroll
                    const scrollLeft = targetBlock.offsetLeft - (hoursScrollContainer.clientWidth / 2) + (targetBlock.offsetWidth / 2);
                    hoursScrollContainer.scrollTo({
                        left: Math.max(0, scrollLeft),
                        behavior: 'smooth'
                    });
                }
            }
        }
    }, 50);
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme);
layoutToggle.addEventListener('click', toggleLayout);
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

// Time selector
timeSelector.addEventListener('change', updateTime);

// Initialize app
initTheme();
initLayout();
initTimeSelector();
initCities();
updateHeaderTime();

// Update header time every second, full time display every minute
setInterval(() => {
    updateHeaderTime();
}, 1000);

setInterval(() => {
    if (parseInt(timeSelector.value) === -1) {
        updateTime();
    }
}, 60000);
