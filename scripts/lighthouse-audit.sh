#!/bin/bash
echo "🔦 LIGHTHOUSE AUDIT"
URL="https://cacrs-frontend-e3cni43iqq-ew.a.run.app"
npx lighthouse "$URL" --output html --output-path ./lighthouse-reports/report.html --quiet
echo "✅ Rapport généré: lighthouse-reports/report.html"
