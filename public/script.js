document.addEventListener("DOMContentLoaded", function () {
  const temperatureElement = document.getElementById("temperature");
  const humidityElement = document.getElementById("humidity");
  const soilMoistureElement = document.getElementById("soilMoisture");

  const temperatureThresholdInput = document.getElementById(
    "temperature-threshold"
  );
  const humidityThresholdInput = document.getElementById("humidity-threshold");
  const soilMoistureThresholdInput = document.getElementById(
    "soil-moisture-threshold"
  );

  // Fetch data from the server every 15 seconds
  async function fetchData() {
    try {
      const response = await fetch("/data");
      const result = await response.json();
      if (result.data) {
        temperatureElement.textContent = result.data.temperature;
        humidityElement.textContent = result.data.humidity;
        soilMoistureElement.textContent = result.data.soilMoisture;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Fetch current thresholds from the server
  async function fetchThresholds() {
    try {
      const response = await fetch("/thresholds");
      const result = await response.json();
      temperatureThresholdInput.value = result.temperature || "";
      humidityThresholdInput.value = result.humidity || "";
      soilMoistureThresholdInput.value = result.soilMoisture || "";
    } catch (error) {
      console.error("Error fetching thresholds:", error);
    }
  }

  // Send updated thresholds to the server
  async function updateThresholds() {
    const temperature = parseFloat(temperatureThresholdInput.value);
    const humidity = parseFloat(humidityThresholdInput.value);
    const soilMoisture = parseFloat(soilMoistureThresholdInput.value);

    try {
      const response = await fetch("/thresholds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temperature, humidity, soilMoisture }),
      });
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error("Error updating thresholds:", error);
    }
  }

  // Fetch data and thresholds when the page loads
  fetchData();
  fetchThresholds();

  // Add event listeners to update thresholds on change
  temperatureThresholdInput.addEventListener("change", updateThresholds);
  humidityThresholdInput.addEventListener("change", updateThresholds);
  soilMoistureThresholdInput.addEventListener("change", updateThresholds);

  // Fetch data every 15 seconds
  setInterval(fetchData, 15000);
});
