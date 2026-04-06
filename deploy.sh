#!/bin/bash
# ════════════════════════════════════════════════════════════════════════════
# GCP Cloud Run デプロイスクリプト
# ════════════════════════════════════════════════════════════════════════════
set -euo pipefail

# ── ✏️ 設定 ──────────────────────────────────────
PROJECT_ID="taskappv2-492314"
REGION="asia-northeast1"
SERVICE_NAME="mytask-app"

# Cloud SQL の接続名
CLOUD_SQL_CONNECTION="${PROJECT_ID}:${REGION}:taskapp-instance"
# ─────────────────────────────────────────────────────────────────────────────

# Artifact Registry のイメージパス
IMAGE="asia-northeast1-docker.pkg.dev/${PROJECT_ID}/mytask/${SERVICE_NAME}"

echo "════════════════════════════════════════════"
echo "  🚀 mytask-app GCP デプロイ開始"
echo "  Project : ${PROJECT_ID}"
echo "  Region  : ${REGION}"
echo "  Service : ${SERVICE_NAME}"
echo "════════════════════════════════════════════"

gcloud config set project "${PROJECT_ID}"

echo ""
echo "📦 [1/3] Artifact Registry の確認・作成..."
gcloud artifacts repositories describe mytask \
    --location="${REGION}" \
    --project="${PROJECT_ID}" 2>/dev/null \
  || gcloud artifacts repositories create mytask \
       --repository-format=docker \
       --location="${REGION}" \
       --description="mytask app images" \
       --project="${PROJECT_ID}"

gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

echo ""
# ── Step 2: Dockerfile.prod でビルドして Artifact Registry にプッシュ ────────
echo ""
echo "🔨 [2/3] Cloud Build でイメージをビルド・プッシュ中..."

# gcloudコマンドは直接ファイル名を指定できないため、一時的な指示書（cloudbuild.yaml）を作成します
cat <<EOF > cloudbuild.yaml
steps:
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', '${IMAGE}:latest', '-f', 'Dockerfile.prod', '.']
images:
- '${IMAGE}:latest'
EOF

# 作成した指示書を使ってビルドを実行
gcloud builds submit \
  --config cloudbuild.yaml \
  --project "${PROJECT_ID}" \
  .

# 用が済んだ一時ファイルを削除
rm cloudbuild.yaml

echo "🌐 [3/3] Cloud Run にデプロイ中..."

gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}:latest" \
  --platform managed \
  --region "${REGION}" \
  --project "${PROJECT_ID}" \
  \
  --port 8080 \
  --memory "512Mi" \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 60 \
  \
  --add-cloudsql-instances "${CLOUD_SQL_CONNECTION}" \
  \
  --set-env-vars "APP_ENV=production" \
  --set-env-vars "APP_DEBUG=false" \
  --set-env-vars "LOG_CHANNEL=stderr" \
  \
  `# DB接続（先ほど作成したDB名とrootユーザーに変更済み）` \
  --set-env-vars "DB_CONNECTION=mysql" \
  --set-env-vars "DB_SOCKET=/cloudsql/${CLOUD_SQL_CONNECTION}" \
  --set-env-vars "DB_DATABASE=taskapp_db" \
  --set-env-vars "DB_USERNAME=root" \
  \
  --set-env-vars "APP_URL=https://mytask-app-3ifaraxphq-an.a.run.app" \
  --set-env-vars "SANCTUM_STATEFUL_DOMAINS=mytask-app-3ifaraxphq-an.a.run.app" \
  \
  --set-env-vars "SESSION_DRIVER=database" \
  --set-env-vars "SESSION_SECURE_COOKIE=true" \
  --set-env-vars "CACHE_STORE=file" \
  \
  `# 🔐 ここが一番重要！Secret Managerからパスワードとキーを安全に取得します` \
  --set-secrets="APP_KEY=taskapp-app-key:latest,DB_PASSWORD=taskapp-db-password:latest" \
  \
  --allow-unauthenticated

echo ""
echo "════════════════════════════════════════════"
echo "  ✅ デプロイ完了！"
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --region "${REGION}" \
  --project "${PROJECT_ID}" \
  --format "value(status.url)")
echo "  🌍 URL: ${SERVICE_URL}"
echo "════════════════════════════════════════════"