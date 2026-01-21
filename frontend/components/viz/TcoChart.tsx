'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface TcoDataPoint {
    year: string;
    cost: number;
    marketAverage: number;
}

interface TcoChartProps {
    data?: TcoDataPoint[];
    className?: string;
}

export const TcoChart = ({ className }: TcoChartProps) => {
    const [years, setYears] = React.useState(5);

    // Generate dynamic data based on selected years
    const data = React.useMemo(() => {
        return Array.from({ length: years }, (_, i) => {
            const yearNum = i + 1;
            // Simulated logarithmic growth for depreciation/maintenance
            const baseCost = 5000 * yearNum;
            const marketAvg = 6500 * yearNum + (yearNum * 500); // Market avg grows slightly faster
            return {
                year: `Year ${yearNum}`,
                cost: baseCost,
                marketAverage: marketAvg,
            };
        });
    }, [years]);

    return (
        <div className={`w-full h-[350px] bg-card p-4 rounded-lg border shadow-sm ${className}`}>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Total Cost of Ownership</h3>
                    <p className="text-sm text-muted-foreground">Cumulative costs vs. Category Average</p>
                </div>
                <select
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="p-1 rounded border bg-background text-sm"
                >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(y => (
                        <option key={y} value={y}>{y} Year{y > 1 ? 's' : ''}</option>
                    ))}
                </select>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                        dataKey="year"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px' }} />

                    <Line
                        type="monotone"
                        dataKey="marketAverage"
                        name="Market Average"
                        stroke="#9ca3af"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="cost"
                        name="Your Car"
                        stroke="#10b981"
                        strokeWidth={3}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
