The Smart Farming 2024 (SF24) dataset is a comprehensive collection of agricultural data gathered from various farms across California, designed to enhance crop health monitoring and environmental stress assessment. This dataset is particularly valuable for researchers and developers focused on predictive modeling, machine learning, and data-driven agriculture solutions.

## Features:

The dataset contains 4800 records with 28 features (23 original features and 5 derived features), each representing critical environmental and soil parameters, along with specific crop-related metrics. These features include:

- N (ppm): Nitrogen content in the soil.
- P (ppm): Phosphorus content in the soil.
- K (ppm): Potassium content in the soil.
- Temperature (°C): Ambient temperature recorded at the farm.
- Humidity (%): Relative humidity at the location.
- pH: Soil pH level, indicating acidity or alkalinity.
- Rainfall (mm): Amount of rainfall received.
- Label: Type of crop associated with the recorded conditions (e.g., rice).
- Soil Moisture (%): Percentage of water content in the soil.
- Soil Type: Type of soil (1 = Sandy, 2 = Loamy, 3 = Clay).
- Sunlight Exposure (hrs/day): Average daily sunlight exposure.
- Wind Speed (km/h): Wind speed at the farm.
- CO2 Concentration (ppm): Carbon dioxide concentration in the air.
- Organic Matter (%): Percentage of organic material in the soil.
- Irrigation Frequency (times/week): Frequency of irrigation.
- Crop Density (plants/m²): Number of plants per square meter.
- Pest Pressure (index): Level of pest infestation.
- Fertilizer Usage (kg/ha): Amount of fertilizer applied per hectare.
- Growth Stage: Current growth stage of the crop (1 = Seedling, 2 = Vegetative, 3 = Flowering).
- Urban Area Proximity (km): Distance to the nearest urban area.
- Water Source Type: Type of water source used for irrigation (1 = River, 2 = Groundwater, 3 = Recycled).
- Frost Risk (index): Risk of frost occurrence.
- Water Usage Efficiency (L/kg): Efficiency of water usage per kilogram of crop yield.

## Derived Features:

In addition to the original attributes, the dataset includes 5 derived features that provide deeper insights into the interactions between environmental conditions and crop performance:

- Temperature-Humidity Index (THI): A composite measure that evaluates potential crop stress due to specific heat and moisture conditions.
- Nutrient Balance Ratio (NBR): Reflects the balance between nitrogen, phosphorus, and potassium in the soil.
- Water Availability Index (WAI): Combines soil moisture and rainfall to assess overall water availability for crops.
- Photosynthesis Potential (PP): Estimates the potential for photosynthesis based on sunlight exposure, CO2 concentration, and temperature.
- Soil Fertility Index (SFI): A composite metric that assesses soil fertility based on organic matter content and NPK levels.

## Application:

This dataset is suitable for a variety of applications in smart farming, including:

- Crop prediction and classification
- Environmental stress analysis
- Precision agriculture
- Resource management optimization

## Usage:

Researchers can use this dataset to develop models that predict crop health and yield, optimize resource usage, and assess the impact of environmental stressors on agricultural productivity. The inclusion of derived features like THI, NBR, WAI, PP, and SFI enhances the dataset's utility for developing advanced machine learning models tailored to the agricultural sector.