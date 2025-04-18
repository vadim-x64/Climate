let temperature = 20;
let fanSpeed = 4;
let humidity = 64;
let autoFanControl = true;

let tempPlusTimer = null;
let tempMinusTimer = null;
let fanPlusTimer = null;
let fanMinusTimer = null;
let humidityPlusTimer = null;
let humidityMinusTimer = null;

const tempValue = document.getElementById('temp-value');
const fanValue = document.getElementById('fan-value');
const humidityValue = document.getElementById('humidity-value');
const summary = document.getElementById('summary');
const autoModeElement = document.getElementById('auto-mode');

const tempPlus = document.getElementById('temp-plus');
const tempMinus = document.getElementById('temp-minus');
const fanPlus = document.getElementById('fan-plus');
const fanMinus = document.getElementById('fan-minus');
const humidityPlus = document.getElementById('humidity-plus');
const humidityMinus = document.getElementById('humidity-minus');

updateFanAnimation();
updateFanColor();

function calculateFanSpeed(temp) {
    return Math.min(10, Math.max(0, Math.floor(temp / 5)));
}

function increaseTemperature() {
    if (temperature < 50) {
        temperature++;

        if (autoFanControl) {
            const newFanSpeed = calculateFanSpeed(temperature);

            if (newFanSpeed !== fanSpeed) {
                fanSpeed = newFanSpeed;
                updateFanAnimation();
            }
        }

        updateFanColor();
        updateUI();
    }
}

function decreaseTemperature() {
    if (temperature > 0) {
        temperature--;

        if (autoFanControl) {
            const newFanSpeed = calculateFanSpeed(temperature);

            if (newFanSpeed !== fanSpeed) {
                fanSpeed = newFanSpeed;
                updateFanAnimation();
            }
        }

        updateFanColor();
        updateUI();
    }
}

function increaseFanSpeed() {
    if (fanSpeed < 10) {
        autoFanControl = false;
        updateAutoModeUI();
        fanSpeed++;
        updateUI();
        updateFanAnimation();
    }
}

function decreaseFanSpeed() {
    if (fanSpeed > 0) {
        autoFanControl = false;
        updateAutoModeUI();
        fanSpeed--;
        updateUI();
        updateFanAnimation();
    }
}

function initializeRaindrops() {
    const humidityAnimationContainer = document.querySelector('.humidity-animation-container');

    humidityAnimationContainer.innerHTML = '';

    const maxDrops = 50;

    for (let i = 0; i < maxDrops; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.id = `raindrop-${i}`;
        raindrop.style.left = Math.random() * 100 + '%';
        raindrop.style.animationDuration = (5 + Math.random() * 3) + 's';
        raindrop.style.animationDelay = (Math.random() * 5) + 's';
        raindrop.style.display = 'none';
        humidityAnimationContainer.appendChild(raindrop);
    }

    updateHumidityAnimation();
}

function updateHumidityAnimation() {
    const maxDrops = 50;
    const dropsPerIncrement = 10;
    const increments = Math.ceil(humidity / 20);
    const visibleDrops = Math.min(maxDrops, increments * dropsPerIncrement);

    for (let i = 0; i < maxDrops; i++) {
        const raindrop = document.getElementById(`raindrop-${i}`);
        if (raindrop) {
            if (i < visibleDrops) {
                raindrop.style.display = 'block';
            } else {
                raindrop.style.display = 'none';
            }
        }
    }
}

function increaseHumidity() {
    if (humidity < 100) {
        humidity++;
        updateUI();
        updateHumidityAnimation();
    }
}

function decreaseHumidity() {
    if (humidity > 0) {
        humidity--;
        updateUI();
        updateHumidityAnimation();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const fanContainer = document.querySelector('.fan-container');
    const humidityAnimationContainer = document.querySelector('.humidity-animation-container');

    if (fanContainer && humidityAnimationContainer) {
        humidityAnimationContainer.style.top = '0';
        humidityAnimationContainer.style.left = '0';
        humidityAnimationContainer.style.width = '100%';
        humidityAnimationContainer.style.height = '100%';
        fanContainer.appendChild(humidityAnimationContainer);
    }

    initializeRaindrops();
});


