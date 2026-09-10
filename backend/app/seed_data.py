from sqlalchemy.orm import Session
from .database import SessionLocal, Base, engine
from .models.organization import Organization
from .models.user import User
from .models.safety_report import SafetyReport
from .models.ai_analysis import AIAnalysis
from .models.feedback import Feedback
from .ai_services.ai_service import analyze_safety_report
from .routers.auth import ensure_initial_seed

SAMPLE_REPORTS_ID001 = [
    {
        "ref": "REP-ID001-0001",
        "report_type": "NEAR_MISS",
        "title": "Suspended Crane Load Dropped Object Near Workers",
        "description": "During crane hoisting operation at Rig 04 Derrick Floor, a 4-ton heavy steel drilling casing pipe slipped from a worn rigging synthetic sling at a height of 18 meters and fell 2 meters away from two roughnecks who were positioning the wellhead guide. No exclusion zone barricade or drop zone perimeter had been established.",
        "location": "Drilling Rig 04 – Derrick Floor Area",
        "report_date": "2026-09-02",
        "additional_context": "Wind speed 14 knots. Dropped object hazard with high kinetic/gravitational energy. Critical barrier failed: sling rigging integrity and perimeter drop-zone barrier absent.",
        "hazard": "Suspended Load & Dropped Object Hazard",
        "sif_assessment": "YES",
        "energy": "Gravity (18m elevation, 4,000kg load)",
        "exposure": "Two roughnecks in immediate drop trajectory (2m proximity)",
        "barrier": "CRITICAL BARRIER FAILED",
        "consequence": "FATALITY_OR_PERMANENT_DISABILITY",
        "explanation": "High gravitational energy with total barrier failure. A 4-ton casing slipped from height into an active worker area. Absence of exclusion barricades and defective rigging created a critical SIF precursor."
    },
    {
        "ref": "REP-ID001-0002",
        "report_type": "UNSAFE_ACT",
        "title": "11kV High-Voltage Electrical Entry Without LOTO",
        "description": "Maintenance technician observed entering high-voltage 11kV electrical substation switchgear room to perform circuit breaker inspection without conducting Lock-Out/Tag-Out (LOTO) energy isolation, without arc-flash PPE, and without verifying zero-energy state with a calibrated voltage detector.",
        "location": "Central Processing Facility – Main Substation A",
        "report_date": "2026-09-03",
        "additional_context": "Technician was attempting a rapid visual and mechanical check, but switchgear cabinet doors were open with live energized 11kV copper busbars exposed.",
        "hazard": "Electrical Arc Flash & High-Voltage Shock Hazard",
        "sif_assessment": "YES",
        "energy": "Electrical Energy (11kV live switchgear)",
        "exposure": "Unprotected technician within arc flash boundary (<0.5m)",
        "barrier": "BARRIER MISSING",
        "consequence": "FATALITY_OR_PERMANENT_DISABILITY",
        "explanation": "Exposure to 11,000V electrical arc flash with complete absence of procedural isolation (LOTO). Any inadvertent contact or tool slip would cause a fatal arc-blast explosion."
    },
    {
        "ref": "REP-ID001-0003",
        "report_type": "UNSAFE_CONDITION",
        "title": "High-Pressure Flange Blowout & Vapor Cloud Explosion",
        "description": "Severe hydrocarbon gas leakage and acute vibration detected on high-pressure 85-bar separator inlet flange (Joint B-12). Flange seal ring has suffered mechanical deformation and bolt loosening, creating an imminent catastrophic gas blowout and vapor cloud explosion (VCE) hazard.",
        "location": "Hydrocarbon Gas Processing Unit – Separator Manifold B",
        "report_date": "2026-09-04",
        "additional_context": "CRITICAL COMPOUND HAZARD: This high-severity SIF condition is directly triggered by the cumulative interaction of two previously logged weak signals: micro-vibrations (REP-ID001-0004) and ultrasonic gasket seepage (REP-ID001-0005). Combined mechanical stress caused sudden gasket rupture.",
        "hazard": "Catastrophic Flange Blowout & Vapor Cloud Explosion",
        "sif_assessment": "YES",
        "energy": "High Pressure Hydrocarbon Gas (85 bar operating pressure)",
        "exposure": "Process unit personnel within vapor cloud dispersion zone",
        "barrier": "CRITICAL BARRIER FAILED",
        "consequence": "FATALITY_OR_PERMANENT_DISABILITY",
        "explanation": "High-pressure pressurized hydrocarbon containment failure. Accelerated by the convergence of two interlinked weak signals (cyclic vibration and seal weeping), flange Joint B-12 reached critical failure state."
    },
    {
        "ref": "REP-ID001-0004",
        "report_type": "UNSAFE_CONDITION",
        "title": "Weak Signal 1: Piping Micro-Vibration on Joint B-12",
        "description": "Continuous high-frequency micro-vibrations and slight cyclic thermal pulsation noted on separator inlet pipe joint B-12 during routine operator walkdown. Gauge pressure is currently within normal operating envelope (80-85 bar).",
        "location": "Hydrocarbon Gas Processing Unit – Separator Manifold B (Joint B-12)",
        "report_date": "2026-09-01",
        "additional_context": "WEAK SIGNAL 1: Vibration amplitude was 2.4 mm/s RMS (below immediate shutdown trip threshold). Individually low risk, but flagged as an interlinked precursor: when coupled with seal weeping (REP-ID001-0005), it induces rapid bolt fatigue leading to High SIF blowout (REP-ID001-0003).",
        "hazard": "Piping Micro-Vibration & Cyclic Thermal Pulse (Weak Signal 1)",
        "sif_assessment": "NO",
        "energy": "Mechanical Vibration (Low kinetic energy)",
        "exposure": "No direct personnel exposure; localized pipe support area",
        "barrier": "BARRIER DEGRADED",
        "consequence": "MINOR_INJURY",
        "explanation": "Individually classified as Non-SIF due to low immediate energy release. However, AI cross-correlation identifies this as a critical weak signal that accelerates seal degradation when paired with acoustic weepage."
    },
    {
        "ref": "REP-ID001-0005",
        "report_type": "UNSAFE_CONDITION",
        "title": "Weak Signal 2: Ultrasonic Acoustic Seal Weepage on Joint B-12",
        "description": "Ultrasonic acoustic leak detector recorded intermittent 38 kHz acoustic emission and faint hydrocarbon residue weeping at spiral-wound gasket perimeter on separator inlet flange Joint B-12. No visible vapor cloud or atmospheric LEL detection registered on portable gas monitor.",
        "location": "Hydrocarbon Gas Processing Unit – Separator Manifold B (Joint B-12)",
        "report_date": "2026-09-02",
        "additional_context": "WEAK SIGNAL 2: Flange seal weepage is below 5% LEL. Interlinked with Weak Signal 1 (pipe vibration in REP-ID001-0004). The simultaneous presence of vibration and seal weeping accelerates gasket erosion, directly culminating in the SIF High blowout incident (REP-ID001-0003).",
        "hazard": "Ultrasonic Acoustic Seal Weepage (Weak Signal 2)",
        "sif_assessment": "NO",
        "energy": "Pressurized Hydrocarbon Fluid (Micro-leak)",
        "exposure": "No hazardous vapor accumulation detected (<5% LEL)",
        "barrier": "BARRIER DEGRADED",
        "consequence": "MINOR_INJURY",
        "explanation": "Individually assessed as a weak signal with no immediate atmospheric hazard. In correlation with micro-vibration from REP-ID001-0004, the two interlinked signals form a compound failure chain triggering High SIF precursor REP-ID001-0003."
    },
    {
        "ref": "REP-ID001-0006",
        "report_type": "UNSAFE_CONDITION",
        "title": "Routine Housekeeping Slip Hazard: AC Condensate Puddle",
        "description": "Minor water puddle (approx. 40cm diameter) observed on linoleum floor near the administrative building East Wing entrance due to an overhead air conditioning unit condensate drain tube drip. Floor was slightly slippery.",
        "location": "Administration Building – East Wing Hallway",
        "report_date": "2026-09-04",
        "additional_context": "Housekeeping custodian placed a yellow caution wet floor cone and mopped the area. AC maintenance ticket #1049 logged to clear condensate line. Zero hazardous energy; non-SIF routine housekeeping observation.",
        "hazard": "Routine Housekeeping Slip/Trip Hazard",
        "sif_assessment": "NO",
        "energy": "None (Low-level gravitational slip)",
        "exposure": "Office occupants walking through hallway",
        "barrier": "BARRIER ADEQUATE",
        "consequence": "FIRST_AID",
        "explanation": "Low hazard energy with no life-threatening or permanent disability potential. Standard housekeeping slip hazard correctly classified as Non-SIF."
    }
]

def seed_sample_data():
    db = SessionLocal()
    try:
        # 1. Create tables
        Base.metadata.create_all(bind=engine)
        
        # 2. Seed default 5 orgs and users so authentication is always available
        ensure_initial_seed(db)
        
        # Static reports are not auto-seeded, allowing fresh start from bulk upload starting from today.
    finally:
        db.close()
