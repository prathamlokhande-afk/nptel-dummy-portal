#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SNAPSHOT_DIR="$ROOT_DIR/scripts/.clean-snapshots"

mkdir -p "$SNAPSHOT_DIR"

# Save initial clean snapshots if not already saved
if [ ! -f "$SNAPSHOT_DIR/courses.json" ]; then
  cp "$ROOT_DIR/backend/src/data/courses.json" "$SNAPSHOT_DIR/courses.json"
  cp "$ROOT_DIR/backend/src/services/gradingService.ts" "$SNAPSHOT_DIR/gradingService.ts"
  cp "$ROOT_DIR/frontend/src/components/CourseCatalog.tsx" "$SNAPSHOT_DIR/CourseCatalog.tsx"
fi

MODE="${1:---clean}"

if [ "$MODE" = "--clean" ]; then
  cp "$SNAPSHOT_DIR/courses.json" "$ROOT_DIR/backend/src/data/courses.json"
  cp "$SNAPSHOT_DIR/gradingService.ts" "$ROOT_DIR/backend/src/services/gradingService.ts"
  cp "$SNAPSHOT_DIR/CourseCatalog.tsx" "$ROOT_DIR/frontend/src/components/CourseCatalog.tsx"
  echo "✅ Restored NPTEL Portal to 100% clean, passing state (all features & tests active)."
elif [ "$MODE" = "--stage-hooks" ]; then
  cp "$SNAPSHOT_DIR/courses.json" "$ROOT_DIR/backend/src/data/courses.json"
  cp "$SNAPSHOT_DIR/gradingService.ts" "$ROOT_DIR/backend/src/services/gradingService.ts"
  cp "$SNAPSHOT_DIR/CourseCatalog.tsx" "$ROOT_DIR/frontend/src/components/CourseCatalog.tsx"

  # Stage Hook #3 in CourseCatalog.tsx: invert the AICTE FDP filter when search query is present
  node -e '
    const fs = require("fs");
    const file = process.argv[1];
    let content = fs.readFileSync(file, "utf8");
    content = content.replace(
      "const matchesAicte = !onlyAicteFdp || course.aicteFdpApproved;",
      "const matchesAicte = !onlyAicteFdp || (q.length > 0 ? !course.aicteFdpApproved : course.aicteFdpApproved); // DEMO BUG HOOK #3"
    );
    fs.writeFileSync(file, content);
  ' "$ROOT_DIR/frontend/src/components/CourseCatalog.tsx"

  echo "🎯 Staged Live Demo Hooks! Use 'npm run demo:clean' anytime to restore the full solution."
else
  echo "Usage: bash scripts/demo-reset.sh [--clean | --stage-hooks]"
  exit 1
fi
