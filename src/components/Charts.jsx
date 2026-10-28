import React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = { background: "rgb(21, 26, 34)", border: "1px solid rgb(42, 49, 61)", borderRadius: 10, color: "rgb(244, 246, 248)", fontSize: 12 };

export function PlayerTrendChart({ data }) {
  return <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
      
      <CartesianGrid stroke="rgb(39, 46, 57)" strokeDasharray="4 5" vertical={false} />
      <XAxis dataKey="month" tick={{ fill: "rgb(127, 137, 153)", fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: "rgb(127, 137, 153)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
      <Tooltip contentStyle={tooltipStyle} formatter={(v) => [Number(v).toLocaleString("ru-RU"), "Игроки"]} />
      <Area type="monotone" dataKey="players" stroke="rgb(230, 162, 60)" strokeWidth={2.5} fill="rgba(230, 162, 60, 0.12)" activeDot={{ r: 4, fill: "rgb(230, 162, 60)", stroke: "rgb(17, 21, 28)", strokeWidth: 2 }} />
    </AreaChart>
  </ResponsiveContainer>;
}

export function RarityDonut({ data }) {
  return <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie data={data} dataKey="count" nameKey="name" innerRadius="63%" outerRadius="86%" paddingAngle={3} stroke="none">
        {data.map((entry, i) => <Cell key={entry.name} fill={entry.color || ["rgb(176, 195, 217)", "rgb(94, 152, 217)", "rgb(75, 105, 255)", "rgb(136, 71, 255)", "rgb(211, 44, 230)", "rgb(235, 75, 75)", "rgb(228, 174, 57)"][i % 7]} />)}
      </Pie>
      <Tooltip contentStyle={tooltipStyle} formatter={(v, name) => [Number(v).toLocaleString("ru-RU"), name]} />
    </PieChart>
  </ResponsiveContainer>;
}

export function CategoryBars({ data }) {
  return <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} layout="vertical" margin={{ top: 2, right: 10, left: 8, bottom: 2 }}>
      <CartesianGrid stroke="rgb(39, 46, 57)" strokeDasharray="4 5" horizontal={false} />
      <XAxis type="number" tick={{ fill: "rgb(127, 137, 153)", fontSize: 10 }} axisLine={false} tickLine={false} />
      <YAxis type="category" dataKey="name" width={108} tick={{ fill: "rgb(170, 179, 192)", fontSize: 10 }} axisLine={false} tickLine={false} />
      <Tooltip contentStyle={tooltipStyle} />
      <Bar dataKey="count" name="Предметы" fill="rgb(230, 162, 60)" radius={[0, 5, 5, 0]} barSize={13} />
    </BarChart>
  </ResponsiveContainer>;
}
