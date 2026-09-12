const temperatureLabels = [];
const temperatureData = [];

const currentLabels = [];
const currentData = [];


// TEMPERATURE CHART

const temperatureChart = new Chart(
    document.getElementById("temperatureChart"),
    {
        type: "line",

        data: {
            labels: temperatureLabels,

            datasets: [
                {
                    label: "Temperature (°C)",
                    data: temperatureData,
                    tension: 0.3
                }
            ]
        },

        options: {
            responsive: true,

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }
);


// CURRENT CHART

const currentChart = new Chart(
    document.getElementById("currentChart"),
    {
        type: "line",

        data: {
            labels: currentLabels,

            datasets: [
                {
                    label: "Current (A)",
                    data: currentData,
                    tension: 0.3
                }
            ]
        },

        options: {
            responsive: true,

            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }
);


// GET DATA

async function getData() {

    try {

        const response = await fetch("/api/data");

        const data = await response.json();


        document.getElementById("voltage").textContent =
            data.voltage;

        document.getElementById("current").textContent =
            data.current;

        document.getElementById("temperature").textContent =
            data.temperature;

        document.getElementById("vibration").textContent =
            data.vibration;

        document.getElementById("speed").textContent =
            data.speed;


        // STATUS

        const statusBox =
            document.getElementById("statusBox");

        statusBox.textContent = data.status;

        statusBox.className =
            "status " + data.status.toLowerCase();


        document.getElementById("lastUpdate").textContent =
            "Last Update: " + new Date().toLocaleTimeString();


        // CHART DATA

        const time =
            new Date().toLocaleTimeString();


        temperatureLabels.push(time);
        temperatureData.push(data.temperature);


        currentLabels.push(time);
        currentData.push(data.current);


        // Keep last 15 points

        if (temperatureLabels.length > 15) {
            temperatureLabels.shift();
            temperatureData.shift();
        }

        if (currentLabels.length > 15) {
            currentLabels.shift();
            currentData.shift();
        }


        temperatureChart.update();
        currentChart.update();

    }

    catch (error) {

        console.error(
            "Error getting motor data:",
            error
        );

    }

}


// SIMULATE CONDITION

async function simulateCondition() {

    const voltage =
        Number(document.getElementById("simVoltage").value);

    const current =
        Number(document.getElementById("simCurrent").value);

    const temperature =
        Number(document.getElementById("simTemperature").value);

    const vibration =
        Number(document.getElementById("simVibration").value);

    const speed =
        Number(document.getElementById("simSpeed").value);


    try {

        const response = await fetch(
            "/api/simulate",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    voltage: voltage,

                    current: current,

                    temperature: temperature,

                    vibration: vibration,

                    speed: speed

                })
            }
        );


        const data =
            await response.json();

        console.log(
            "Motor condition simulated:",
            data
        );


        getData();

    }

    catch (error) {

        console.error(
            "Simulation error:",
            error
        );

    }

}


// START MONITORING

getData();

setInterval(
    getData,
    2000
);