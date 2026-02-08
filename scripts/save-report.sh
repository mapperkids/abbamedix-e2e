#!/bin/bash
# Save the Playwright HTML report with a timestamp folder name.
# Each test run gets its own folder so you keep full history.
#
# Usage: npm run report:save

set -e

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
REPORTS_DIR="./reports-history"
DEST="$REPORTS_DIR/$TIMESTAMP"

# Create the timestamped folder
mkdir -p "$DEST"

# Copy the full report (HTML + videos + traces)
cp -r ./playwright-report/* "$DEST/"

# Generate an index.html that lists all past runs
echo "<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"UTF-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
  <title>Abba Medix E2E Test Reports</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; background: #f5f5f5; }
    h1 { color: #333; border-bottom: 2px solid #2e7d32; padding-bottom: 10px; }
    .run { background: white; padding: 16px 20px; margin: 10px 0; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
    .run a { color: #2e7d32; text-decoration: none; font-weight: 600; font-size: 18px; }
    .run a:hover { text-decoration: underline; }
    .run .date { color: #666; font-size: 14px; }
    .badge { background: #2e7d32; color: white; padding: 4px 10px; border-radius: 4px; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Abba Medix - E2E Test Reports</h1>
  <p>Click any run to view the full report with videos.</p>" > "$REPORTS_DIR/index.html"

# List all runs newest first
for dir in $(ls -1dr "$REPORTS_DIR"/*/); do
  dirname=$(basename "$dir")
  # Format the timestamp nicely for display
  display_date=$(echo "$dirname" | sed 's/_/ /g' | sed 's/-/:/4' | sed 's/-/:/4')
  echo "  <div class=\"run\">
    <div>
      <a href=\"$dirname/index.html\">$display_date</a>
    </div>
    <span class=\"badge\">View Report</span>
  </div>" >> "$REPORTS_DIR/index.html"
done

echo "</body></html>" >> "$REPORTS_DIR/index.html"

echo ""
echo "Report saved to: $DEST"
echo "Reports index:   $REPORTS_DIR/index.html"
echo ""
echo "To view locally:  npx playwright show-report $DEST"
echo "To upload:        npm run report:upload"
