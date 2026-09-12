const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

let latestData = {
    voltage: 230,
    current: 3.5,
    temperature: 45,
    vibration: 2.0,
    speed: 1440,
    status: "NORMAL"
};


// CONDITION RULES
function calculateStatus(temperature, vibration, current) {

    if (
        temperature > 80 ||
        vibration > 7 ||
        current > 6
    ) {
        return "CRITICAL";
    }

    if (
        temperature >= 65 ||
        vibration >= 4 ||
        current >= 5
    ) {
        return "WARNING";
    }

    return "NORMAL";
}


// GET MOTOR DATA
app.get("/api/data", (req, res) => {
    res.json(latestData);
});


// SIMULATE MOTOR CONDITION
app.post("/api/simulate", (req, res) => {

    const voltage = Number(req.body.voltage);
    const current = Number(req.body.current);
    const temperature = Number(req.body.temperature);
    const vibration = Number(req.body.vibration);
    const speed = Number(req.body.speed);

    const status = calculateStatus(
        temperature,
        vibration,
        current
    );

    latestData = {
        voltage,
        current,
        temperature,
        vibration,
        speed,
        status
    };

    res.json(latestData);
});


// MATLAB / ESP32 DATA INPUT
app.post("/api/motor", (req, res) => {

    latestData = {
        ...latestData,
        ...req.body
    };

    latestData.status = calculateStatus(
        Number(latestData.temperature),
        Number(latestData.vibration),
        Number(latestData.current)
    );

    res.json({
        success: true,
        data: latestData
    });
});


app.listen(PORT, "0.0.0.0", () => {
    console.log(
        `Motor Monitoring Server running on port ${PORT}`
    );
});