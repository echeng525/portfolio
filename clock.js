// Array of common time zones
const timeZones = [
    { name: 'New York', tz: 'America/New_York' },
    { name: 'Los Angeles', tz: 'America/Los_Angeles' },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'Sydney', tz: 'Australia/Sydney' },
    { name: 'Dubai', tz: 'Asia/Dubai' },
    { name: 'Singapore', tz: 'Asia/Singapore' },
    { name: 'Hong Kong', tz: 'Asia/Hong_Kong' },
    { name: 'Bangkok', tz: 'Asia/Bangkok' },
    { name: 'Mumbai', tz: 'Asia/Kolkata' },
    { name: 'Berlin', tz: 'Europe/Berlin' },
    { name: 'Paris', tz: 'Europe/Paris' },
    { name: 'Toronto', tz: 'America/Toronto' },
    { name: 'Mexico City', tz: 'America/Mexico_City' },
    { name: 'São Paulo', tz: 'America/Sao_Paulo' },
    { name: 'Moscow', tz: 'Europe/Moscow' },
    { name: 'Istanbul', tz: 'Europe/Istanbul' },
    { name: 'Bangkok', tz: 'Asia/Bangkok' },
    { name: 'Shanghai', tz: 'Asia/Shanghai' },
    { name: 'Seoul', tz: 'Asia/Seoul' }
];

let is24HourFormat = false;
let activeClocks = [];

// Initialize with default time zones
function init() {
    const savedClocks = localStorage.getItem('activeClocks');
    if (savedClocks) {
        activeClocks = JSON.parse(savedClocks);
    } else {
        activeClocks = [
            { name: 'New York', tz: 'America/New_York' },
            { name: 'London', tz: 'Europe/London' },
            { name: 'Tokyo', tz: 'Asia/Tokyo' }
        ];
    }
    
    const savedFormat = localStorage.getItem('is24HourFormat');
    if (savedFormat !== null) {
        is24HourFormat = JSON.parse(savedFormat);
    }
    
    renderClocks();
    updateAllClocks();
    setInterval(updateAllClocks, 1000);
    populateTimezoneSelect();
}

function renderClocks() {
    const container = document.getElementById('clocksContainer');
    container.innerHTML = '';
    
    activeClocks.forEach((clock, index) => {
        const clockCard = document.createElement('div');
        clockCard.className = 'clock-card';
        clockCard.innerHTML = `
            <div class="clock-header">
                <div class="timezone-name">${clock.name}</div>
                <button class="clock-remove" onclick="removeTimeZone(${index})">×</button>
            </div>
            <div class="clock-display" id="clock-${index}">--:--:--</div>
            <div class="clock-info" id="info-${index}"></div>
        `;
        container.appendChild(clockCard);
    });
}

function updateAllClocks() {
    activeClocks.forEach((clock, index) => {
        const timeDisplay = document.getElementById(`clock-${index}`);
        const infoDisplay = document.getElementById(`info-${index}`);
        
        const time = new Date().toLocaleString('en-US', {
            timeZone: clock.tz,
            hour12: !is24HourFormat,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const dateStr = new Date().toLocaleString('en-US', {
            timeZone: clock.tz,
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        timeDisplay.textContent = time;
        infoDisplay.textContent = dateStr;
    });
}

function toggleFormat() {
    is24HourFormat = !is24HourFormat;
    localStorage.setItem('is24HourFormat', JSON.stringify(is24HourFormat));
    updateAllClocks();
}

function addTimeZone() {
    document.getElementById('addTimezoneModal').classList.add('show');
}

function closeAddTimeZone() {
    document.getElementById('addTimezoneModal').classList.remove('show');
}

function confirmAddTimeZone() {
    const select = document.getElementById('timezoneSelect');
    const selectedTz = select.value;
    
    if (selectedTz) {
        const timezone = timeZones.find(tz => tz.tz === selectedTz);
        if (timezone && !activeClocks.some(c => c.tz === selectedTz)) {
            activeClocks.push(timezone);
            localStorage.setItem('activeClocks', JSON.stringify(activeClocks));
            renderClocks();
            updateAllClocks();
        }
    }
    
    closeAddTimeZone();
    select.value = '';
}

function removeTimeZone(index) {
    activeClocks.splice(index, 1);
    localStorage.setItem('activeClocks', JSON.stringify(activeClocks));
    renderClocks();
}

function populateTimezoneSelect() {
    const select = document.getElementById('timezoneSelect');
    timeZones.forEach(tz => {
        if (!activeClocks.some(c => c.tz === tz.tz)) {
            const option = document.createElement('option');
            option.value = tz.tz;
            option.textContent = `${tz.name} (${tz.tz})`;
            select.appendChild(option);
        }
    });
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('addTimezoneModal');
    if (event.target === modal) {
        closeAddTimeZone();
    }
});

// Initialize on page load
window.addEventListener('load', init);
