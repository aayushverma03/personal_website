#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_FILE="${ROOT_DIR}/agents.md"

if [[ ! -f "${TARGET_FILE}" ]]; then
  echo "FAIL: ${TARGET_FILE} not found."
  exit 1
fi

failures=0

check_contains() {
  local label="$1"
  local pattern="$2"

  if ! rg -q --fixed-strings "${pattern}" "${TARGET_FILE}"; then
    echo "FAIL: Missing ${label} -> ${pattern}"
    failures=$((failures + 1))
  else
    echo "PASS: ${label}"
  fi
}

check_min_lines() {
  local min_lines="$1"
  local current_lines
  current_lines="$(wc -l < "${TARGET_FILE}")"

  if (( current_lines < min_lines )); then
    echo "FAIL: agents.md too short (${current_lines} lines, expected >= ${min_lines})"
    failures=$((failures + 1))
  else
    echo "PASS: line count (${current_lines})"
  fi
}

check_min_lines 300

check_contains "project identity" "## 1) Project Identity"
check_contains "goals completed" "## 2) Goals Completed"
check_contains "critical file map" "## 3) Current File Map (Critical)"
check_contains "pdf extraction details" "## 4) Data Sources Used and What Was Extracted"
check_contains "application architecture" "## 5) Application Architecture"
check_contains "digital twin behavior" "## 6) Digital Twin UI Behavior"
check_contains "branding updates" "## 7) Branding and Content Updates Applied"
check_contains "test history" "## 8) Build/Test Validation History"
check_contains "deployment runbook" "## 11) Deployment Runbook (EC2 + GoDaddy + HTTPS)"
check_contains "security notes" "## 13) Security Notes"
check_contains "recovery checklist" "## 15) Fast Recovery Checklist for Future Agents"
check_contains "hard constraints" "## 16) What Must Never Be Lost in Future Edits"

check_contains "model pin" "gpt-5.4-mini"
check_contains "digital twin endpoint" "POST /api/digital-twin"
check_contains "portfolio source" "extra_experience.pdf"
check_contains "profile source" "Profile.pdf"
check_contains "domain target" "ayush-verma.com"
check_contains "tutorial reference" "tutorial.md"

check_contains "chronological delivery log section" "## 17) Chronological Delivery Log"
check_contains "command reference section" "## 18) Command Reference (Validated Paths)"
check_contains "troubleshooting playbook section" "## 19) Troubleshooting Playbook"

if (( failures > 0 )); then
  echo
  echo "Context test result: FAIL (${failures} missing requirement(s))."
  exit 1
fi

echo
echo "Context test result: PASS (agents.md has required project context coverage)."
