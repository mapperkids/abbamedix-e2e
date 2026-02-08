#!/bin/bash
# Upload the reports-history folder to your company website.
# Edit the variables below to match your server.
#
# Usage: npm run report:upload

set -e

# ============================================================
# CONFIGURE THESE for your company server:
# ============================================================
REMOTE_USER="your-ssh-user"
REMOTE_HOST="yourcompany.com"
REMOTE_PATH="/var/www/html/e2e-reports"
# ============================================================

REPORTS_DIR="./reports-history"

if [ ! -d "$REPORTS_DIR" ]; then
  echo "No reports found. Run 'npm run report:save' first."
  exit 1
fi

echo "Uploading reports to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH ..."

rsync -avz --progress "$REPORTS_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

echo ""
echo "Done! Team can view reports at:"
echo "  https://$REMOTE_HOST/e2e-reports/"
echo ""
echo "  Index page:  https://$REMOTE_HOST/e2e-reports/index.html"
echo "  Latest run:  https://$REMOTE_HOST/e2e-reports/$(ls -1t $REPORTS_DIR | head -1)/index.html"
