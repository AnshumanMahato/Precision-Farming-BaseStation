import { useEffect, useState } from "react";
import PumpStateCard from "./components/compound/PumpStateCard";
import SensorCard from "./components/compound/SensorCard";
import TimeSeriesChart from "./components/compound/TimeSerieschart";
import { ChartConfig } from "./components/ui/chart";
import axios from "axios";
import { Button } from "./components/ui/button";

type SensorData = {
  temperature: number;
  humidity: number;
  moisture: number;
  created_at: string;
};

function App() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(false);
  const [pumpState, setPumpState] = useState<"ON" | "OFF">("OFF");

  useEffect(() => {
    if (!loading) {
      const events = new EventSource("/api/data");
      events.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setSensorData([...data.readings]);
        setPumpState(data.pumpState);
        setLoading(true);
      };
    }
  }, [loading]);

  const handlePumpStateChange = async () => {
    try {
      if (pumpState === "OFF") {
        const res = await axios.get("/api/pump/ON");
        if (res.status === 200) {
          setPumpState("ON");
        }
      } else {
        const res = await axios.get("/api/pump/OFF");
        if (res.status === 200) {
          setPumpState("OFF");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const temperatureConfig = {
    value: {
      label: "Temperature",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const humidityConfig = {
    value: {
      label: "Humidity",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const moistureConfig = {
    value: {
      label: "Soil Moisture",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <main className="w-screen h-min overflow-x-hidden grid grid-cols-2">
      <div className="col-span-2 py-5 px-10 flex justify-end">
        <a href="http://">
          <Button className="bg-slate-800 text-slate-50 hover:text-slate-900 rounded-xl">
            Connect to Server
          </Button>
        </a>
      </div>
      <div className="bg-gray-100 p-5 flex flex-col gap-5">
        <h1 className="col-span-2 text-3xl h-min font-semibold text-gray-800 text-center">
          Current Stats
        </h1>
        <div className="grid grid-cols-2 gap-5">
          <SensorCard
            title="Temperature"
            value={sensorData[sensorData.length - 1]?.temperature || 0}
            sensorType="temperature"
          />
          <SensorCard
            title="Humidity"
            value={sensorData[sensorData.length - 1]?.humidity || 0}
            sensorType="humidity"
          />
          <SensorCard
            title="Soil Moisture"
            value={sensorData[sensorData.length - 1]?.moisture || 0}
            sensorType="soil_moisture"
          />
          <PumpStateCard
            title="Water Pump"
            pumpState={pumpState}
            handleToggle={handlePumpStateChange}
          />
        </div>
      </div>
      <div className="overflow-y-scroll h-screen p-5 flex flex-col gap-5">
        <h1 className="col-span-2 text-3xl h-min font-semibold text-gray-800 text-center">
          Visualizations
        </h1>
        <div className="overflow-y-scroll flex flex-col gap-5 ">
          <TimeSeriesChart
            title="Temperature"
            data={sensorData.map((data) => ({
              value: data.temperature,
              created_at: data.created_at,
            }))}
            config={temperatureConfig}
          />
          <TimeSeriesChart
            title="Humidity"
            data={sensorData.map((data) => ({
              value: data.humidity,
              created_at: data.created_at,
            }))}
            config={humidityConfig}
          />
          <TimeSeriesChart
            title="Soil Moisture"
            data={sensorData.map((data) => ({
              value: data.moisture,
              created_at: data.created_at,
            }))}
            config={moistureConfig}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
