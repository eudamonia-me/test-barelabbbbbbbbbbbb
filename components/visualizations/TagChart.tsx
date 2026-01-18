'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TagChartProps {
  data: Array<{
    label: string
    count: number
    percentage: number
  }>
  title: string
}

export default function TagChart({ data, title }: TagChartProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-neutral-900">{title}</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis 
            dataKey="label" 
            tick={{ fontSize: 12, fill: '#737373' }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#737373' }}
            label={{ value: '% of users', angle: -90, position: 'insideLeft', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e5e5',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            formatter={(value: any) => [`${value}%`, 'Users']}
          />
          <Bar dataKey="percentage" fill="#171717" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-neutral-500 italic">
        Based on {data.reduce((sum, d) => sum + d.count, 0)} user mentions
      </p>
    </div>
  )
}
