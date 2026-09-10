const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

let latestData = {
    oilTemperature: 65,
    windingTemperature: 72,
    vibration: 2.5,

    voltageR: 11000,
    voltageY: 11000,
    voltageB: 11000,

    currentR: 40,
    currentY: 41,
    currentB: 39,

    status: "NORMAL"
};


// CONDITION RULE
function calculateStatus(oil, winding, vibration) {

    if (
        oil > 85 ||
        winding > 95 ||
        vibration > 7
    ) {
        return "CRITICAL";
    }

    if (
        oil >= 70 ||
        winding >= 80 ||
        vibration >= 4
    ) {
        return "WARNING";
    }

    return "NORMAL";
}


// GET DATA
app.get("/api/data", (req, res) => {

    res.json(latestData);

});


// CONDITION SIMULATOR
app.post("/api/simulate", (req, res) => {

    const oil = Number(req.body.oilTemperature);
    const winding = Number(req.body.windingTemperature);
    const vibration = Number(req.body.vibration);

    const status = calculateStatus(
        oil,
        winding,
        vibration
    );

    latestData.oilTemperature = oil;
    latestData.windingTemperature = winding;
    latestData.vibration = vibration;
    latestData.status = status;

    res.json(latestData);

});


app.listen(PORT, () => {

    console.log(
        `Transformer Monitoring Server running at http://localhost:${PORT}`
    );

});