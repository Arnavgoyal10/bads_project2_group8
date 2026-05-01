import argparse
import subprocess
import sys

def run_script(script_name):
    print(f"========================================")
    print(f"Running {script_name}...")
    print(f"========================================")
    result = subprocess.run([sys.executable, script_name])
    if result.returncode != 0:
        print(f"Error running {script_name}")
        sys.exit(result.returncode)

def main():
    parser = argparse.ArgumentParser(description="NovaMart Marketing Analytics Capstone Runner")
    parser.add_argument("--phase", type=int, choices=range(1, 8), help="Run a specific phase (1-7)")
    args = parser.parse_args()

    phases = {
        1: "01_data_audit.py",
        2: "02_descriptive_stats.py",
        3: "03_segmentation.py",
        4: "04_campaign_grouping.py",
        5: "05_lead_prediction.py",
        6: "06_retention_prediction.py",
        7: "07_executive_dashboard.py"
    }

    if args.phase:
        run_script(phases[args.phase])
    else:
        for phase in range(1, 8):
            run_script(phases[phase])

    print("All requested phases completed successfully.")

if __name__ == "__main__":
    main()
