import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  DoorClosed, 
  ArrowUpRight, 
  Anchor, 
  Crosshair, 
  Flame, 
  Car, 
  AlertOctagon, 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function LifeSavingRulesView() {
  const [selectedRule, setSelectedRule] = useState(null);

  const rules = [
    {
      id: 'LSR-01',
      name: 'Energy Isolation',
      category: 'Lock-Out / Tag-Out',
      icon: Zap,
      compliance: 92.4,
      violations: 6,
      verifications: 284,
      color: 'amber',
      mandate: 'Verify zero-energy state and apply Lock-Out/Tag-Out (LOTO) before commencing work on any energized system.',
      controls: [
        'Apply multi-padlock hasps on primary isolation points',
        'Test for zero voltage with calibrated multi-meter',
        'Bleed trapped fluid/gas pressure to zero gauge reading'
      ]
    },
    {
      id: 'LSR-02',
      name: 'Working at Height',
      category: 'Fall Protection',
      icon: ArrowUpRight,
      compliance: 88.6,
      violations: 11,
      verifications: 340,
      color: 'rose',
      mandate: 'Protect yourself against a fall whenever working at height above 1.8 meters or near unguarded platform edges.',
      controls: [
        'Inspect 100% tie-off twin lanyards and static lifelines',
        'Verify green scaffolding inspection status tags daily',
        'Install rigid toe-boards to prevent dropped objects'
      ]
    },
    {
      id: 'LSR-03',
      name: 'Line of Fire',
      category: 'Exclusion Zones',
      icon: Crosshair,
      compliance: 78.2,
      violations: 24,
      verifications: 198,
      color: 'rose',
      mandate: 'Position yourself outside the path of moving machinery, dynamic tension lines, and overhead crane trajectories.',
      controls: [
        'Establish hard barricaded exclusion zones around drop hazards',
        'Maintain constant line-of-sight communication with crane operators',
        'Never position body parts between moving and stationary objects'
      ]
    },
    {
      id: 'LSR-04',
      name: 'Confined Space',
      category: 'Atmospheric Safety',
      icon: DoorClosed,
      compliance: 96.1,
      violations: 2,
      verifications: 142,
      color: 'emerald',
      mandate: 'Obtain authorization, conduct continuous atmospheric gas testing, and maintain a dedicated standby entry watch.',
      controls: [
        'Continuous 4-gas monitor (LEL, O2, CO, H2S) calibration',
        'Designate trained hole-watch sentry with emergency air supply',
        'Verify positive mechanical ventilation before entry'
      ]
    },
    {
      id: 'LSR-05',
      name: 'Safe Mechanical Lifting',
      category: 'Crane & Rigging',
      icon: Anchor,
      compliance: 84.5,
      violations: 14,
      verifications: 215,
      color: 'amber',
      mandate: 'Verify lifting equipment integrity, never exceed safe working loads, and never walk or stand under suspended loads.',
      controls: [
        'Inspect certified shackles, wire slings, and spreader beams',
        'Establish barricades beneath maximum slewing radius',
        'Use non-conductive synthetic taglines to guide loads'
      ]
    },
    {
      id: 'LSR-06',
      name: 'Bypass Safety Controls',
      category: 'Overriding Interlocks',
      icon: AlertOctagon,
      compliance: 97.8,
      violations: 1,
      verifications: 112,
      color: 'emerald',
      mandate: 'Obtain executive approval and formal risk assessment before overriding or disabling any safety-critical device.',
      controls: [
        'Document formal Safety Instrumented System (SIS) bypass permit',
        'Implement temporary compensatory manual mitigations',
        'Maintain maximum 24-hour bypass time limit'
      ]
    },
    {
      id: 'LSR-07',
      name: 'Hot Work',
      category: 'Combustion & Sparks',
      icon: Flame,
      compliance: 94.2,
      violations: 4,
      verifications: 180,
      color: 'emerald',
      mandate: 'Control flammables and ignition sources in hazardous refinery zones and maintain continuous fire watch.',
      controls: [
        'Conduct LEL flammable gas test within 15m radius',
        'Deploy fire blankets over drainage channels and open sumps',
        'Post dedicated fire watch with charged 9kg dry powder cylinder'
      ]
    },
    {
      id: 'LSR-08',
      name: 'Driving Safety',
      category: 'Transport & Logistics',
      icon: Car,
      compliance: 91.0,
      violations: 7,
      verifications: 160,
      color: 'emerald',
      mandate: 'Wear seatbelts, adhere to 20 km/h facility speed limits, and never use handheld mobile phones while operating vehicles.',
      controls: [
        'Active in-vehicle telematics GPS tracking & speed governor',
        'Pre-trip vehicle circle-of-safety defect inspection',
        'Separation of pedestrian crosswalks from heavy forklift traffic'
      ]
    },
    {
      id: 'LSR-09',
      name: 'Work Authorization',
      category: 'Permit-to-Work (PTW)',
      icon: FileCheck,
      compliance: 95.5,
      violations: 3,
      verifications: 420,
      color: 'emerald',
      mandate: 'Work only with a valid Permit-to-Work confirming that all hazards have been assessed and joint site checks completed.',
      controls: [
        'Perform joint on-site inspection between Issuer and Performer',
        'Review Job Hazard Analysis (JHA) with frontline crew at toolbox talk',
        'Revalidate permits following any shift change or work interruption'
      ]
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-800 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE6E1]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FFF1EE] border border-[#FFE0D6] flex items-center justify-center text-[#FF5A36] shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight">
              Life-Saving Rules Compliance Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-12">
            Standardized 9 IOGP barrier rules mapped directly to field telemetry, control verifications, and observed infractions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white border border-[#EAE6E1] text-xs font-mono text-slate-700 shadow-xs flex items-center gap-2">
            <span>Overall Compliance:</span>
            <strong className="text-emerald-600 font-bold text-sm">91.4%</strong>
          </div>
        </div>
      </div>

      {/* 9 Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rules.map((rule) => {
          const Icon = rule.icon;
          return (
            <div 
              key={rule.id}
              onClick={() => setSelectedRule(rule)}
              className="p-5 rounded-2xl bg-white border border-[#EAE6E1] hover:border-[#FF5A36]/40 hover:shadow-md transition-all cursor-pointer group shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1] text-[#FF5A36] group-hover:bg-[#FFF1EE] transition-colors flex items-center justify-center shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#FF5A36] font-bold block">{rule.id}</span>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#FF5A36] transition-colors">
                        {rule.name}
                      </h3>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    rule.compliance >= 92 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : rule.compliance >= 85
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {rule.compliance}% Compliance
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {rule.mandate}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono">
                  <span>Verifications: <strong className="text-slate-900 font-bold">{rule.verifications}</strong></span>
                  <span>Violations: <strong className={rule.violations > 10 ? 'text-rose-600 font-bold' : 'text-slate-700'}>{rule.violations}</strong></span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      rule.compliance >= 92 ? 'bg-emerald-500' : rule.compliance >= 85 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${rule.compliance}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedRule && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 select-none animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#EAE6E1] shadow-2xl p-6 space-y-5 text-left text-slate-800">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-lg bg-[#FFF1EE] text-[#FF5A36] border border-[#FFE0D6] font-mono font-bold text-xs">
                  {selectedRule.id}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedRule.name} – {selectedRule.category}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedRule(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1] text-xs space-y-1">
              <div className="font-bold text-[#FF5A36] uppercase tracking-wider text-[11px]">IOGP Mandatory Standard</div>
              <p className="text-slate-700 leading-relaxed">{selectedRule.mandate}</p>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-emerald-700 block">
                Critical Barrier Controls
              </span>
              {selectedRule.controls.map((ctrl, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1] flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span className="text-slate-700">{ctrl}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1] grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">Total Control Audits</span>
                <span className="font-mono text-base font-bold text-slate-900">{selectedRule.verifications}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Logged Infractions</span>
                <span className={`font-mono text-base font-bold ${selectedRule.violations > 10 ? 'text-rose-600' : 'text-slate-700'}`}>
                  {selectedRule.violations}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRule(null)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#FF5A36] hover:from-[#FF5A36] hover:to-[#E04826] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                Close Rule
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
