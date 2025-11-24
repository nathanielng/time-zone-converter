const citySelect1 = document.getElementById('city1');
const citySelect2 = document.getElementById('city2');
const citySelect3 = document.getElementById('city3');
const timeDisplay = document.getElementById('timeDisplay');
const dstIndicator = document.getElementById('dstIndicator');

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
    Sydney: 'Australia/Sydney'
};

function updateTime() {
    const selectedCities = [
        citySelect1.value,
        citySelect2.value,
        citySelect3.value
    ].filter(city => city !== "");

    timeDisplay.innerHTML = '';
    dstIndicator.innerHTML = '';

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
        cityName.textContent = city.replace('_', ' ');
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
            dstIndicator.innerHTML += `${city.replace('_', ' ')} is currently observing ${formattedTime.split(' ')[2]}. `;
        }
    });
}

citySelect1.addEventListener('change', updateTime);
citySelect2.addEventListener('change', updateTime);
citySelect3.addEventListener('change', updateTime);

updateTime();
setInterval(updateTime, 60000); // Update every minute