function toggleAutoMode() {
    autoFanControl = !autoFanControl;

    if (autoFanControl) {
        const newFanSpeed = calculateFanSpeed(temperature);
        if (newFanSpeed !== fanSpeed) {
            fanSpeed = newFanSpeed;
            updateFanAnimation();
        }
    }

    updateAutoModeUI();
    updateUI();
}

function updateAutoModeUI() {
    if (autoModeElement) {
        autoModeElement.textContent = autoFanControl ? 'Авто: Увімкнуто' : 'Авто: Вимкнуто';
        autoModeElement.classList.toggle('active', autoFanControl);
    }
}

function updateFanColor() {
    const fanBlades = document.querySelectorAll('.fan-blade');
    const fanCenter = document.querySelector('.fan-center');

    if (temperature <= 25) {
        fanBlades.forEach(blade => {
            blade.style.backgroundColor = 'var(--primary-color)';
        });

        if (fanCenter) {
            fanCenter.style.backgroundColor = 'var(--primary-hover)';
        }
    }
    else {
        const percentage = Math.min(100, ((temperature - 25) / 25) * 100);
        const r = Math.floor(59 + (220 - 59) * (percentage / 100));
        const g = Math.floor(130 - (130 - 38) * (percentage / 100));
        const b = Math.floor(246 - (246 - 38) * (percentage / 100));

        fanBlades.forEach(blade => {
            blade.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        });

        const centerR = Math.max(0, r - 30);
        const centerG = Math.max(0, g - 30);
        const centerB = Math.max(0, b - 30);

        if (fanCenter) {
            fanCenter.style.backgroundColor = `rgb(${centerR}, ${centerG}, ${centerB})`;
        }

        document.documentElement.style.setProperty('--fan-color', `rgb(${r}, ${g}, ${b})`);
        document.documentElement.style.setProperty('--fan-center-color', `rgb(${centerR}, ${centerG}, ${centerB})`);
    }
}

function updateFanAnimation() {
    const fanElement = document.getElementById('fan');
    let currentRotation = 0;

    if (fanElement.style.animation && fanElement.style.animation !== 'none') {
        const transformStyle = window.getComputedStyle(fanElement).transform;

        if (transformStyle && transformStyle !== 'none') {
            const matrix = new DOMMatrix(transformStyle);
            currentRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
            if (currentRotation < 0) currentRotation += 360;
        }
    }

    fanElement.style.animation = 'none';
    fanElement.style.transform = `rotate(${currentRotation}deg)`;

    void fanElement.offsetWidth;

    if (fanSpeed === 0) {
        fanElement.style.animation = 'none';
    } else {
        const duration = 4 / fanSpeed;

        setTimeout(() => {
            fanElement.style.transform = '';
            fanElement.style.animation = `rotate ${duration}s linear infinite`;
            fanElement.style.transition = 'animation-duration 0.8s ease-in-out';
        }, 10);
    }
}

let thermometerLevel = document.getElementById('thermometer-level');
let thermometerBulb = document.querySelector('.thermometer-bulb');
const maxDisplayTemp = 50;

function getTemperatureColor(percentage) {
    const cold = [59, 130, 246];
    const medium = [255, 192, 0];
    const hot = [255, 38, 38];

    let r, g, b;

    if (percentage <= 50) {
        const factor = percentage / 50;
        r = Math.round(cold[0] + factor * (medium[0] - cold[0]));
        g = Math.round(cold[1] + factor * (medium[1] - cold[1]));
        b = Math.round(cold[2] + factor * (medium[2] - cold[2]));
    } else {
        const factor = (percentage - 50) / 50;
        r = Math.round(medium[0] + factor * (hot[0] - medium[0]));
        g = Math.round(medium[1] + factor * (hot[1] - medium[1]));
        b = Math.round(medium[2] + factor * (hot[2] - medium[2]));
    }

    return `rgb(${r}, ${g}, ${b})`;
}

