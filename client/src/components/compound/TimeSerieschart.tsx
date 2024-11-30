import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import millify from "millify";

const chartConfig = {
  value: {
    label: "value",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function TimeSeriesChart({
  title,
  data,
  className,
  config,
}: {
  title: string;
  data: { value: number; created_at: string }[];
  className?: string;
  config?: ChartConfig;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {/* {data[0].timestamp} - {data[data.length - 1].timestamp} */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config || chartConfig} className="text-[11px]">
          <LineChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval="preserveEnd"
              minTickGap={40}
              tickFormatter={(value) =>
                new Date(value).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                })
              }
            />
            <YAxis
              dataKey="value"
              tickLine={false}
              axisLine={false}
              tickMargin={5}
              width={55}
              interval="preserveEnd"
              tickFormatter={(value) =>
                millify(value, { precision: 1, space: true })
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="bg-white"
                  labelFormatter={(value) => {
                    console.log(value);
                    return new Date(value).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    });
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="value"
              type="monotone"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
