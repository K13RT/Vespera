import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MOOD_OPTIONS } from '../constants';
import { Activity, TrendingUp, TrendingDown, Minus, Heart, CloudRain, Meh } from 'lucide-react';
import { JournalEntry, MoodLevel } from '../types';

interface MoodTrackerProps {
  entries: JournalEntry[];
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ entries }) => {
  // Process Data: Get last 7 days including today
  const { chartData, averageScore, averageMoodLabel, trendPercent } = useMemo(() => {
    const today = new Date();
    const last7Days = [];
    
    // Generate last 7 days dates
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        last7Days.push(d);
    }

    const data = last7Days.map(date => {
        const dateStr = date.toDateString();
        // Find entry for this date (taking the latest if multiple)
        const entry = entries.find(e => new Date(e.date).toDateString() === dateStr);
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            fullDate: dateStr,
            value: entry?.mood || 0, // 0 indicates no data
        };
    });

    // Calculate Average (only for days with data)
    const validEntries = data.filter(d => d.value > 0);
    const totalScore = validEntries.reduce((acc, curr) => acc + curr.value, 0);
    const avg = validEntries.length > 0 ? Math.round(totalScore / validEntries.length) : 0;
    const label = MOOD_OPTIONS.find(m => m.level === avg)?.label || 'Neutral';

    // Calculate Trend (Avg of last 3 days vs Avg of previous 3 days)
    // Slice index: [0,1,2,3,4,5,6] -> Last 3: 4,5,6 | Prev 3: 1,2,3
    const recentData = data.slice(4, 7).filter(d => d.value > 0);
    const prevData = data.slice(1, 4).filter(d => d.value > 0);
    
    const recentAvg = recentData.length ? recentData.reduce((a,b) => a+b.value, 0) / recentData.length : 0;
    const prevAvg = prevData.length ? prevData.reduce((a,b) => a+b.value, 0) / prevData.length : 0;
    
    let trendVal = 0;
    if (prevAvg > 0) {
        trendVal = Math.round(((recentAvg - prevAvg) / prevAvg) * 100);
    }

    return { 
        chartData: data, 
        averageScore: avg, 
        averageMoodLabel: label, 
        trendPercent: trendVal 
    };
  }, [entries]);

  // Custom Tick for Y-Axis (Icons)
  const CustomYAxisTick = ({ x, y, payload }: any) => {
    if (payload.value === 1) return <foreignObject x={x - 30} y={y - 12} width={24} height={24}><div className="flex justify-center text-gray-400"><CloudRain size={16} /></div></foreignObject>;
    if (payload.value === 3) return <foreignObject x={x - 30} y={y - 12} width={24} height={24}><div className="flex justify-center text-gray-400"><Meh size={16} /></div></foreignObject>;
    if (payload.value === 5) return <foreignObject x={x - 30} y={y - 12} width={24} height={24}><div className="flex justify-center text-pink-400"><Heart size={16} /></div></foreignObject>;
    return null;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      if (value === 0) return null; // Don't show tooltip for empty days

      const moodOption = MOOD_OPTIONS.find(m => m.level === value);
      const Icon = moodOption?.icon || Activity;
      
      return (
        <div className="bg-white/90 dark:bg-[#2A2A4A]/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-purple-100 dark:border-white/10 animate-fade-in z-50">
          <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">{label}</p>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full bg-gray-50 dark:bg-white/10 ${moodOption?.color}`}>
                <Icon size={16} />
            </div>
            <span className={`text-sm font-bold ${moodOption?.color}`}>
              {moodOption?.label}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full rounded-3xl p-5 shadow-lg bg-white dark:bg-vespera-cardDark flex flex-col justify-between overflow-hidden relative group">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative z-10 shrink-0">
        <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-pink-50 dark:bg-pink-900/20 text-pink-500 dark:text-pink-300">
                <Activity size={18} />
            </div>
            <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Emotional Flow</h3>
                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                    Avg: <span className="text-vespera-accent">{averageScore > 0 ? averageMoodLabel : 'No Data'}</span>
                </p>
            </div>
        </div>
        
        {/* Trend Indicator */}
        {trendPercent !== 0 && (
            <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full ${trendPercent > 0 ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-red-400 bg-red-50 dark:bg-red-900/20'}`}>
                {trendPercent > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{Math.abs(trendPercent)}%</span>
            </div>
        )}
        {trendPercent === 0 && averageScore > 0 && (
            <div className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full text-gray-400 bg-gray-50 dark:bg-white/5">
                <Minus size={12} />
                <span>Stable</span>
            </div>
        )}
      </div>
      
      {/* Chart */}
      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#9C27B0" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.3} />
            
            <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#9CA3AF', fontWeight: 500}}
                dy={10}
                interval={0}
            />
            
            <YAxis 
                domain={[0, 5]} 
                tickCount={6} 
                axisLine={false}
                tickLine={false}
                tick={<CustomYAxisTick />}
                width={35} 
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9C27B0', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            <Area 
                type="monotone" 
                dataKey="value" 
                connectNulls={true}
                stroke="#9C27B0" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorMood)" 
                activeDot={{ r: 6, strokeWidth: 4, stroke: '#fff', fill: '#9C27B0' }}
                dot={(props) => {
                    // Only render dot if value > 0
                    if (props.payload.value === 0) return <></>;
                    return <circle cx={props.cx} cy={props.cy} r={3} strokeWidth={0} fill="#9C27B0" fillOpacity={0.6} />;
                }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default React.memo(MoodTracker);