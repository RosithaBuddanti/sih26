import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Activity,
  Layers,
  MapPin,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

export default function AnalyticsView() {
  // Monthly Incident vs Near Miss vs SIF Precursor Trend for the 6 reports
  const monthlyComparison = [
    { month: 'Apr', totalIncidents: 1, nearMisses: 0, sifPrecursors: 0 },
    { month: 'May', totalIncidents: 2, nearMisses: 0, sifPrecursors: 1 },
    { month: 'Jun', totalIncidents: 3, nearMisses: 0, sifPrecursors: 1 },
    { month: 'Jul', totalIncidents: 4, nearMisses: 1, sifPrecursors: 2 },
    { month: 'Aug', totalIncidents: 5, nearMisses: 1, sifPrecursors: 2 },
    { month: 'Sep (Current)', totalIncidents: 6, nearMisses: 1, sifPrecursors: 3 },
  ];

  // Site Benchmark Scores & Hazard Frequency for active sites
  const plantBenchmarkData = [
    { site: 'Drilling Rig 04', safetyScore: 78, criticalHazards: 1, compliance: 85 },
    { site: 'Main Substation A', safetyScore: 82, criticalHazards: 1, compliance: 88 },
    { site: 'Separator B-12', safetyScore: 72, criticalHazards: 1, compliance: 82 },
    { site: 'Admin East Wing', safetyScore: 98, criticalHazards: 0, compliance: 99 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-stone-200 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-bold text-slate-800 border-b border-stone-100 pb-1">{label} Metric</div>
          {payload.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2" style={{ color: item.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span>{item.name}: <strong className="text-slate-900">{item.value}</strong></span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-800 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE6E1]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1EE] border border-[#FFE0D6] flex items-center justify-center text-[#FF5A36] shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Safety Telemetry Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-12">
            Enterprise analytics, multi-plant benchmarking, and predictive incident trajectory modeling
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white border border-[#EAE6E1] text-xs font-mono text-slate-700 shadow-xs flex items-center gap-2">
            <span>Historical Ingestion:</span>
            <strong className="text-[#FF5A36] font-bold text-sm">7 Months</strong>
          </div>
        </div>
      </div>

      {/* KPI Top Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-[#EAE6E1] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Observations</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">12,450</div>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">+12.8% reporting culture</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE6E1] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">TRIR (Injury Rate)</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-heading mt-1">0.14</div>
          <span className="text-xs text-emerald-600 font-bold mt-1 inline-block">-28% vs industry average</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE6E1] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Near-Miss to SIF Ratio</span>
          <div className="text-2xl sm:text-3xl font-black text-[#FF5A36] font-heading mt-1">6.8 : 1</div>
          <span className="text-xs text-slate-500 font-medium mt-1 inline-block">Healthy weak-signal capture</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EAE6E1] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Composite Safety Score</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading mt-1">91.4%</div>
          <span className="text-xs text-purple-600 font-bold mt-1 inline-block">Top quartile performance</span>
        </div>
      </div>

      {/* Chart 1: Incident vs Near Miss vs SIF Precursor Trend */}
      <div className="rounded-2xl bg-white border border-[#EAE6E1] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Incident Severity & Precursor Evolution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Demonstrating proactive reporting increase while severe incidents decline</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5A36]" />
              Incidents
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              Near Misses
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              SIF Precursors
            </span>
          </div>
        </div>

        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyComparison} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF5A36" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF5A36" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="nearGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="precurGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="totalIncidents" name="Incidents" stroke="#FF5A36" strokeWidth={2.5} fill="url(#incGrad)" />
              <Area type="monotone" dataKey="nearMisses" name="Near Misses" stroke="#10B981" strokeWidth={2.5} fill="url(#nearGrad)" />
              <Area type="monotone" dataKey="sifPrecursors" name="SIF Precursors" stroke="#F59E0B" strokeWidth={2.5} fill="url(#precurGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Cross-Plant Benchmarking & AI Analytics Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Plant Comparison Bar Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-[#EAE6E1] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Plant Safety Performance Index</h3>
              <p className="text-xs text-slate-400 mt-0.5">Comparative scoring (0-100) vs identified critical hazards</p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-[#FFF1EE] text-[#FF5A36] border border-[#FFE0D6] text-xs font-mono font-bold">
              4 Facilities
            </span>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={plantBenchmarkData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="site" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} domain={[0, 100]} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="safetyScore" name="Safety Score" fill="#FF5A36" radius={[6, 6, 0, 0]} />
                <Bar dataKey="compliance" name="Compliance %" fill="#10B981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Predictive Analytics Insights (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-white via-[#FFFBF9] to-[#FFF6F2] border border-[#FFE0D6] p-6 flex flex-col justify-between shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <div className="w-8 h-8 rounded-lg bg-[#FFF1EE] border border-[#FFE0D6] text-[#FF5A36] flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">AI Predictive Safety Insights</h3>
                <div className="text-[10px] text-[#FF5A36] font-mono font-bold">Neural forecast engine</div>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600">
              <div className="p-3.5 rounded-xl bg-white border border-[#EAE6E1] shadow-xs">
                <strong className="text-slate-900">Lead Indicator Correlation:</strong> Analysis of 12,450 reports demonstrates that facilities maintaining a near-miss reporting velocity of &gt;50/month experience 72% fewer actual lost-time injuries.
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#EAE6E1] shadow-xs">
                <strong className="text-[#FF5A36]">High Risk Hotspot:</strong> Heavy rigging operations in Plant 03 account for 44% of potential crane excursion events. Automated exclusion laser boundaries recommended.
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#EAE6E1] shadow-xs">
                <strong className="text-emerald-700">CAPA Effectiveness:</strong> Actions closed within 7 days showed a 91% zero-recurrence rate over a 90-day post-audit window.
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 font-mono text-center border-t border-stone-100">
            Algorithmic confidence: 94.7% • Model verified
          </div>
        </div>

      </div>

    </div>
  );
}
