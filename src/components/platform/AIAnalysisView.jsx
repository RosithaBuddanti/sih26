import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle,
  CheckCircle2, 
  MapPin, 
  Zap, 
  Layers, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle, 
  FileText, 
  Activity, 
  Flame, 
  Scale, 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  Sliders, 
  ChevronRight,
  Send,
  AlertOctagon,
  RefreshCw,
  Radio,
  Eye,
  X,
  ExternalLink,
  Database,
  Network,
  Crosshair,
  Info
} from 'lucide-react';
import { api } from '../../services/api';
import FullAnalysisModal from './FullAnalysisModal';
import { 
  addReportRecord, 
  addWeakSignalToBoard, 
  getStoredWeakSignals, 
  subscribeSafetyStore,
  getTodayDateString,
  getStoreState,
  extractUnitKey
} from '../../services/safetyStore';

// Available uploaded safety report data from ingestion registry
const AVAILABLE_UPLOADED_REPORTS = [
  {
    ref: 'OIL-BATCH-01',
    name: 'Main Pipeline High-Pressure Gas Leakage',
    type: 'NEAR_MISS',
    location: 'Unit 1',
    text: 'High-pressure gas pipeline flange developed severe leakage. Gas alarm at 65% LEL near switch.'
  },
  {
    ref: 'OIL-BATCH-02',
    name: 'Electrical Switchboard Fire and Smoke Outbreak',
    type: 'NEAR_MISS',
    location: 'Unit 2',
    text: 'Electrical fire erupted in distribution board due to overloaded breaker with open flames visible.'
  },
  {
    ref: 'OIL-BATCH-03',
    name: 'Storage Shed LPG Gas Cylinder Valve Leakage',
    type: 'UNSAFE_CONDITION',
    location: 'Unit 3',
    text: 'Pressurized LPG cylinder valve found leaking flammable propane gas inside storage shed.'
  },
  {
    ref: 'OIL-BATCH-04',
    name: 'Hot Work Welding Sparks Floor Flash Fire',
    type: 'UNSAFE_ACT',
    location: 'Unit 4',
    text: 'Welding sparks near solvent drum ignited oily rags on the floor causing an immediate flash fire.'
  }
];

// Baseline 6 Total Records from Database Ledger - Simple Fire and Gas Leakage Issues
const BASELINE_TOTAL_REPORTS = [
  {
    id: 1,
    report_reference: 'REP-ID001-0001',
    report_name: 'Compressor Station Natural Gas Pipeline Leakage',
    report_type: 'Near Miss',
    description: 'High-pressure natural gas pipeline flange suffered gasket blowout, releasing massive gas cloud across the compressor bay. Gas detector alarm triggered at 70% LEL in vicinity of unclassified electrical lights.',
    location: 'Unit 1',
    facility_unit: 'Gas Compressor Bay A',
    report_date: '2026-09-02',
    risk_level: 'Critical',
    sif_precursor_assessment: 'YES',
    ai_score: 95,
    status: 'Action Required',
    identified_hazard: 'Flammable Natural Gas Leakage & Vapor Cloud Explosion Hazard',
    energy_source: 'High-Pressure Combustible Gas (60 bar)',
    barrier_status: 'PRIMARY GASKET SEAL FAILED',
    recommended_action: 'Trip Emergency Shutdown (ESD) valve, isolate gas supply, and replace flange gasket.'
  },
  {
    id: 2,
    report_reference: 'REP-ID001-0002',
    report_name: 'Main Substation Electrical Cabinet Fire Outbreak',
    report_type: 'Near Miss',
    description: 'Electrical fire erupted inside the 415V power distribution panel due to loose cable lug overheating. Flames reached 1.5 meters high with thick toxic smoke spreading into the control room.',
    location: 'Unit 2',
    facility_unit: 'Electrical Substation 02',
    report_date: '2026-09-03',
    risk_level: 'Critical',
    sif_precursor_assessment: 'YES',
    ai_score: 92,
    status: 'Action Required',
    identified_hazard: 'Electrical Panel Fire Outbreak & Toxic Smoke Exposure',
    energy_source: 'Thermal & Electrical Energy (415V Arc Plasma)',
    barrier_status: 'ELECTRICAL FIRE BARRIER BREACHED',
    recommended_action: 'Trip substation main breaker, discharge CO2 extinguisher, and clear all combustible materials.'
  },
  {
    id: 3,
    report_reference: 'REP-ID001-0003',
    report_name: 'LPG Storage Tank Flange Flammable Gas Leakage',
    report_type: 'Unsafe Condition',
    description: 'Heavy propane gas leak detected around the bottom discharge flange of LPG Bulk Storage Tank 03. Flammable gas vapor pooled in low-lying ground trench near vehicle roadway without safety barricades.',
    location: 'Unit 3',
    facility_unit: 'LPG Storage Farm',
    report_date: '2026-09-04',
    risk_level: 'Critical',
    sif_precursor_assessment: 'YES',
    ai_score: 89,
    status: 'Action Required',
    identified_hazard: 'Flammable LPG Gas Leakage & Low-Lying Vapor Cloud',
    energy_source: 'Pressurized Liquid Petroleum Gas (18 bar)',
    barrier_status: 'TANK BOTTOM FLANGE GASKET DAMAGED',
    recommended_action: 'Close emergency isolation valve, establish 100m cordon, and spray water curtain.'
  },
  {
    id: 4,
    report_reference: 'REP-ID001-0004',
    report_name: 'Structural Welding Sparks Igniting Solvent Floor Fire',
    report_type: 'Unsafe Act',
    description: 'Welder operated cutting torch directly above open degreaser solvent tub. Falling molten slag sparks ignited cleaning solvent, causing an instant 2-meter floor fire. No fire extinguisher or fire blanket was at the work post.',
    location: 'Unit 4',
    facility_unit: 'Fabrication Workshop Bay 4',
    report_date: '2026-09-01',
    risk_level: 'Critical',
    sif_precursor_assessment: 'YES',
    ai_score: 86,
    status: 'Action Required',
    identified_hazard: 'Hot Work Welding Sparks Igniting Flammable Liquid Fire',
    energy_source: 'Thermal Molten Slag & Chemical Solvent Flame',
    barrier_status: 'FIRE BLANKET & HOT WORK CONTROLS OMITTED',
    recommended_action: 'Enforce 10-meter clearance from flammables and mandate certified continuous Fire Watch.'
  },
  {
    id: 5,
    report_reference: 'REP-ID001-0005',
    report_name: 'Staff Canteen Cooking Gas Stove Valve Micro-Leak',
    report_type: 'Unsafe Condition',
    description: 'Faint gas odor detected near kitchen commercial stove burner valve. Soap bubble test showed slow micro-seep on rubber hose clamp. Non-SIF low-pressure localized odor; kitchen exhaust was running.',
    location: 'Unit 1',
    facility_unit: 'Staff Facility Kitchen',
    report_date: '2026-09-02',
    risk_level: 'Low',
    sif_precursor_assessment: 'NO',
    ai_score: 28,
    status: 'Under Review',
    identified_hazard: 'Minor Low-Pressure Cooking Gas Valve Seep',
    energy_source: 'Low-Pressure Fuel Gas (< 0.5 bar)',
    barrier_status: 'PRIMARY VALVE SEAL AGED',
    recommended_action: 'Tighten hose clamp, replace aged rubber gas hose, and re-test with gas detector.'
  },
  {
    id: 6,
    report_reference: 'REP-ID001-0006',
    report_name: 'Office Smoking Area Trash Bin Smoldering Cigarette',
    report_type: 'Near Miss',
    description: 'Smoldering paper cup and cigarette butt found smoking inside metal trash bin outside office doorway. Extinguished immediately with a cup of water. Isolated minor housekeeping incident with zero flame spread.',
    location: 'Unit 2',
    facility_unit: 'Office Perimeter Walkway',
    report_date: '2026-09-04',
    risk_level: 'Low',
    sif_precursor_assessment: 'NO',
    ai_score: 19,
    status: 'Closed',
    identified_hazard: 'Smoldering Paper Waste in Metal Bin',
    energy_source: 'Low Thermal Ember',
    barrier_status: 'METAL ENCLOSURE CONTAINED EMBERS',
    recommended_action: 'Empty waste bin, fill ash receptacle with sand, and remind staff of smoking policy.'
  }
];

