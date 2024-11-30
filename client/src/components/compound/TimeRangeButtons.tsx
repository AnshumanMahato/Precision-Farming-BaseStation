import React from "react";
import { Button } from "@/components/ui/button";

interface TimeRangeButtonsProps {
  onRangeSelect: (range: string) => void;
}

const TimeRangeButtons: React.FC<TimeRangeButtonsProps> = ({
  onRangeSelect,
}) => {
  return (
    <div className="flex gap-4 justify-center">
      <Button variant="outline" onClick={() => onRangeSelect("1hr")}>
        1 Hour
      </Button>
      <Button variant="outline" onClick={() => onRangeSelect("1day")}>
        1 Day
      </Button>
      <Button variant="outline" onClick={() => onRangeSelect("1month")}>
        1 Month
      </Button>
    </div>
  );
};

export default TimeRangeButtons;
