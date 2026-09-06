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
        "report_type": "NEAR_MISS",
        "description": "During crane hoisting operation at Rig 04 Derrick Floor, a 4-inch heavy steel drilling flange slipped from the rigging sling at a height of 18 meters and fell 2 meters away from two roughnecks who were positioning the casing pipe. No exclusion zone barricade was established around the drop zone.",
        "location": "Drilling Rig 04 – Derrick Floor Area",
        "report_date": "2026-09-02",
        "additional_context": "Wind speeds were moderate (14 knots). Rigging gear was inspected post-incident and showed minor sling wear."
    },
    {
        "report_type": "UNSAFE_ACT",
        "description": "Maintenance technician observed entering high-voltage 11kV electrical substation switchgear room to perform circuit breaker inspection without conducting Lock-Out/Tag-Out (LOTO) energy isolation or verifying zero-energy state with a calibrated voltage detector.",
        "location": "Central Processing Facility – Main Substation A",
        "report_date": "2026-09-03",
        "additional_context": "Technician stated they were conducting a visual check only, but panel doors were opened with live busbars exposed."
    },
    {
        "report_type": "UNSAFE_CONDITION",
        "description": "Missing grating section (approx 1.5m x 0.8m) on high elevation walkway (Level 3 process platform) above hydrocarbon separation vessel. Open void was left completely unbarricaded and without caution signage.",
        "location": "Hydrocarbon Separation Unit – Level 3 Walkway",
        "report_date": "2026-09-04",
        "additional_context": "Grating was removed during nighttime pipe fitting overhaul and not reinstalled by the departing shift."
    },
    {
        "report_type": "UNSAFE_CONDITION",
        "description": "Minor water puddle observed near the administrative entrance hallway due to AC condensate drip. Floor was slightly slippery.",
        "location": "Administration Building – East Hallway",
        "report_date": "2026-09-04",
        "additional_context": "Housekeeping was notified to mop and place wet floor cone."
    }
]

def seed_sample_data():
    db = SessionLocal()
    try:
        # 1. Create tables
        Base.metadata.create_all(bind=engine)
        
        # 2. Seed default 5 orgs and users
        ensure_initial_seed(db)

        # 3. Check if reports already seeded for id001
        existing = db.query(SafetyReport).filter(SafetyReport.organization_id == "id001").count()
        if existing == 0:
            user = db.query(User).filter(User.organization_id == "id001").first()
            
            for idx, r_data in enumerate(SAMPLE_REPORTS_ID001, start=1):
                ref_id = f"REP-ID001-{idx:04d}"
                report = SafetyReport(
                    report_reference=ref_id,
                    organization_id="id001",
                    user_id=user.id if user else None,
                    report_type=r_data["report_type"],
                    description=r_data["description"],
                    location=r_data["location"],
                    report_date=r_data["report_date"],
                    additional_context=r_data["additional_context"],
                    analysis_status="COMPLETED"
                )
                db.add(report)
                db.commit()
                db.refresh(report)

                # Execute real AI analysis
                raw_analysis = analyze_safety_report(
                    report_type=report.report_type,
                    description=report.description,
                    additional_context=report.additional_context
                )

                analysis = AIAnalysis(
                    report_id=report.id,
                    organization_id="id001",
                    analysis_context=raw_analysis["analysis_context"],
                    identified_action=raw_analysis["identified_action"],
                    identified_condition=raw_analysis["identified_condition"],
                    identified_event=raw_analysis["identified_event"],
                    identified_hazard=raw_analysis["identified_hazard"],
                    safety_signals=raw_analysis["safety_signals"],
                    energy_source=raw_analysis["energy_source"],
                    exposure=raw_analysis["exposure"],
                    barrier_information=raw_analysis["barrier_information"],
                    potential_consequence=raw_analysis["potential_consequence"],
                    sif_precursor_assessment=raw_analysis["sif_precursor_assessment"],
                    explanation=raw_analysis["explanation"]
                )
                db.add(analysis)
                db.commit()

                # Add sample feedback to the first report only (leaving others pending for review)
                if idx == 1:
                    fb = Feedback(
                        report_id=report.id,
                        organization_id="id001",
                        user_id=user.id if user else None,
                        feedback_status="CORRECT",
                        feedback_text="Accurate SIF precursor assessment. Immediate exclusion barricades and revised rigging inspection instituted at Derrick floor."
                    )
                    db.add(fb)
                    db.commit()

    finally:
        db.close()
