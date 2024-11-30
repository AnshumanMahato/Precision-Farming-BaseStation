import { FC } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";

interface PumpStateCardProps {
  title: string;
  pumpState: "ON" | "OFF";
  handleToggle: () => Promise<void>;
}

const PumpStateCard: FC<PumpStateCardProps> = ({
  title,
  pumpState,
  handleToggle,
}) => {
  return (
    <Card className="w-64 p-4 bg-white shadow-lg rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center mt-4">
        <div
          className={`text-3xl font-bold ${
            pumpState === "ON" ? "text-green-600" : "text-red-600"
          }`}
        >
          {pumpState}
        </div>
        <Button
          className="mt-4 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          onClick={handleToggle}
        >
          Turn {pumpState === "ON" ? "OFF" : "ON"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PumpStateCard;
