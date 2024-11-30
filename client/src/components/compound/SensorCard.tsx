import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SensorCardProps {
  title: string;
  value: number;
  sensorType: "temperature" | "humidity" | "soil_moisture";
}

const SensorCard = ({ title, value, sensorType }: SensorCardProps) => {
  let unit = "";
  if (sensorType === "temperature") {
    unit = "°C";
  } else if (sensorType === "humidity") {
    unit = "%RH";
  } else if (sensorType === "soil_moisture") {
    unit = "%";
  }

  return (
    <Card className="w-64 p-4 bg-white shadow-lg rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-[5rem] font-bold text-blue-600">
          {parseInt(`${value}`)}
          <span className="text-2xl font-medium text-gray-500">
            &nbsp;{unit}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorCard;
