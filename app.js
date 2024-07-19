const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

// Middleware to parse url-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (like CSS or images) from the 'public' directory
app.use(express.static("public"));

// GET route to serve the HTML form
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

// POST route to handle form submission and fetch weather data
app.post("/", function(req, res) {
    const cityName = req.body.cityName;  // Extract city name from form input

    const apiKey = "2cc1289fee60853028645fe51e5fb6fe";
    const unit = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${unit}`;

    https.get(url, function(response) {
        console.log(response.statusCode);

        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = `http://openweathermap.org/img/wn/${icon}.png`;

            // Sending HTML response to client
            res.write(`<p>The weather is currently ${weatherDescription}</p>`);
            res.write(`<h1>The temperature in ${cityName} is ${temp} degrees Celsius.</h1>`);
            res.write(`<img src="${imageURL}" alt="Weather Icon">`);
            res.send();
        });
    });
});

// Start server on port 3000
app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});
