"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
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

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  if (percent < 0.12) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <rect x={x - 14} y={y - 8} width={28} height={16} rx={8} fill="white" />
      <text
        x={x}
        y={y + 1}
        fill="black"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: "9px", fontWeight: "bold" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
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

  const totalOS = osData.reduce((sum, item) => sum + item.value, 0);
  const totalDevices = deviceData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="shadow-none h-full">
      <CardHeader className="p-3 sm:p-6 pb-0">
        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
          Device &amp; OS Coverage
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-auto sm:h-[280px] p-3 sm:p-6">
        {!hasData ? (
          <div className="col-span-1 sm:col-span-2 flex items-center justify-center h-full text-muted-foreground py-8 sm:py-0">
            No device or OS coverage data available.
          </div>
        ) : (
          <>
            <div className="flex flex-col items-stretch justify-start h-full">
              <h4 className="text-sm font-semibold mb-2 px-1">OS Version</h4>
              {osData.length > 0 ? (
                <div className="flex flex-row sm:flex-col items-center justify-between gap-3 mt-1 w-full h-[180px] sm:h-auto">
                  {/* Legend */}
                  <div className="w-[45%] sm:w-full flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-2 sm:gap-x-3 sm:gap-y-1.5 max-h-[160px] sm:max-h-[60px] overflow-y-auto scrollbar-modal pr-1.5 py-1 order-first sm:order-last">
                    {osData.map((entry, index) => {
                      const percentage = totalOS > 0 ? ((entry.value / totalOS) * 100).toFixed(0) : "0";
                      return (
                        <div
                          key={entry.name}
                          className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto group cursor-default shrink-0"
                        >
                          <div className="flex items-center gap-1.5 truncate pr-1">
                            <div
                              className="h-2.5 w-2.5 rounded-sm shrink-0"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-[12px] font-bold text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[90px]" title={entry.name}>
                              {entry.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-muted-foreground shrink-0 group-hover:text-foreground transition-colors">
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Chart */}
                  <div className="w-[55%] sm:w-full h-[160px] sm:h-[130px] relative order-last sm:order-first">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          <filter id="pieShadowOS" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                          </filter>
                        </defs>
                        <Pie
                          data={osData}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={52}
                          paddingAngle={3}
                          cornerRadius={4}
                          dataKey="value"
                          stroke="none"
                          label={renderCustomLabel}
                          labelLine={false}
                          animationBegin={0}
                          animationDuration={800}
                          startAngle={90}
                          endAngle={450}
                        >
                          {osData.map((entry, index) => (
                            <Cell
                              key={`cell-os-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              className="outline-none"
                              filter="url(#pieShadowOS)"
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">
                  No OS data
                </div>
              )}
            </div>
            <div className="flex flex-col items-stretch justify-start h-full">
              <h4 className="text-sm font-semibold mb-2 px-1">Devices</h4>
              {deviceData.length > 0 ? (
                <div className="flex flex-row sm:flex-col items-center justify-between gap-3 mt-1 w-full h-[180px] sm:h-auto">
                  {/* Legend */}
                  <div className="w-[45%] sm:w-full flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-2 sm:gap-x-3 sm:gap-y-1.5 max-h-[160px] sm:max-h-[60px] overflow-y-auto scrollbar-modal pr-1.5 py-1 order-first sm:order-last">
                    {deviceData.map((entry, index) => {
                      const percentage = totalDevices > 0 ? ((entry.value / totalDevices) * 100).toFixed(0) : "0";
                      return (
                        <div
                          key={entry.name}
                          className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto group cursor-default shrink-0"
                        >
                          <div className="flex items-center gap-1.5 truncate pr-1">
                            <div
                              className="h-2.5 w-2.5 rounded-sm shrink-0"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-[12px] font-bold text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[90px]" title={entry.name}>
                              {entry.name}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-muted-foreground shrink-0 group-hover:text-foreground transition-colors">
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Chart */}
                  <div className="w-[55%] sm:w-full h-[160px] sm:h-[130px] relative order-last sm:order-first">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          <filter id="pieShadowDevice" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                          </filter>
                        </defs>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={28}
                          outerRadius={52}
                          paddingAngle={3}
                          cornerRadius={4}
                          dataKey="value"
                          stroke="none"
                          label={renderCustomLabel}
                          labelLine={false}
                          animationBegin={0}
                          animationDuration={800}
                          startAngle={90}
                          endAngle={450}
                        >
                          {deviceData.map((entry, index) => (
                            <Cell
                              key={`cell-device-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              className="outline-none"
                              filter="url(#pieShadowDevice)"
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">
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