function updateUI() {
    tempValue.textContent = `${temperature}°C`;
    fanValue.textContent = fanSpeed;
    humidityValue.textContent = `${humidity}%`;

    if (thermometerLevel && thermometerBulb) {
        const heightPercentage = Math.min(100, (temperature / maxDisplayTemp) * 100);
        thermometerLevel.style.height = `${heightPercentage}%`;

        const colorPercentage = (temperature / maxDisplayTemp) * 100;
        const tempColor = getTemperatureColor(colorPercentage);

        thermometerLevel.style.backgroundColor = tempColor;
        thermometerBulb.style.backgroundColor = tempColor;
    }

    let autoStatus = autoFanControl ? "(авто)" : "";
    summary.textContent = `Поточні налаштування: ${temperature}°C, швидкість вентилятора ${fanSpeed} ${autoStatus}, вологість ${humidity}%`;

    if (temperature > 35) {
        const heatPercentage = Math.min(100, ((temperature - 35) / 15) * 100);
        tempValue.style.color = `rgba(220, ${150 - (heatPercentage * 1.5)}, 20, 1)`;
    } else {
        tempValue.style.color = '';
    }
}

tempPlus.addEventListener('mousedown', () => {
    increaseTemperature();
    tempPlusTimer = setTimeout(function() {
        tempPlusTimer = setInterval(increaseTemperature, 100);
    }, 500);
});

tempMinus.addEventListener('mousedown', () => {
    decreaseTemperature();
    tempMinusTimer = setTimeout(function() {
        tempMinusTimer = setInterval(decreaseTemperature, 100);
    }, 500);
});

fanPlus.addEventListener('mousedown', () => {
    increaseFanSpeed();
    fanPlusTimer = setTimeout(function() {
        fanPlusTimer = setInterval(increaseFanSpeed, 100);
    }, 500);
});

fanMinus.addEventListener('mousedown', () => {
    decreaseFanSpeed();
    fanMinusTimer = setTimeout(function() {
        fanMinusTimer = setInterval(decreaseFanSpeed, 100);
    }, 500);
});

humidityPlus.addEventListener('mousedown', () => {
    increaseHumidity();
    humidityPlusTimer = setTimeout(function() {
        humidityPlusTimer = setInterval(increaseHumidity, 100);
    }, 500);
});

humidityMinus.addEventListener('mousedown', () => {
    decreaseHumidity();
    humidityMinusTimer = setTimeout(function() {
        humidityMinusTimer = setInterval(decreaseHumidity, 100);
    }, 500);
});

if (autoModeElement) {
    autoModeElement.addEventListener('click', toggleAutoMode);
}

document.addEventListener('mouseup', () => {
    clearTimeout(tempPlusTimer);
    clearInterval(tempPlusTimer);
    clearTimeout(tempMinusTimer);
    clearInterval(tempMinusTimer);
    clearTimeout(fanPlusTimer);
    clearInterval(fanPlusTimer);
    clearTimeout(fanMinusTimer);
    clearInterval(fanMinusTimer);
    clearTimeout(humidityPlusTimer);
    clearInterval(humidityPlusTimer);
    clearTimeout(humidityMinusTimer);
    clearInterval(humidityMinusTimer);
});

document.addEventListener('mouseleave', () => {
    clearTimeout(tempPlusTimer);
    clearInterval(tempPlusTimer);
    clearTimeout(tempMinusTimer);
    clearInterval(tempMinusTimer);
    clearTimeout(fanPlusTimer);
    clearInterval(fanPlusTimer);
    clearTimeout(fanMinusTimer);
    clearInterval(fanMinusTimer);
    clearTimeout(humidityPlusTimer);
    clearInterval(humidityPlusTimer);
    clearTimeout(humidityMinusTimer);
    clearInterval(humidityMinusTimer);
});

tempValue.addEventListener('click', (event) => {
    if (event.offsetX < tempValue.offsetWidth / 2) {
        decreaseTemperature();
    } else {
        increaseTemperature();
    }
});

fanValue.addEventListener('click', (event) => {
    if (event.offsetX < fanValue.offsetWidth / 2) {
        decreaseFanSpeed();
    } else {
        increaseFanSpeed();
    }
});

humidityValue.addEventListener('click', (event) => {
    if (event.offsetX < humidityValue.offsetWidth / 2) {
        decreaseHumidity();
    } else {
        increaseHumidity();
    }
});
updateAutoModeUI();
updateFanColor();
updateUI();