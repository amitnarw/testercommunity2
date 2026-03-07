"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border text-sm shadow-sm flex flex-col gap-1">
        <p className="font-bold">{`${payload[0].name}`}</p>
        <p className="text-muted-foreground">{`Testers: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
];

export function DeviceOSCoverage({
  osData,
  deviceData,
}: {
  osData: { name: string; value: number }[];
  deviceData: { name: string; value: number }[];
}) {
  const hasData = osData.length > 0 || deviceData.length > 0;

  return (
    <Card className="shadow-none h-full">
      <CardHeader className="p-3 sm:p-6 pb-0">
        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
          Device &amp; OS Coverage
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-auto sm:h-[280px] p-3 sm:p-6">
        {!hasData ? (
          <div className="col-span-1 sm:col-span-2 flex items-center justify-center h-full text-muted-foreground py-8 sm:py-0">
            No device or OS coverage data available.
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
              <h4 className="text-sm font-semibold mb-2">OS Version</h4>
              {osData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={osData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      innerRadius={40}
                      outerRadius={60}
                      dataKey="value"
                      paddingAngle={5}
                    >
                      {osData.map((entry, index) => (
                        <Cell
                          key={`cell-os-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No OS data
                </div>
              )}
            </div>
            <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
              <h4 className="text-sm font-semibold mb-2">Devices</h4>
              {deviceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      innerRadius={40}
                      outerRadius={60}
                      dataKey="value"
                      paddingAngle={5}
                    >
                      {deviceData.map((entry, index) => (
                        <Cell
                          key={`cell-device-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No device data
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
