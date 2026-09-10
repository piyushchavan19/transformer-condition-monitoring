const maxPoints = 15;

let temperatureLabels = [];
let oilData = [];
let windingData = [];

let currentLabels = [];
let currentRData = [];
let currentYData = [];
let currentBData = [];


const temperatureChart = new Chart(
    document.getElementById("temperatureChart"),
    {
        type: "line",

        data: {

            labels: temperatureLabels,

            datasets: [

                {
                    label: "Oil Temperature °C",
                    data: oilData,
                    tension: 0.3
                },

                {
                    label: "Winding Temperature °C",
                    data: windingData,
                    tension: 0.3
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    }
);



const currentChart = new Chart(
    document.getElementById("currentChart"),
    {

        type: "line",

        data: {

            labels: currentLabels,

            datasets: [

                {
                    label: "R Phase",
                    data: currentRData,
                    tension: 0.3
                },

                {
                    label: "Y Phase",
                    data: currentYData,
                    tension: 0.3
                },

                {
                    label: "B Phase",
                    data: currentBData,
                    tension: 0.3
                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    }
);



// GET LIVE DATA

async function getData() {

    try {

        const response =
            await fetch("/api/data");

        const data =
            await response.json();


        document.getElementById(
            "oilTemperature"
        ).textContent =
            data.oilTemperature;


        document.getElementById(
            "windingTemperature"
        ).textContent =
            data.windingTemperature;


        document.getElementById(
            "vibration"
        ).textContent =
            data.vibration;


        document.getElementById(
            "voltageR"
        ).textContent =
            data.voltageR;


        document.getElementById(
            "voltageY"
        ).textContent =
            data.voltageY;


        document.getElementById(
            "voltageB"
        ).textContent =
            data.voltageB;


        document.getElementById(
            "currentR"
        ).textContent =
            data.currentR;


        document.getElementById(
            "currentY"
        ).textContent =
            data.currentY;


        document.getElementById(
            "currentB"
        ).textContent =
            data.currentB;


        document.getElementById(
            "time"
        ).textContent =
            new Date().toLocaleTimeString();



        // STATUS

        const statusElement =
            document.getElementById("status");


        statusElement.textContent =
            data.status;


        statusElement.className =
            "status " +
            data.status.toLowerCase();



        // TIME

        const currentTime =
            new Date().toLocaleTimeString();



        // TEMPERATURE GRAPH

        temperatureLabels.push(
            currentTime
        );

        oilData.push(
            data.oilTemperature
        );

        windingData.push(
            data.windingTemperature
        );


        if (
            temperatureLabels.length >
            maxPoints
        ) {

            temperatureLabels.shift();

            oilData.shift();

            windingData.shift();

        }


        temperatureChart.update();



        // CURRENT GRAPH

        currentLabels.push(
            currentTime
        );

        currentRData.push(
            data.currentR
        );

        currentYData.push(
            data.currentY
        );

        currentBData.push(
            data.currentB
        );


        if (
            currentLabels.length >
            maxPoints
        ) {

            currentLabels.shift();

            currentRData.shift();

            currentYData.shift();

            currentBData.shift();

        }


        currentChart.update();


    }

    catch (error) {

        console.error(
            "Connection error:",
            error
        );

    }

}



// CONDITION SIMULATOR

async function simulateCondition() {

    const oil =
        Number(
            document.getElementById(
                "simOil"
            ).value
        );


    const winding =
        Number(
            document.getElementById(
                "simWinding"
            ).value
        );


    const vibration =
        Number(
            document.getElementById(
                "simVibration"
            ).value
        );



    try {

        const response =
            await fetch(
                "/api/simulate",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        oilTemperature: oil,

                        windingTemperature:
                            winding,

                        vibration:
                            vibration

                    })

                }
            );


        const data =
            await response.json();


        console.log(
            "Simulated condition:",
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



// FIRST UPDATE

getData();