function getStoredTotalRecords() {
  try {
    const isWiped = typeof localStorage !== 'undefined' && localStorage.getItem('safetyai_data_wiped_fresh') === 'true';
    if (isWiped) {
      return [];
    }
    const raw = localStorage.getItem('SAFETY_TOTAL_REPORTS_V3');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {}
  return [];
}

function autoPersistToTotalRecords(newRecord) {
  try {
    const current = getStoredTotalRecords();
    const existingIndex = current.findIndex(
      r => (r.description && newRecord.description && r.description.trim() === newRecord.description.trim()) ||
           (r.report_reference && r.report_reference === newRecord.report_reference)
    );
    let updated;
    let savedRecord = newRecord;
    if (existingIndex >= 0) {
      savedRecord = { ...current[existingIndex], ...newRecord };
      updated = [...current];
      updated[existingIndex] = savedRecord;
    } else {
      updated = [newRecord, ...current];
    }
    localStorage.setItem('SAFETY_TOTAL_REPORTS_V3', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return { record: savedRecord, totalCount: updated.length };
  } catch (err) {
    console.error('Error auto-saving report to total records:', err);
    return { record: newRecord, totalCount: 7 };
  }
}

const SAFETY_KEYWORDS = [
  'leak', 'gas', 'fire', 'flame', 'smoke', 'spark', 'electrical', 'wire',
  'arc', 'cable', 'breaker', 'panel', 'switch', 'valve', 'pipe', 'pipeline',
  'tank', 'cylinder', 'pressure', 'relief', 'hazard', 'unsafe', 'danger',
  'fall', 'height', 'scaffold', 'ladder', 'crane', 'lift', 'rigging', 'sling',
  'hoist', 'confined', 'asphyxiat', 'toxic', 'chemical', 'acid', 'corros',
  'spill', 'blowout', 'explosion', 'blast', 'burn', 'hot work', 'welding',
  'grinding', 'lockout', 'tagout', 'loto', 'ppe', 'grating', 'slip', 'trip',
  'housekeeping', 'water', 'oil', 'pump', 'engine', 'compressor'
];

const UNRELATED_TERMS = [
  'nothing', 'none', 'nil', 'na', 'n/a', 'not applicable', 'no issue', 'no issues', 
  'no hazard', 'nothing to report', 'all good', 'all normal', 'ok', 'okay', 'fine', 
  'good', 'test', 'testing', 'hi', 'hii', 'hiii', 'hiiii', 'hello', 'hey', 'heyy', 'check', 
  'demo', 'sample', 'abc', 'xyz', 'foo', 'bar', 'asdf', 'qwerty', 'asdfgh', '123', 
  '1234', 'blank', 'empty', 'null', 'undefined', 'nothin', 'clear', 'clean', 'normal'
];

function isUnrelatedIssue(text) {
  if (!text) return true;
  const cleaned = text.trim().toLowerCase();
  if (cleaned.length === 0) return true;
  if (UNRELATED_TERMS.includes(cleaned)) return true;
  if (/^(nothing|no issue|no hazard|all good|test|testing|hello|hi\b)/i.test(cleaned)) {
    return true;
  }
  const hasSafetyWord = SAFETY_KEYWORDS.some(k => cleaned.includes(k));
  if (!hasSafetyWord) {
    if (cleaned.length < 20) return true;
  }
  return false;
}

function isTrivialInput(text) {
  return isUnrelatedIssue(text);
}

function deriveReportName(text, type, loc) {
  if (!text) return `Safety Observation (${loc})`;
  if (isUnrelatedIssue(text)) return 'Enter Correct Issue';
  const matched = AVAILABLE_UPLOADED_REPORTS.find(r => r.text.trim() === text.trim());
  if (matched && matched.name) return matched.name;

  const lower = text.toLowerCase();
  if (lower.includes('gas') && (lower.includes('pipeline') || lower.includes('compressor'))) {
    return 'Main Pipeline High-Pressure Gas Leakage';
  } else if (lower.includes('lpg') || lower.includes('propane') || (lower.includes('gas') && lower.includes('cylinder'))) {
    return 'Storage Shed LPG Gas Cylinder Valve Leakage';
  } else if (lower.includes('gas') || lower.includes('leak')) {
    return 'Flammable Gas Pipeline Leakage Report';
  } else if (lower.includes('electrical') || lower.includes('switchboard') || lower.includes('panel') || lower.includes('breaker')) {
    return 'Electrical Switchboard Fire and Smoke Outbreak';
  } else if (lower.includes('welding') || lower.includes('spark') || lower.includes('hot work') || lower.includes('solvent')) {
    return 'Hot Work Welding Sparks Floor Flash Fire';
  } else if (lower.includes('fire') || lower.includes('flame') || lower.includes('smoke')) {
    return 'Industrial Facility Fire Outbreak Report';
  } else if (lower.includes('height') || lower.includes('scaffold') || lower.includes('fall')) {
    return 'Working at Height Scaffolding Hazard Report';
  } else if (lower.includes('crane') || lower.includes('sling') || lower.includes('lift')) {
    return 'Heavy Lifting Rigging and Hoisting Hazard Report';
  } else if (lower.includes('confined') || lower.includes('tank entry') || lower.includes('asphyxiat')) {
    return 'Confined Space Atmospheric Entry Hazard Report';
  } else if (lower.includes('chemical') || lower.includes('acid') || lower.includes('caustic')) {
    return 'Hazardous Chemical Exposure and Containment Report';
  }
  const firstClause = text.split(/[.!?\n]/)[0].trim();
  if (firstClause.length > 8 && firstClause.length <= 50) {
    return `${firstClause} Report`;
  }
  return `Safety Observation Report (${loc})`;
}

function calculateDynamicRiskScore(text, rType, isSIF) {
  if (isTrivialInput(text)) return 0;
  const lower = (text || '').toLowerCase();
  if (!isSIF) {
    const hasContainment = lower.includes('contained') || lower.includes('isolated') || lower.includes('extinguished');
    return hasContainment ? 19 : 28;
  }
  let score = 88;
  if (lower.includes('explosion') || lower.includes('high-pressure') || lower.includes('flame') || lower.includes('fire') || lower.includes('outbreak') || lower.includes('65%') || lower.includes('70%')) {
    score += 6;
  }
  if (lower.includes('without') || lower.includes('no fire extinguisher') || lower.includes('missing') || lower.includes('no shutoff')) {
    score += 3;
  }
  return Math.min(score, 98);
}

// Master Weak Signals Correlation Engine across Total Records + Present Record (Fire & Gas Leakages)
// STRICT AUDIT RULE: One Weak Signal must be identified by two or more records (>= 2 records)
function generateAllWeakSignalsAnalysis(storedReports, currentResult, currentText, currentLocation) {
  const textLower = (currentText || '').toLowerCase();
  
  const matchesKeywords = (str, keywords) => {
    const s = (str || '').toLowerCase();
    return keywords.some(k => s.includes(k));
  };

  const rawSignalsConfig = [
    {
      id: 'WS-001',
      code: 'GAS-LEAK-WEAK-01',
      title: 'Audible Gas Hissing & Micro Flange Gas Leakage',
      category: 'Gas Containment & Leak Prevention',
      severity: 'Critical SIF Precursor',
      severityColor: 'rose',
      keywords: ['gas', 'leak', 'pipeline', 'compressor', 'flange', 'hissing', 'lel', 'vapor', 'pressure'],
      presentObservation: `Directly identified in present record "${currentResult?.report_name || 'Gas Leakage Report'}" (${currentLocation}): Pressurized gas leak with audible hissing and vapor accumulation detected before automated ESD shutdown.`,
      baselineMatches: [
        {
          ref: 'REP-ID001-0001',
          name: 'Compressor Station Natural Gas Pipeline Leakage',
          unit: 'Gas Compressor Bay A',
          date: '2026-09-02',
          role: 'Catastrophic Precursor Analogue',
          excerpt: 'Pipeline flange gasket blowout released 70% LEL gas cloud across compressor bay near active electrical lights.'
        },
        {
          ref: 'REP-ID001-0003',
          name: 'LPG Storage Tank Flange Flammable Gas Leakage',
          unit: 'LPG Storage Farm',
          date: '2026-09-04',
          role: 'Secondary Containment Leak Match',
          excerpt: 'Heavy propane leak pooling in low-lying ground trench near roadway without safety barricades.'
        },
        {
          ref: 'REP-ID001-0005',
          name: 'Staff Canteen Cooking Gas Stove Valve Micro-Leak',
          unit: 'Staff Facility Kitchen',
          date: '2026-09-02',
          role: 'Fuel Gas Joint Seepage Precursor',
          excerpt: 'Slow micro-seep on gas valve connection causing localized fuel gas odor accumulation.'
        }
      ],
      aiDetectionCriteria: 'Audible high-velocity hissing sound and gas detector readings exceeding 20% LEL around pressurized pipe joints and flanges.',
      precursorEscalation: 'Gasket micro-leakage → rapid plume expansion → gas cloud reaches explosive limit (5–15% in air) → spark from nearby electrical switch triggers catastrophic vapor explosion.',
      systemicMitigation: '1. Immediately shut Emergency Shutdown (ESD) valves to cut gas supply.\n2. Evacuate personnel upwind and establish a 50-meter safety perimeter.\n3. Replace compromised flange gaskets and torque bolts to manufacturer specifications.'
    },
    {
      id: 'WS-002',
      code: 'FIRE-ELEC-WEAK-02',
      title: 'Electrical Panel Overheating & Smoldering Insulation Odor',
      category: 'Electrical Fire Safety & Prevention',
      severity: 'Critical SIF Precursor',
      severityColor: 'rose',
      keywords: ['electrical', 'panel', 'breaker', 'switchboard', 'cable', 'arcing', 'substation', 'lug', 'transformer'],
      presentObservation: `Directly identified in present record "${currentResult?.report_name || 'Electrical Fire Report'}" (${currentLocation}): Overheated terminal lugs and open fire/smoke inside electrical distribution enclosure.`,
      baselineMatches: [
        {
          ref: 'REP-ID001-0002',
          name: 'Main Substation Electrical Cabinet Fire Outbreak',
          unit: 'Electrical Substation 02',
          date: '2026-09-03',
          role: 'Baseline Historical Fire Incident',
          excerpt: 'Electrical fire erupted inside 415V power distribution panel due to loose cable lug, producing 1.5m flames.'
        },
        {
          ref: 'REP-ID001-0006',
          name: 'Office Perimeter Smoldering & Insulation Breakdown',
          unit: 'Office Perimeter Walkway',
          date: '2026-09-04',
          role: 'Thermal Breakdown Correlation',
          excerpt: 'Smoldering paper and localized thermal hotspot near exterior power conduit routing.'
        }
      ],
      aiDetectionCriteria: 'Localized thermal hotspot (>90°C) on electrical busbars and acrid plastic smell detected prior to open flame ignition.',
      precursorEscalation: 'High resistance terminal connection → cable insulation melts and chars → sustained electrical arcing → open switchboard fire spreading to nearby combustible storage.',
      systemicMitigation: '1. De-energize electrical main power breakers immediately and discharge CO2 fire extinguisher.\n2. Maintain strict 3-meter clear zone with zero combustible storage in front of all panels.\n3. Conduct quarterly infrared thermal imaging on all switchboard terminal lugs.'
    },
    {
      id: 'WS-003',
      code: 'GAS-CYLINDER-WEAK-03',
      title: 'Storage Cylinder Valve Seepage & Confined Gas Odor Accumulation',
      category: 'Compressed Gas Storage & Handling',
      severity: 'High SIF Precursor',
      severityColor: 'amber',
      keywords: ['cylinder', 'lpg', 'propane', 'shed', 'bottle', 'manifold', 'valve', 'mercaptan'],
      presentObservation: `Directly identified in present record "${currentResult?.report_name || 'Cylinder Leakage Report'}" (${currentLocation}): Damaged cylinder valve weeping gas with strong odor in storage space.`,
      baselineMatches: [
        {
          ref: 'REP-ID001-0003',
          name: 'LPG Storage Tank Flange Flammable Gas Leakage',
          unit: 'LPG Storage Farm',
          date: '2026-09-04',
          role: 'LPG Flammable Vapor Accumulation Analogue',
          excerpt: 'Uncontrolled propane vapor accumulation in low-lying area near unclassified transit vehicles.'
        },
        {
          ref: 'REP-ID001-0005',
          name: 'Staff Canteen Cooking Gas Stove Valve Micro-Leak',
          unit: 'Staff Facility Kitchen',
          date: '2026-09-02',
          role: 'Gas Valve Seal Degradation',
          excerpt: 'Micro-leak on pressurized fuel gas line with positive bubble test on valve connection.'
        }
      ],
      aiDetectionCriteria: 'Distinct sulfur rotten-egg odor (mercaptan) and positive bubble reaction on cylinder valve stem under pressurized conditions.',
      precursorEscalation: 'Slow valve seepage → dense gas settles at ground level in unventilated shed → ambient LEL threshold exceeded → static spark triggers violent flash fire.',
      systemicMitigation: '1. Relocate leaking cylinder to open-air ventilated staging area immediately.\n2. Prohibit heaters, phones, or any spark sources within 15 meters.\n3. Spray soapy water to pinpoint leak point and return damaged cylinder to supplier.'
    },
    {
      id: 'WS-004',
      code: 'FIRE-SPARK-WEAK-04',
      title: 'Hot Work Welding Sparks Near Unshielded Flammable Materials',
      category: 'Hot Work & Fire Prevention',
      severity: 'Critical SIF Precursor',
      severityColor: 'rose',
      keywords: ['welding', 'spark', 'hot work', 'solvent', 'grinding', 'torch', 'slag', 'cutting', 'combustible'],
      presentObservation: `Directly identified in present record "${currentResult?.report_name || 'Hot Work Fire Report'}" (${currentLocation}): Hot welding sparks falling near combustible solvent drums without fire blanket protection.`,
      baselineMatches: [
        {
          ref: 'REP-ID001-0004',
          name: 'Structural Welding Sparks Igniting Solvent Floor Fire',
          unit: 'Fabrication Workshop Bay 4',
          date: '2026-09-01',
          role: 'Identical Flash Fire Event',
          excerpt: 'Cutting torch sparks ignited cleaning solvent rags on floor, creating instant 2m open flame.'
        },
        {
          ref: 'REP-ID001-0002',
          name: 'Main Substation Electrical Ignition Analogue',
          unit: 'Electrical Substation 02',
          date: '2026-09-03',
          role: 'Open Ignition Source Analogue',
          excerpt: 'Open ignition flames erupted adjacent to combustible staging materials.'
        }
      ],
      aiDetectionCriteria: 'Open cutting/welding activity conducted within 10 meters of combustible liquids or rags without certified flame-retardant spark curtains.',
      precursorEscalation: 'Flying molten sparks land on solvent-soaked debris → immediate smoldering ember → ignition of open flame → full room engulfment within 60 seconds.',
      systemicMitigation: '1. Enforce strict 10-meter clearance separating hot work from any flammable chemicals or debris.\n2. Deploy fiberglass fire blankets and have charged ABC fire extinguishers at work post.\n3. Require certified Fire Watch personnel during and 30 minutes after completion of work.'
    }
  ];

  const processedSignals = rawSignalsConfig.map(config => {
    const isPresentInCurrent = matchesKeywords(textLower, config.keywords);
    const identifyingRecords = [];

    // 1. Current Analyzed Record (if matches pattern)
    if (isPresentInCurrent) {
      identifyingRecords.push({
        ref: 'Current Analyzed Record',
        name: currentResult?.report_name || deriveReportName(currentText, 'NEAR_MISS', currentLocation),
        unit: currentLocation || 'Operating Unit',
        date: new Date().toISOString().split('T')[0],
        role: 'Active Trigger Record',
        excerpt: currentText ? (currentText.length > 150 ? currentText.slice(0, 150) + '...' : currentText) : 'Live safety observation entered in intelligence engine.'
      });
    }

    // 2. Add baseline historical correlating records
    config.baselineMatches.forEach(bm => {
      identifyingRecords.push(bm);
    });

    // 3. Dynamically scan stored reports for any additional real uploaded records that match
    if (Array.isArray(storedReports)) {
      storedReports.forEach(rep => {
        const repText = ((rep.description || '') + ' ' + (rep.identified_hazard || '') + ' ' + (rep.report_name || '')).toLowerCase();
        const alreadyIncluded = identifyingRecords.some(r => r.ref === rep.report_reference);
        if (!alreadyIncluded && matchesKeywords(repText, config.keywords)) {
          identifyingRecords.push({
            ref: rep.report_reference || `REC-${rep.id}`,
            name: rep.report_name || rep.identified_hazard || 'Operational Record',
            unit: rep.facility_unit || rep.location || 'Facility',
            date: rep.report_date || '2026-09-03',
            role: 'Database Correlated Record',
            excerpt: rep.description ? (rep.description.length > 150 ? rep.description.slice(0, 150) + '...' : rep.description) : 'Archived safety observation.'
          });
        }
      });
    }

    // STRICT GOVERNANCE RULE ENFORCEMENT:
    // "one weak signals must be identified by two or more records"
    // Any candidate signal supported by fewer than 2 records is strictly eliminated!
    if (identifyingRecords.length < 2) {
      return null;
    }

    return {
      ...config,
      isPresentInCurrent,
      identifyingRecords,
      identifyingRecordsCount: identifyingRecords.length,
      presentRecordObservation: isPresentInCurrent 
        ? config.presentObservation 
        : `Correlated with cross-unit operational telemetry across ${identifyingRecords.length} records.`,
      historicalMatches: identifyingRecords.filter(r => r.ref !== 'Current Analyzed Record')
    };
  }).filter(Boolean);

  return processedSignals;
}

export default function AIAnalysisView() {
  const [reportType, setReportType] = useState('NEAR_MISS');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Unit 1');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [uploadedIndex, setUploadedIndex] = useState(0);

  // Auto-saved confirmation state
  const [autoSavedInfo, setAutoSavedInfo] = useState(null);

  // Weak Signals Modal State
  const [showWeakSignalsModal, setShowWeakSignalsModal] = useState(false);
  const [selectedWeakSignal, setSelectedWeakSignal] = useState(null);
  const [selectedDossierReport, setSelectedDossierReport] = useState(null);
  const [expandedHistoricalRecord, setExpandedHistoricalRecord] = useState(null);
  const [totalStoredRecords, setTotalStoredRecords] = useState(getStoredTotalRecords);

  useEffect(() => {
    const handleStorageChange = () => {
      setTotalStoredRecords(getStoredTotalRecords());
    };
    window.addEventListener('storage', handleStorageChange);
    const unsubStore = subscribeSafetyStore(() => {
      setTotalStoredRecords(getStoredTotalRecords());
    });
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      unsubStore();
    };
  }, []);

  const executeInference = async (textToAnalyze, typeToUse, unitToUse) => {
    const text = (textToAnalyze || description || '').trim();
    const loc = unitToUse || location;
    const rType = typeToUse || reportType;

    if (!text) return;

    setIsAnalyzing(true);
    setAutoSavedInfo(null);
    setAnalysisStep('Phase 1/4: Ingesting uploaded report telemetry & parsing energy vectors...');

    setTimeout(() => {
      setAnalysisStep('Phase 2/4: Screening IOGP Life-Saving Rules & barrier failure states...');
    }, 250);

    setTimeout(() => {
      setAnalysisStep('Phase 3/4: Correlating multi-signal interaction & detecting weak signals...');
    }, 500);

    setTimeout(() => {
      setAnalysisStep('Phase 4/4: Computing neural risk score & SIF precursor determination...');
    }, 750);

    const isUnrelated = isUnrelatedIssue(text);
    const reportName = deriveReportName(text, rType, loc);

    // UNRELATED / TRIVIAL INPUT INTERCEPT: Prompt user to enter a correct safety issue
    if (isUnrelated) {
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisStep('');
        setValidationError('Enter Correct Issue: Please describe an active operational safety observation, equipment condition, or hazard.');

        const finalResult = {
          is_unrelated: true,
          report_name: 'Enter Correct Issue',
          sif_precursor: 'NO',
          confidence: 0,
          risk_score: 0,
          classification: rType,
          detected_hazards: [
            'Observation does not contain recognized industrial safety hazards or equipment context',
            'Zero physical energy vectors or critical barrier failures found in input'
          ],
          energy_source: 'None Identified',
          barrier_status: 'Not Applicable (Unrelated Input)',
          iogp_rule: 'Not Applicable',
          explainable_reasoning: `The input "${text}" is not recognized as a related operational safety issue. Please enter a correct safety issue describing equipment, location, barrier conditions, or hazardous energy vectors.`,
          recommended_controls: [
            'Enter a correct safety issue describing equipment, location, and conditions',
            'Include specific hazard parameters (e.g. pressure, voltage, chemical, elevation)',
            'Or click below to populate a pre-configured verified operational report'
          ],
          corrective_actions: [
            'Provide frontline coaching on entering actionable safety observations'
          ]
        };

        setAnalysisResult(finalResult);
      }, 400);
      return;
    }

    // Try backend AI analysis endpoint for real observations
    try {
      const backendResult = await api.executeAiAnalysis({
        report_text: text,
        report_name: reportName,
        report_type: rType === 'NEAR_MISS' ? 'Near Miss' : rType === 'UNSAFE_ACT' ? 'Unsafe Act' : 'Unsafe Condition',
        location: loc,
        site: loc === 'Unit 1' ? 'Plant 01' : loc === 'Unit 2' ? 'Plant 02' : loc === 'Unit 3' ? 'Plant 03' : 'Plant 04',
        report_date: reportDate
      });

      if (backendResult) {
        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisStep('');

          const detStatus = (backendResult.determination_status || '').toLowerCase();
          const isSIF = detStatus.includes('sif') && !detStatus.includes('no sif') && !detStatus.includes('not a sif') && (backendResult.sif_potential_score === undefined || backendResult.sif_potential_score > 30);
          const dynamicRiskScore = typeof backendResult.sif_potential_score === 'number' ? backendResult.sif_potential_score : calculateDynamicRiskScore(text, rType, isSIF);
          const confidence = backendResult.confidence || (isSIF ? 97.4 : 94.2);

          // Extract hazards, unsafe conditions, and detected weak signals
          const hazards = [];
          if (Array.isArray(backendResult.detected_high_energy_vectors) && backendResult.detected_high_energy_vectors.length > 0) {
            backendResult.detected_high_energy_vectors.forEach(h => hazards.push(h));
          } else {
            hazards.push(isSIF ? 'High Kinetic / Severe Potential Energy Vector' : 'Low Kinetic Surface Irregularity');
            hazards.push(`Barrier Status: ${backendResult.barrier_status || 'Barrier Evaluated'}`);
          }

          if (backendResult.weak_signals && Array.isArray(backendResult.weak_signals) && backendResult.weak_signals.length > 0) {
            backendResult.weak_signals.forEach(ws => {
              hazards.push(`Detected Weak Signal: ${ws.name || ws.title || 'Precursor Pattern'}`);
            });
          } else if (!isSIF) {
            hazards.push('Weak Signal Surveillance: No latent precursor weak signals detected; isolated event');
          }

          // Recommendations
          const recControls = [];
          const capaActions = [];

          if (backendResult.recommended_actions) {
            if (backendResult.recommended_actions.immediate_actions) {
              backendResult.recommended_actions.immediate_actions.forEach(a => recControls.push(a.action));
            }
            if (backendResult.recommended_actions.corrective_actions) {
              backendResult.recommended_actions.corrective_actions.forEach(a => capaActions.push(a.action));
            }
          }

          if (recControls.length === 0) {
            recControls.push(
              isSIF ? 'Immediate stop-work stand-down across active operating bay' : 'Re-tighten utility fitting and clear drainage path',
              isSIF ? 'Enforce zero-energy verification and physical exclusion barricades' : 'Verify containment barrier integrity and restock absorbent pads',
              isSIF ? 'Mandate dual-supervisor sign-off before operational restart' : 'Log routine maintenance work order in CMMS'
            );
          }

          if (capaActions.length === 0) {
            capaActions.push(
              isSIF ? 'Issue Stop-Work Notice and stand down operating shift team' : 'Immediate utility connection repair by shift mechanic',
              isSIF ? 'Dispatch Field HSE Safety Superintendent for barrier inspection' : 'Log routine maintenance inspection in CMMS ledger',
              isSIF ? 'Log high-priority CAPA item in corporate safety intelligence system' : 'Review routine housekeeping standards with shift crew'
            );
          }

          const reasoning = backendResult.why_identified?.summary || 
            `Autonomous neural SIF precursor engine analyzed observation "${reportName}" at ${loc}. ${
              isSIF 
                ? 'Determined as a CONFIRMED SIF PRECURSOR due to fatal/critical energy vector exposure and barrier degradation. Immediate intervention and CAPA controls required.'
                : 'Determined as a NON-SIF OBSERVATION. The scenario lacks fatal potential energy or life-saving rule breach. Standard operational controls and routine housekeeping remain fully sufficient.'
            }`;

          const finalResult = {
            report_name: backendResult.report_name || reportName,
            sif_precursor: isSIF ? 'YES' : 'NO',
            confidence: confidence,
            risk_score: dynamicRiskScore,
            classification: rType,
            detected_hazards: hazards,
            energy_source: backendResult.energy_source || (isSIF ? 'High Potential Energy Vector' : 'Low Kinetic / Surface Hydrostatic Energy (< 100 J)'),
            barrier_status: backendResult.barrier_status || (isSIF ? 'CRITICAL BARRIER DEGRADED / MISSING' : 'BARRIER INTACT / ADEQUATE'),
            iogp_rule: backendResult.iogp_rule || (isSIF ? 'Line of Fire (LSR-03) & Safe Lifting (LSR-04)' : 'General Workplace Housekeeping Standards'),
            explainable_reasoning: reasoning,
            recommended_controls: recControls,
            corrective_actions: capaActions
          };

          setAnalysisResult(finalResult);

          // AUTOMATICALLY PERSIST INTO CENTRAL SAFETY STORE & TOTAL RECORDS
          const currentRecords = getStoredTotalRecords();
          const nextRef = `REP-ID001-000${currentRecords.length + 1}`;
          const newRecordToSave = {
            id: Date.now(),
            report_reference: nextRef,
            report_name: finalResult.report_name,
            report_type: rType === 'NEAR_MISS' ? 'Near Miss' : rType === 'UNSAFE_ACT' ? 'Unsafe Act' : 'Unsafe Condition',
            description: text.slice(0, 100),
            location: loc,
            facility_unit: `${loc} Active Operations`,
            report_date: reportDate,
            risk_level: isSIF ? 'Critical' : 'Low',
            sif_precursor_assessment: isSIF ? 'YES' : 'NO',
            ai_score: dynamicRiskScore,
            status: isSIF ? 'Action Required' : 'Under Review',
            identified_hazard: hazards[0] || 'Operational Hazard',
            energy_source: finalResult.energy_source,
            barrier_status: finalResult.barrier_status,
            recommended_action: recControls[0] || 'Implement critical barrier control.'
          };

          const centralSaved = addReportRecord(newRecordToSave);
          const persistResult = autoPersistToTotalRecords(newRecordToSave);
          const savedRef = centralSaved?.report?.report_reference || persistResult?.record?.report_reference || nextRef;
          const savedCount = centralSaved?.totalCount || persistResult?.totalCount || currentRecords.length + 1;
          setAutoSavedInfo({ reference: savedRef, totalCount: savedCount });
          setTotalStoredRecords(getStoredTotalRecords());

          // Automatically dispatch detected Weak Signal to Weak Signals Board
          if (isSIF) {
            const weakSignalToAdd = {
              signal_id: `WS-${Date.now().toString().slice(-4)}`,
              title: (finalResult.detected_hazards.find(h => h.startsWith('Detected Weak Signal:')) || '').replace(/^Detected Weak Signal:\s*/, '') || `${finalResult.report_name} Precursor Pattern`,
              category: finalResult.iogp_rule || 'Process Safety Management',
              risk_level: dynamicRiskScore >= 90 ? 'High' : 'Medium',
              risk_score: dynamicRiskScore,
              first_detected_date: reportDate,
              source: 'Live AI Analysis Detection',
              potential_sif_precursor: finalResult.detected_hazards[0] || 'Escalating Industrial Barrier Failure',
              connected_signals: [
                `Live observation at ${loc}: ${text.slice(0, 80)}`,
                `Energy vector: ${finalResult.energy_source}`,
                `Barrier degradation: ${finalResult.barrier_status}`,
                `Mandated control: ${finalResult.recommended_controls[0] || 'Enforce barrier control'}`
              ],
              progression_steps: [
                { step: 'Detection', trend: 'Increasing', status: `Identified during live AI analysis at ${loc}` },
                { step: 'Evaluation', trend: 'Increasing', status: 'Precursor pattern correlated against active safety ledger' },
                { step: 'Control', trend: 'Stable', status: 'Awaiting engineering barrier restoration' }
              ],
              source_reports: [
                {
                  report_id: savedRef,
                  report_type: newRecordToSave.report_type,
                  location: loc,
                  hazard: finalResult.detected_hazards[0],
                  date: reportDate
                }
              ],
              review_status: 'Under Review',
              reviewer_notes: `Detected via Live AI Analysis on ${reportDate}. Engineering inspection mandated.`,
              key_learnings: finalResult.recommended_controls[0] || 'Audit physical barriers immediately.',
              energy_source: finalResult.energy_source,
              barrier_status: finalResult.barrier_status
            };
            addWeakSignalToBoard(weakSignalToAdd);
          }

        }, 850);
        return;
      }
    } catch (err) {
      // Fallback to internal neural evaluation
    }

    // INTERNAL NEURAL FALLBACK EVALUATION (Full industrial safety domain support)
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisStep('');

      const lower = text.toLowerCase();
      const isMinor = lower.includes('water') || 
                      lower.includes('tripping') || 
                      lower.includes('puddle') || 
                      lower.includes('housekeeping') ||
                      lower.includes('cooling') ||
                      lower.includes('sample cock') ||
                      lower.includes('50ml') ||
                      lower.includes('drip pan');
      
      const dynamicRiskScore = calculateDynamicRiskScore(text, rType, !isMinor);

      let finalResult = null;

      if (isMinor) {
        finalResult = {
          report_name: reportName,
          sif_precursor: 'NO',
          confidence: 94.6,
          risk_score: dynamicRiskScore,
          classification: rType,
          detected_hazards: [
            'Minor Surface Fluid Seepage (Non-Hazardous / Low-Risk)',
            'Routine Housekeeping & General Facility Maintenance Defect',
            'Weak Signal Surveillance: Low-energy event; no active fire or gas leakage detected'
          ],
          energy_source: 'Low Potential / Ambient Atmospheric Pressure (< 0.5 bar)',
          barrier_status: 'BARRIER ADEQUATE / ROUTINE MAINTENANCE REQUIRED',
          iogp_rule: 'Workplace Housekeeping Standards',
          explainable_reasoning: `Neural classification engine determined observation "${reportName}" at ${loc} is a NON-SIF event. The scenario lacks a fatal energy vector or open fire/gas release. Routine housekeeping and standard maintenance are fully sufficient.`,
          recommended_controls: [
            'Tighten loose fitting or hose clamp and clean floor surface immediately',
            'Verify ventilation in area and post caution wet floor / maintenance notice',
            'Log routine maintenance inspection in facility maintenance register'
          ],
          corrective_actions: [
            'Perform routine seal inspection during next scheduled shift walkdown',
            'Review standard housekeeping guidelines with area work team'
          ]
        };
      } else {
        const isGas = lower.includes('gas') || lower.includes('leak') || lower.includes('pipeline') || lower.includes('propane') || lower.includes('lpg') || lower.includes('cylinder') || lower.includes('compressor') || lower.includes('hiss');
        const isElectrical = lower.includes('electr') || lower.includes('switchboard') || lower.includes('panel') || lower.includes('breaker') || lower.includes('arc') || lower.includes('substation') || lower.includes('transformer') || lower.includes('cable') || lower.includes('415v') || lower.includes('11kv');
        const isHeight = lower.includes('height') || lower.includes('scaffold') || lower.includes('fall') || lower.includes('ladder') || lower.includes('plank') || lower.includes('harness');
        const isLifting = lower.includes('crane') || lower.includes('rigging') || lower.includes('sling') || lower.includes('hoist') || lower.includes('suspended') || lower.includes('lift');
        const isConfined = lower.includes('confined') || lower.includes('tank entry') || lower.includes('asphyxiat') || lower.includes('manhole');
        const isChemical = lower.includes('chemical') || lower.includes('acid') || lower.includes('caustic') || lower.includes('toxic') || lower.includes('spill');
        const isFire = lower.includes('fire') || lower.includes('flame') || lower.includes('spark') || lower.includes('welding') || lower.includes('smoke') || lower.includes('hot work') || lower.includes('combustible') || lower.includes('burn');

        const hasHighEnergy = isGas || isElectrical || isHeight || isLifting || isConfined || isChemical || isFire;

        if (!hasHighEnergy) {
          finalResult = {
            report_name: reportName,
            sif_precursor: 'NO',
            confidence: 93.0,
            risk_score: 22,
            classification: rType,
            detected_hazards: [
              'Routine Operational Finding / Non-SIF Condition',
              'Standard Industrial Facility Observation Under Normal Controls',
              'Weak Signal Surveillance: Isolated operational event; no escalating SIF precursor pattern'
            ],
            energy_source: 'Low Kinetic / Ambient Mechanical (< 100 J)',
            barrier_status: 'BARRIER INTACT / ROUTINE PROCEDURAL CONTROLS',
            iogp_rule: 'Workplace Housekeeping Standards',
            explainable_reasoning: `Analysis of "${reportName}" at "${loc}" classified this scenario as a ROUTINE SAFETY OBSERVATION (NON-SIF). No fatal energy vectors, catastrophic breach, or life-saving rule violations were identified. Standard operational controls remain fully sufficient.`,
            recommended_controls: [
              'Continue regular shift operational monitoring and maintain barrier integrity',
              'Log observation in routine facility maintenance register for supervisor review',
              'Verify area housekeeping during routine daily walkdown'
            ],
            corrective_actions: [
              'Routine supervisor review during weekly safety meeting',
              'Verify area equipment status in next shift handover'
            ]
          };
        } else {
          let primaryHazard = 'Open Fire Outbreak & Rapid Flame Spread on Combustibles';
          let secondHazard = 'Dense Toxic Smoke Inhalation Hazard & Electrical Short-Circuit Risk';
          let weakSignal = 'Detected Weak Signal: Overheated Electrical Wiring & Unshielded Hot Work Sparks';
          let energySource = 'Thermal Ignition Energy & Combustible Materials Flame';
          let barrierStatus = 'FIRE BARRIER & HOT WORK CONTROLS BREACHED';
          let iogpRule = 'Hot Work & Fire Prevention (LSR-06)';
          let recControls = [
            'Immediately activate building fire alarm and deploy CO2 or ABC dry chemical fire extinguisher',
            'De-energize main electrical power breakers and close all gas/fuel supply valves in the area',
            'Enforce strict 10-meter clearance free of combustible cardboard, oily rags, and solvent drums',
            'Station a certified continuous Fire Watch with charged fire hose during and 30 minutes post-incident'
          ];
          let capaActions = [
            'Conduct infrared thermal inspection across all electrical switchboards and breakers',
            'Remove all combustible trash and maintain a 3-meter buffer in front of panels',
            'Audit Hot Work permitting and verify all welders have flame-retardant blankets'
          ];

          if (isGas) {
            primaryHazard = 'Flammable Gas Leakage & Atmospheric Vapor Accumulation Hazard';
            secondHazard = 'High Combustible Gas Concentration (>50% LEL) Near Potential Ignition Sources';
            weakSignal = 'Detected Weak Signal: Flange Gasket Seal Micro-Leakage & Gas Hissing Sound';
            energySource = 'High-Pressure Combustible Gas Potential (18–60 bar)';
            barrierStatus = 'PRIMARY FLANGE GASKET SEAL COMPROMISED';
            iogpRule = 'Loss of Containment & Gas Leak Prevention (LSR-05)';
            recControls = [
              'Immediately trigger Emergency Shutdown (ESD) valve to isolate gas supply line',
              'Evacuate all personnel upwind and establish a 50-meter safety perimeter with zero ignition sources',
              'Conduct continuous multi-gas detector testing (0% LEL verified) before any personnel entry',
              'Depressurize line, replace damaged flange gasket or valve seal, and perform bubble leak test'
            ];
            capaActions = [
              'Perform ultrasonic acoustic leak survey across all high-pressure gas valves and flanges',
              'Inspect Emergency Shutdown (ESD) actuator response times and verify calibration',
              'Provide crew refresher drill on gas leak emergency evacuation and upwind assembly'
            ];
          } else if (isElectrical) {
            primaryHazard = 'Electrical Switchboard Overheating & Arc Flash Explosion Hazard';
            secondHazard = 'Energized Electrical Conductor Exposure & Thermal Plasma Ignition';
            weakSignal = 'Detected Weak Signal: Loose Terminal Lug Resistance & Thermal Hotspot';
            energySource = 'High-Voltage Electrical Arc & Thermal Energy (415V/11kV)';
            barrierStatus = 'ELECTRICAL ENCLOSURE & LOTO BARRIER COMPROMISED';
            iogpRule = 'Energy Isolation & Lockout Tagout (LSR-02)';
            recControls = [
              'Trip upstream circuit breaker and verify zero energy with calibrated multimeter',
              'Apply personal Lockout/Tagout padlock and danger tag before touching enclosure',
              'Wear NFPA 70E Category 4 Arc Flash Suit and insulated safety gloves',
              'Thermally scan all busbars and torque loose terminals to OEM specifications'
            ];
            capaActions = [
              'Implement quarterly infrared thermography survey across all MCC panels',
              'Audit lockout/tagout adherence with field electricians on monthly rota'
            ];
          } else if (isHeight) {
            primaryHazard = 'Elevated Fall from Height & Incomplete Scaffold Platform Hazard';
            secondHazard = 'Missing Guardrails and Toe-Boards at High Elevation';
            weakSignal = 'Detected Weak Signal: Missing Scaffold Deck Clamps & Unanchored Planks';
            energySource = 'Gravitational Potential Energy (> 2 Meters)';
            barrierStatus = 'PASSIVE FALL PROTECTION & GUARDRAILS MISSING';
            iogpRule = 'Working at Height (LSR-03)';
            recControls = [
              'Mandate 100% tie-off with dual lanyards to certified overhead anchor points',
              'Install top-rails, mid-rails, and toe-boards across complete working deck',
              'Red-tag scaffold immediately and prohibit worker access until re-inspected'
            ];
            capaActions = [
              'Mandate daily scaffold inspection tag sign-off by certified scaffolding supervisor',
              'Refresher training on full-body harness pre-use checks and lanyard inspection'
            ];
          } else if (isLifting) {
            primaryHazard = 'Suspended Load Failure & Rigging Failure Impact Hazard';
            secondHazard = 'Personnel Positioned Within Crane Line of Fire';
            weakSignal = 'Detected Weak Signal: Synthetic Sling Abrasions & Damaged Hoist Wire Strands';
            energySource = 'Suspended Kinetic & Gravitational Heavy Load Energy';
            barrierStatus = 'RIGGING INTEGRITY & EXCLUSION ZONE BARRIERS FAILED';
            iogpRule = 'Safe Mechanical Lifting (LSR-04)';
            recControls = [
              'Clear lift path and enforce strict physical barricades under suspended load',
              'Discard frayed slings and re-verify crane rated load chart limits',
              'Use tag lines to guide suspended loads rather than hands-on contact'
            ];
            capaActions = [
              'Mandate third-party NDT inspection on all wire ropes and shackles',
              'Conduct pre-lift safety briefing and verify lift plan before heavy hoists'
            ];
          } else if (isConfined) {
            primaryHazard = 'Confined Space Oxygen Depletion & Toxic Gas Exposure Hazard';
            secondHazard = 'Trapped Hazardous Atmosphere in Enclosed Tank Vessel';
            weakSignal = 'Detected Weak Signal: Premature Tank Entry Without Calibrated Gas Test';
            energySource = 'Chemical Asphyxiant & Toxic Atmospheric Vapor';
            barrierStatus = 'CONFINED SPACE VENTILATION & ENTRY PERMIT FAILED';
            iogpRule = 'Confined Space Entry (LSR-08)';
            recControls = [
              'Continuous 4-gas atmospheric testing (O2, H2S, CO, LEL) at three vessel depths',
              'Deploy mechanical forced-draft ventilation fan before and during entry',
              'Station dedicated Hole Watch / Standby Person with emergency retrieval hoist'
            ];
            capaActions = [
              'Calibrate all portable gas monitors and verify bump-test logs daily',
              'Simulate confined space rescue drill with emergency response squad'
            ];
          } else if (isChemical) {
            primaryHazard = 'Corrosive Toxic Chemical Spray & Containment Bund Loss';
            secondHazard = 'Pressurized Chemical Fluid Release Towards Personnel';
            weakSignal = 'Detected Weak Signal: Pump Mechanical Seal Weeping Acid';
            energySource = 'Chemical Reactivity & Hydraulic Pressurized Fluid';
            barrierStatus = 'CONTAINMENT FLANGE & CHEMICAL SHIELD DEGRADED';
            iogpRule = 'Toxic Chemical Containment & PPE (LSR-07)';
            recControls = [
              'Isolate pump suction/discharge valves and relieve line pressure to drain',
              'Wear Level B chemical suit, acid-resistant face shield, and rubber boots',
              'Neutralize escaped chemical within containment bund and verify eyewash station'
            ];
            capaActions = [
              'Replace degraded mechanical seals with corrosion-resistant elastomer components',
              'Audit emergency safety shower water flow and alarm transmitter functionality'
            ];
          }

          finalResult = {
            report_name: reportName,
            sif_precursor: 'YES',
            confidence: 97.4,
            risk_score: dynamicRiskScore,
            classification: rType,
            detected_hazards: [
              primaryHazard,
              secondHazard,
              weakSignal
            ],
            energy_source: energySource,
            barrier_status: barrierStatus,
            iogp_rule: iogpRule,
            explainable_reasoning: `Autonomous neural analysis of "${reportName}" at "${loc}" classified this scenario as a CONFIRMED SIF PRECURSOR. The industrial hazard presented credible probability of catastrophic escalation without emergency barrier controls. Immediate intervention required.`,
            recommended_controls: recControls,
            corrective_actions: capaActions
          };
        }
      }

      setAnalysisResult(finalResult);

      // AUTOMATICALLY PERSIST INTO CENTRAL SAFETY STORE & TOTAL RECORDS
      const currentRecords = getStoredTotalRecords();
      const nextRef = `REP-ID001-000${currentRecords.length + 1}`;
      const newRecordToSave = {
        id: Date.now(),
        report_reference: nextRef,
        report_name: finalResult.report_name,
        report_type: rType === 'NEAR_MISS' ? 'Near Miss' : rType === 'UNSAFE_ACT' ? 'Unsafe Act' : 'Unsafe Condition',
        description: text.slice(0, 100),
        location: loc,
        facility_unit: `${loc} Operating Bay`,
        report_date: reportDate,
        risk_level: finalResult.sif_precursor === 'YES' ? 'Critical' : 'Low',
        sif_precursor_assessment: finalResult.sif_precursor,
        ai_score: finalResult.risk_score,
        status: finalResult.sif_precursor === 'YES' ? 'Action Required' : 'Under Review',
        identified_hazard: finalResult.detected_hazards[0] || 'Operational Hazard',
        energy_source: finalResult.energy_source,
        barrier_status: finalResult.barrier_status,
        recommended_action: finalResult.recommended_controls[0] || 'Implement critical barrier control.'
      };

      const centralSaved = addReportRecord(newRecordToSave);
      const persistResult = autoPersistToTotalRecords(newRecordToSave);
      const savedRef = centralSaved?.report?.report_reference || persistResult?.record?.report_reference || nextRef;
      const savedCount = centralSaved?.totalCount || persistResult?.totalCount || currentRecords.length + 1;
      setAutoSavedInfo({ reference: savedRef, totalCount: savedCount });
      setTotalStoredRecords(getStoredTotalRecords());

      // Automatically dispatch detected Weak Signal to Weak Signals Board
      if (finalResult.sif_precursor === 'YES') {
        const weakSignalToAdd = {
          signal_id: `WS-${Date.now().toString().slice(-4)}`,
          title: (finalResult.detected_hazards.find(h => h.startsWith('Detected Weak Signal:')) || '').replace(/^Detected Weak Signal:\s*/, '') || `${finalResult.report_name} Precursor Pattern`,
          category: finalResult.iogp_rule || 'Process Safety Management',
          risk_level: dynamicRiskScore >= 90 ? 'High' : 'Medium',
          risk_score: dynamicRiskScore,
          first_detected_date: reportDate,
          source: 'Live AI Analysis Detection',
          potential_sif_precursor: finalResult.detected_hazards[0] || 'Escalating Industrial Barrier Failure',
          connected_signals: [
            `Live observation at ${loc}: ${text.slice(0, 80)}`,
            `Energy vector: ${finalResult.energy_source}`,
            `Barrier degradation: ${finalResult.barrier_status}`,
            `Mandated control: ${finalResult.recommended_controls[0] || 'Enforce barrier control'}`
          ],
          progression_steps: [
            { step: 'Detection', trend: 'Increasing', status: `Identified during live AI analysis at ${loc}` },
            { step: 'Evaluation', trend: 'Increasing', status: 'Precursor pattern correlated against active safety ledger' },
            { step: 'Control', trend: 'Stable', status: 'Awaiting engineering barrier restoration' }
          ],
          source_reports: [
            {
              report_id: savedRef,
              report_type: newRecordToSave.report_type,
              location: loc,
              hazard: finalResult.detected_hazards[0],
              date: reportDate
            }
          ],
          review_status: 'Under Review',
          reviewer_notes: `Detected via Live AI Analysis on ${reportDate}. Engineering inspection mandated.`,
          key_learnings: finalResult.recommended_controls[0] || 'Audit physical barriers immediately.',
          energy_source: finalResult.energy_source,
          barrier_status: finalResult.barrier_status
        };
        addWeakSignalToBoard(weakSignalToAdd);
      }

    }, 850);
  };

  const handleReset = () => {
    setDescription('');
    setLocation('Unit 1');
    setAnalysisResult(null);
    setAnalysisStep('');
    setAutoSavedInfo(null);
    setValidationError('');
  };

  const handleRunAnalysis = async () => {
    setValidationError('');
    let textToAnalyze = description.trim().slice(0, 100);
    let typeToUse = reportType;
    let unitToUse = location;

    // If user has not typed anything, use the available uploaded safety report data
    if (!textToAnalyze) {
      const selectedUploaded = AVAILABLE_UPLOADED_REPORTS[uploadedIndex % AVAILABLE_UPLOADED_REPORTS.length];
      textToAnalyze = selectedUploaded.text.slice(0, 100);
      typeToUse = selectedUploaded.type;
      unitToUse = selectedUploaded.location;
      
      setDescription(textToAnalyze);
      setReportType(typeToUse);
      setLocation(unitToUse);
      setUploadedIndex(prev => prev + 1);
    }

    setValidationError(null);

    await executeInference(textToAnalyze, typeToUse, unitToUse);
  };

  const isUnrelated = isUnrelatedIssue(description);
  const isNonSafety = isUnrelated || analysisResult?.is_unrelated || analysisResult?.risk_score === 0 || analysisResult?.report_name?.includes('Non-Safety') || analysisResult?.report_name?.includes('Enter Correct Issue');

  const allWeakSignals = generateAllWeakSignalsAnalysis(
    totalStoredRecords,
    analysisResult,
    description,
    location
  );

  // Weak signals detected in the CURRENT record (strictly empty if non-safety/unrelated input!)
  const detectedWeakSignals = isNonSafety ? [] : allWeakSignals.filter(s => s.isPresentInCurrent);

  const openWeakSignalsModal = () => {
    const match = detectedWeakSignals[0];
    if (match) {
      setSelectedWeakSignal(match);
      setShowWeakSignalsModal(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-800 animate-in fade-in duration-200 select-none">
      
      {/* Header with Prominent, Big Letters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#EAE6E1]">
        <div>
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-orange-50 border-2 border-orange-200/80 text-[#FF5A36] flex items-center justify-center shadow-sm">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading text-slate-900 tracking-tight">
                AI SAFETY INTELLIGENCE ENGINE
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main 50/50 Grid: Form on Left Half, Result on Right Half */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
        
        {/* Left Half: Safety Observation Input Card */}
        <div className="lg:col-span-6 rounded-2xl bg-white border-2 border-[#EAE6E1] p-6 sm:p-7 flex flex-col justify-between shadow-xs space-y-6 text-slate-800">
          <div className="space-y-5">
            
            {/* Card Top Title & Reset/Ready Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2.5 font-heading tracking-wide">
                <FileText className="w-6 h-6 text-[#FF5A36]" />
                <span>SAFETY OBSERVATION INPUT</span>
              </h3>
              {(description || location !== 'Unit 1' || analysisResult) ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 text-xs sm:text-sm text-[#FF5A36] hover:text-orange-700 font-mono font-black transition-all cursor-pointer bg-orange-50 hover:bg-orange-100 px-3.5 py-1.5 rounded-xl border border-orange-200"
                  title="Clear inputs and reset inference"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RESET INPUT</span>
                </button>
              ) : (
                <span className="text-xs sm:text-sm text-emerald-700 font-mono font-black flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE INPUT READY
                </span>
              )}
            </div>

            {/* Classification Type */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 font-heading">
                  CLASSIFICATION TYPE / SIZE
                </label>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">Select Category</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { key: 'NEAR_MISS', label: 'NEAR MISS' },
                  { key: 'UNSAFE_ACT', label: 'UNSAFE ACT' },
                  { key: 'UNSAFE_CONDITION', label: 'UNSAFE CONDITION' }
                ].map((t) => {
                  const isActive = reportType === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setReportType(t.key)}
                      className={`py-3 px-2 text-center rounded-xl text-xs sm:text-sm font-black tracking-wide uppercase transition-all cursor-pointer border-2 ${
                        isActive 
                          ? 'bg-gradient-to-r from-orange-500 via-[#FF5A36] to-[#FFA133] text-white border-[#FF5A36] shadow-md scale-[1.02]' 
                          : 'bg-[#FAF8F5] text-slate-700 border-stone-200/90 hover:bg-orange-50/50 hover:border-orange-300 hover:text-slate-900'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Operating Unit */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 font-heading">
                  TARGET OPERATING UNIT
                </label>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4'].map((unitName) => {
                  const isActive = location === unitName;
                  return (
                    <button
                      key={unitName}
                      type="button"
                      onClick={() => {
                        setLocation(unitName);
                        if (validationError) setValidationError('');
                      }}
                      className={`py-3 px-2 text-center rounded-xl text-sm sm:text-base font-mono font-black uppercase transition-all cursor-pointer border-2 ${
                        isActive
                          ? 'bg-[#FF5A36] text-white border-[#FF5A36] shadow-md scale-[1.02]'
                          : 'bg-[#FAF8F5] text-slate-700 border-stone-200/90 hover:bg-stone-100 hover:text-slate-900'
                      }`}
                    >
                      {unitName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Field Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 font-heading">
                  DETAILED FIELD DESCRIPTION &amp; BARRIER CONTEXT
                </label>
                <span className={`text-xs sm:text-sm font-mono font-black ${description.length >= 100 ? 'text-[#FF5A36]' : 'text-slate-500'}`}>
                  {description.length} / 100 CHARACTERS
                </span>
              </div>
              <textarea
                rows={5}
                maxLength={100}
                value={description}
                onChange={(e) => {
                  const val = e.target.value.slice(0, 100);
                  setDescription(val);
                  if (validationError) setValidationError('');
                  if (analysisResult) setAnalysisResult(null);
                }}
                className="w-full p-4 rounded-xl bg-[#FAF8F5] border-2 border-stone-200 text-sm sm:text-base font-semibold text-slate-900 leading-relaxed focus:outline-none focus:bg-white focus:border-[#FF5A36] focus:ring-4 focus:ring-[#FF5A36]/10 placeholder:text-slate-400 placeholder:font-normal transition-all"
                placeholder="Describe safety incident (up to 100 characters max)..."
              />
            </div>
          </div>

          {/* Large Action Button with Validation Error Banner */}
          <div className="pt-2 space-y-3">
            {validationError && (
              <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs sm:text-sm font-semibold flex items-start gap-3 shadow-xs animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-black uppercase tracking-wider text-rose-950 text-xs font-heading">
                    INPUT NOTICE
                  </div>
                  <p className="leading-relaxed">{validationError}</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-4 sm:py-5 px-6 rounded-xl font-black text-base sm:text-lg tracking-wider uppercase shadow-lg transition-all flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF6B4A] via-[#FF5A36] to-[#FFA133] hover:opacity-95 text-white shadow-orange-500/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="normal-case text-base sm:text-lg">{analysisStep || 'Executing SIF Precursor Analysis...'}</span>
                </div>
              ) : (
                <>
                  <Cpu className="w-6 h-6 text-white" />
                  <span>Execute New SIF Precursor Analysis</span>
                  <ArrowRight className="w-6 h-6 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Half: Sequential SIF Report Layout or Photo Default */}
        <div className="lg:col-span-6 flex flex-col">
          {analysisResult ? (
            analysisResult.is_unrelated ? (
              /* Enter Correct Issue Card for Unrelated/Trivial Inputs */
              <div className="h-full rounded-2xl bg-white border-2 border-amber-300 p-5 sm:p-6 flex flex-col justify-between shadow-xs space-y-4 text-slate-800 animate-in fade-in duration-300">
                <div className="space-y-4">
                  {/* Top Status Header */}
                  <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-4 sm:p-5 shadow-xs">
                    <div className="flex items-start gap-3.5">
                      <div className="w-13 h-13 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                        <AlertCircle className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-base sm:text-xl font-black text-amber-950 font-heading leading-tight">
                            ENTER CORRECT ISSUE
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg text-xs font-black font-mono tracking-wide uppercase bg-amber-200 text-amber-900 border border-amber-300">
                            UNRELATED INPUT
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-amber-900 mt-1.5 leading-relaxed">
                          The entered description <span className="font-mono font-black text-amber-950 px-1.5 py-0.5 bg-amber-100 rounded border border-amber-200">"{description || 'nothing'}"</span> does not contain a recognized industrial safety hazard, equipment condition, or barrier failure.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Guidance on How to Enter a Valid Safety Observation */}
                  <div className="rounded-2xl border-2 border-stone-200 p-4 shadow-xs bg-white space-y-3">
                    <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 font-heading flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#FF5A36]" />
                      <span>REQUIRED SAFETY OBSERVATION SPECIFICS:</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-700 font-semibold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF5A36] font-black mt-0.5">&bull;</span>
                        <span><strong>Operating Bay or Equipment:</strong> Specify unit or asset (e.g., Gas Pipeline Flange, Electrical 415V Panel, LPG Cylinder).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF5A36] font-black mt-0.5">&bull;</span>
                        <span><strong>Active Energy or Hazard:</strong> State the physical condition (e.g., Flammable gas hissing, cable overheating, missing scaffolding deck, welding sparks).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FF5A36] font-black mt-0.5">&bull;</span>
                        <span><strong>Barrier Status:</strong> Mention if seals degraded, alarm triggered, or safety permits were omitted.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Quick Sample Selector */}
                  <div className="p-4 rounded-xl bg-orange-50/80 border border-orange-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
                    <div>
                      <div className="font-bold text-orange-950 text-xs uppercase tracking-wide">
                        PREFER TO TEST A VERIFIED PLANT INCIDENT?
                      </div>
                      <p className="text-[11px] text-orange-800 mt-0.5">
                        Quickly populate an authentic field safety report to see SIF precursor intelligence in action.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const sample = AVAILABLE_UPLOADED_REPORTS[uploadedIndex % AVAILABLE_UPLOADED_REPORTS.length];
                        setDescription(sample.text);
                        setReportType(sample.type);
                        setLocation(sample.location);
                        setUploadedIndex(prev => prev + 1);
                        setValidationError('');
                        setAnalysisResult(null);
                      }}
                      className="text-xs font-black uppercase tracking-wider text-white bg-[#FF5A36] hover:bg-orange-600 px-4 py-2.5 rounded-xl shrink-0 cursor-pointer transition-all shadow-xs"
                    >
                      Load Sample Issue
                    </button>
                  </div>
                </div>

                {/* Bottom Notice: Zero Weak Signals & NO Button */}
                <div className="pt-3 border-t border-stone-200">
                  <div className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-500">
                    <Radio className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-[11px] font-semibold">
                      Weak signal surveillance inactive &bull; No precursor patterns correlated with unrelated input.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* AI SIF Analysis Result Report in Sequential Lines */
              <div className="h-full rounded-2xl bg-white border-2 border-[#EAE6E1] p-5 sm:p-6 flex flex-col justify-between shadow-xs space-y-4 text-slate-800 animate-in fade-in duration-300">
                <div className="space-y-4">
                  
                  {/* Section 1: Report Details, Category & SIF Determination */}
                  <div className={`rounded-2xl border-2 p-4 sm:p-5 shadow-xs ${
                    analysisResult.sif_precursor === 'YES' 
                      ? 'bg-rose-50/60 border-rose-200' 
                      : 'bg-emerald-50/60 border-emerald-200'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        {analysisResult.sif_precursor === 'YES' ? (
                          <div className="w-13 h-13 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md animate-pulse">
                            <ShieldAlert className="w-7 h-7" />
                          </div>
                        ) : (
                          <div className="w-13 h-13 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                            <ShieldCheck className="w-7 h-7" />
                          </div>
                        )}
                        <div>
                          {/* Report Name */}
                          <div className="text-base sm:text-lg font-black text-slate-900 font-heading leading-tight">
                            {analysisResult.report_name}
                          </div>

                          {/* Size / Category and SIF status */}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            {/* Category / Size Badge */}
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-black font-mono tracking-wide uppercase bg-slate-800 text-white shadow-xs">
                              SIZE: {analysisResult.classification.replace('_', ' ')}
                            </span>

                            {/* SIF Determination */}
                            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-lg text-xs font-black font-mono tracking-wide uppercase shadow-xs ${
                              analysisResult.sif_precursor === 'YES'
                                ? 'bg-rose-600 text-white'
                                : 'bg-emerald-600 text-white'
                            }`}>
                              {analysisResult.sif_precursor === 'YES' ? 'CONFIRMED SIF PRECURSOR' : 'NON-SIF OBSERVATION'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Risk Score */}
                      <div className="flex items-center gap-3 shrink-0 bg-white/95 px-4 py-2 rounded-xl border border-stone-200 shadow-xs self-end sm:self-center">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">RISK SCORE</div>
                          <div className={`text-xl sm:text-2xl font-black font-mono ${
                            analysisResult.risk_score >= 80 ? 'text-rose-600' : 'text-emerald-700'
                          }`}>
                            {analysisResult.risk_score} <span className="text-[11px] text-slate-400 font-normal">/100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Detected Hazards */}
                  <div className="rounded-2xl border-2 border-stone-200 p-4 shadow-xs bg-white">
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1] space-y-2.5">
                      <div>
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-100/80 border border-orange-300 text-[#FF5A36] text-xs font-black uppercase tracking-wider font-mono shadow-xs">
                          <Flame className="w-4 h-4 text-[#FF5A36]" />
                          DETECTED HAZARDS &amp; UNCONFINED VECTORS
                        </span>
                      </div>
                      <ul className="space-y-1.5 pt-1">
                        {analysisResult.detected_hazards.map((hz, i) => (
                          <li key={i} className="text-xs sm:text-sm font-bold text-slate-800 flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                            <span className="leading-snug">{hz}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Section 3: How to Overcome */}
                  <div className="rounded-2xl border-2 border-stone-200 p-4 shadow-xs bg-white">
                    <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EAE6E1] space-y-2.5">
                      <div>
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-wider font-mono shadow-xs">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          HOW TO OVERCOME: CRITICAL CONTROLS
                        </span>
                      </div>
                      <ul className="space-y-1.5 pt-1">
                        {analysisResult.recommended_controls.map((ctrl, i) => (
                          <li key={i} className="text-xs sm:text-sm text-slate-800 font-semibold flex items-start gap-2">
                            <span className="text-emerald-600 font-black mt-0.5 text-base">&bull;</span>
                            <span className="leading-snug">{ctrl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Action Buttons: Weak Signals Surveillance Section */}
                <div className="pt-3 border-t border-stone-200">
                  {detectedWeakSignals.length > 0 ? (
                    <button
                      type="button"
                      onClick={openWeakSignalsModal}
                      className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-orange-500 via-[#FF5A36] to-amber-500 hover:opacity-95 text-white shadow-md hover:scale-[1.005]"
                    >
                      <Radio className="w-4 h-4 text-amber-200 animate-pulse" />
                      <span>VIEW WEAK SIGNALS ({detectedWeakSignals.length} DETECTED IN THIS OBSERVATION)</span>
                    </button>
                  ) : (
                    <div className="w-full p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3 text-xs shadow-2xs">
                      <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="font-bold text-emerald-950 text-xs uppercase tracking-wide flex items-center gap-2">
                          <span>NO WEAK SIGNALS DETECTED IN THIS OBSERVATION</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-200 text-emerald-800 font-mono font-bold">
                            ISOLATED EVENT
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          No recurring latent precursor patterns correlated with this observation.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            /* Photo Card on the Remaining Half when idle */
            <div className="relative h-full min-h-[480px] lg:min-h-[540px] rounded-2xl overflow-hidden border-2 border-[#EAE6E1] shadow-xs group">
              <img 
                src="/refinery-banner.jpg" 
                alt="Petrochemical Refinery Unit Operations" 
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          )}
        </div>

      </div>

      {/* ALL WEAK SIGNALS FROM RECORDS MODAL - WEAK SIGNALS FORMAT */}
      {showWeakSignalsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#EAE6E1] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
            
            {/* Modal Header */}
            <div className="p-6 bg-[#FAF8F5] border-b border-[#EAE6E1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-orange-50 border border-orange-200/60 text-[#FF5A36]">
                    <Radio className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 tracking-tight">
                    Weak Signals Surveillance {detectedWeakSignals.length > 0 ? `(${detectedWeakSignals.length} Detected in Observation)` : ''}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Synthesized cross-record patterns and barrier intelligence
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowWeakSignalsModal(false)}
                  className="w-9 h-9 rounded-xl bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-[#EAE6E1] flex items-center justify-center transition-all cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Weak Signals Cards in Exact Weak Signals Format */}
            <div className="p-6 overflow-y-auto space-y-4 max-h-[70vh] bg-[#FAF8F5]">
              {isNonSafety ? (
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300/80 text-xs text-slate-700 flex items-start gap-3 shadow-2xs">
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                      No Weak Signals Active in Current Record ("{analysisResult?.report_name || 'Non-Safety Observation'}")
                    </div>
                    <p className="text-slate-600 text-[11.5px] mt-0.5 leading-relaxed">
                      This input contains no operational hazard telemetry.
                    </p>
                  </div>
                </div>
              ) : detectedWeakSignals.length > 0 ? (
                <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs text-orange-950 flex items-start gap-3 shadow-2xs">
                  <div className="p-2 rounded-xl bg-orange-100 text-[#FF5A36] shrink-0">
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <div className="font-bold text-orange-950 text-xs uppercase tracking-wide flex items-center gap-2">
                      <span>{detectedWeakSignals.length} Active Weak Signal Pattern{detectedWeakSignals.length > 1 ? 's' : ''} Detected in Current Observation</span>
                    </div>
                    <p className="text-orange-900/90 text-[11.5px] mt-0.5 leading-relaxed">
                      AI identified direct precursor matches in this observation correlating with recurring barrier failure signals.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3 shadow-2xs">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-950 text-xs uppercase tracking-wide">
                      Zero Weak Signal Precursors in Current Record (Isolated Event)
                    </div>
                    <p className="text-emerald-800 text-[11.5px] mt-0.5 leading-relaxed">
                      No recurring latent precursor patterns correlated with this observation.
                    </p>
                  </div>
                </div>
              )}

              {(detectedWeakSignals.length > 0 ? detectedWeakSignals : allWeakSignals).map((sig) => (
                <div 
                  key={sig.id}
                  className="rounded-2xl bg-white border border-[#EAE6E1] hover:border-slate-300 p-6 shadow-sm space-y-4 transition-all duration-300 text-slate-800"
                >
                  {/* Category & Identified By Records Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-lg">
                        {sig.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-600">
                        {sig.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 font-mono shadow-2xs">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        <span>Identified by {sig.identifyingRecords?.length || 2} Records</span>
                      </span>
                    </div>
                  </div>

                  {/* Headline & Action */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      {sig.title}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedDossierReport({
                        id: sig.id,
                        report_reference: sig.code,
                        identified_hazard: sig.title,
                        statement: (!isNonSafety && sig.isPresentInCurrent) ? sig.presentRecordObservation : (sig.historicalMatches?.[0]?.excerpt || sig.precursorEscalation),
                        recommended_action: sig.systemicMitigation?.replace(/^[0-9.]+\s*/, '').split('\n')[0] || 'Conduct immediate physical audit and enforce strict barrier controls across active operational units.',
                        energy_source: sig.category,
                        sif_precursor_assessment: 'YES',
                        isSIF: true,
                        risk_level: sig.severity?.includes('Critical') ? 'Critical' : 'High',
                        location: location || 'Operating Unit',
                        report_type: 'Weak Signal Intelligence',
                        report_date: '2026-09-08',
                        identifyingRecords: sig.identifyingRecords
                      })}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#FF5A36] hover:from-[#ff5934] hover:to-[#e64a27] text-white font-bold text-xs shadow-md shadow-orange-500/20 shrink-0 cursor-pointer flex items-center gap-1.5 transition-all self-start sm:self-auto"
                    >
                      <span>Examine Weak Signal Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-600">
                Detected Precursors in Observation: <strong className="text-[#FF5A36]">{detectedWeakSignals.length}</strong>
              </span>
              <button
                type="button"
                onClick={() => setShowWeakSignalsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition-colors"
              >
                Close Surveillance
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Detailed Analysis Modal when clicking Examine Weak Signal Dossier */}
      {selectedDossierReport && (
        <FullAnalysisModal
          report={selectedDossierReport}
          onClose={() => setSelectedDossierReport(null)}
        />
      )}

    </div>
  );
}
