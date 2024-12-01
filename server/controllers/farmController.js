const Farm = require("../models/Farm");
const FarmData = require("../models/FarmData");
const catchAsync = require("../utils/catchAsync");

// Insert farm data
exports.insertFarmData = catchAsync(async (req, res, next) => {
  const { farmId } = req.params;
  const { farmData } = req.body;
  const data = farmData.map((d) => ({
    ...d,
    farm: farmId,
  }));
  await FarmData.insertMany(data);
  res.status(201).json({ message: "Farm data inserted successfully" });
});

// Get farm data
exports.getFarmData = catchAsync(async (req, res, next) => {
  const { farmId } = req.params;
  const { after } = req.query;
  const farmData = await FarmData.aggregate([
    {
      $match: {
        farm: farmId, // Filter by farm ID
        timestamp: {
          $gte: new Date(Date.now() - 60 * 60 * 1000), // Start of the range
        },
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$timestamp" },
          month: { $month: "$timestamp" },
          year: { $year: "$timestamp" },
          hour: { $hour: "$timestamp" },
          minute: { $minute: "$timestamp" },
        },
        moisture: { $avg: "$moisture" },
        temperature: { $avg: "$temperature" },
        humidity: { $avg: "$humidity" },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            hour: "$_id.hour",
            minute: "$_id.minute",
          },
        },
        moisture: 1,
        temperature: 1,
        humidity: 1,
      },
    },
    {
      $sort: { date: 1 }, // Sort results by date
    },
  ]);
  res.status(200).json({ farmData });
});

// Get farm Analysis
exports.getFarmAnalysis = catchAsync(async (req, res, next) => {
  const { farmId } = req.params;
  const { timesolt } = req.query;
  let startDate = null;
  const groupBy = {
    day: { $dayOfMonth: "$timestamp" },
    month: { $month: "$timestamp" },
    year: { $year: "$timestamp" },
  };

  switch (timesolt) {
    case "1d":
      startDate = new Date().getTime() - 24 * 60 * 60 * 1000;
      groupBy.hour = { $hour: "$timestamp" };
      break;
    case "7d":
      startDate = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
      break;
    case "14d":
      startDate = new Date().getTime() - 14 * 24 * 60 * 60 * 1000;
      break;
    case "30d":
      startDate = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
      break;
    default:
      startDate = new Date().getTime() - 24 * 60 * 60 * 1000;
      groupBy.hour = { $hour: "$timestamp" };
      break;
  }

  const farmData = await FarmData.aggregate([
    {
      $match: {
        farm: farmId, // Filter by farm ID
        timestamp: {
          $gte: new Date(startDate), // Start of the range
        },
      },
    },
    {
      $group: {
        _id: {
          ...groupBy,
        },
        avgmoisture: { $avg: "$moisture" },
        maxmoisture: { $max: "$moisture" },
        minmoisture: { $min: "$moisture" },
        avgtemperature: { $avg: "$temperature" },
        maxtemperature: { $max: "$temperature" },
        mintemperature: { $min: "$temperature" },
        avghumidity: { $avg: "$humidity" },
        maxhumidity: { $max: "$humidity" },
        minhumidity: { $min: "$humidity" },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            hour: groupBy.hour ? "$_id.hour" : 0,
          },
        },
        moisture: {
          avg: { $round: ["$avgmoisture", 1] },
          max: "$maxmoisture",
          min: "$minmoisture",
        },
        temperature: {
          avg: { $round: ["$avgtemperature", 1] },
          max: "$maxtemperature",
          min: "$mintemperature",
        },
        humidity: {
          avg: { $round: ["$avghumidity", 1] },
          max: "$maxhumidity",
          min: "$minhumidity",
        },
      },
    },
    {
      $sort: { date: 1 }, // Sort results by date
    },
  ]);
  res.status(200).json({ farmData });
});
