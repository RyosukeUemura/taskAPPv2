#!/bin/bash
# ════════════════════════════════════════════════════════════════════════════
# Workload Identity Federation 設定スクリプト
#
# 実行前に確認：
#   gcloud auth login
#   gcloud config set project taskappv2-492314
#
# 実行方法：
#   chmod +x setup-wif.sh
#   ./setup-wif.sh
# ════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ── 変数定義 ────────────────────────────────────────────────────────────────
PROJECT_ID="taskappv2-492314"
PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format="value(projectNumber)")
REGION="asia-northeast1"
SERVICE_NAME="mytask-app"
REPO_NAME="RyosukeUemura/taskAPPv2"

SA_NAME="github-actions-sa"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

POOL_ID="github-actions-pool"
PROVIDER_ID="github-actions-provider"
ARTIFACT_REPO="mytask-repo"

echo "Project ID     : ${PROJECT_ID}"
echo "Project Number : ${PROJECT_NUMBER}"
echo "Service Account: ${SA_EMAIL}"
echo ""

# ── Step 1: 必要な API を有効化 ─────────────────────────────────────────────
echo "==> [1/7] API を有効化..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  iamcredentials.googleapis.com \
  cloudresourcemanager.googleapis.com \
  --project="${PROJECT_ID}"

# ── Step 2: Artifact Registry リポジトリを作成 ───────────────────────────────
echo "==> [2/7] Artifact Registry リポジトリを作成..."
gcloud artifacts repositories create "${ARTIFACT_REPO}" \
  --repository-format=docker \
  --location="${REGION}" \
  --description="mytask app Docker images" \
  --project="${PROJECT_ID}" 2>/dev/null || echo "  (既に存在するためスキップ)"

# ── Step 3: サービスアカウントを作成 ─────────────────────────────────────────
echo "==> [3/7] サービスアカウントを作成..."
gcloud iam service-accounts create "${SA_NAME}" \
  --display-name="GitHub Actions Service Account" \
  --project="${PROJECT_ID}" 2>/dev/null || echo "  (既に存在するためスキップ)"

# ── Step 4: サービスアカウントに必要な権限を付与 ──────────────────────────────
echo "==> [4/7] IAM ロールを付与..."

# Cloud Run デプロイ権限
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin"

# Artifact Registry への書き込み権限
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/artifactregistry.writer"

# サービスアカウントを Cloud Run に紐づけるための権限
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser"

# ── Step 5: Workload Identity Pool を作成 ────────────────────────────────────
echo "==> [5/7] Workload Identity Pool を作成..."
gcloud iam workload-identity-pools create "${POOL_ID}" \
  --location="global" \
  --display-name="GitHub Actions Pool" \
  --project="${PROJECT_ID}" 2>/dev/null || echo "  (既に存在するためスキップ)"

# ── Step 6: Workload Identity Provider を作成 ────────────────────────────────
echo "==> [6/7] Workload Identity Provider を作成..."
gcloud iam workload-identity-pools providers create-oidc "${PROVIDER_ID}" \
  --location="global" \
  --workload-identity-pool="${POOL_ID}" \
  --display-name="GitHub Actions Provider" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.actor=assertion.actor" \
  --attribute-condition="assertion.repository=='${REPO_NAME}'" \
  --project="${PROJECT_ID}" 2>/dev/null || echo "  (既に存在するためスキップ)"

# ── Step 7: サービスアカウントに WIF からのアクセスを許可 ──────────────────────
echo "==> [7/7] WIF <-> サービスアカウントのバインドを設定..."
WORKLOAD_IDENTITY_POOL_FULL="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}"

gcloud iam service-accounts add-iam-policy-binding "${SA_EMAIL}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_FULL}/attribute.repository/${REPO_NAME}" \
  --project="${PROJECT_ID}"

# ── 完了メッセージ ────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════════════"
echo " WIF 設定完了！"
echo " 以下の値を GitHub Actions の Secret/Variable に登録してください"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "【GitHub Secrets に登録】"
echo "  なし（WIF を使うため SA キーは不要）"
echo ""
echo "【GitHub Variables に登録】"
echo "  GCP_PROJECT_ID     = ${PROJECT_ID}"
echo "  GCP_REGION         = ${REGION}"
echo "  ARTIFACT_REPO      = ${ARTIFACT_REPO}"
echo "  CLOUD_RUN_SERVICE  = ${SERVICE_NAME}"
echo ""
echo "  WIF_PROVIDER ="
gcloud iam workload-identity-pools providers describe "${PROVIDER_ID}" \
  --location="global" \
  --workload-identity-pool="${POOL_ID}" \
  --project="${PROJECT_ID}" \
  --format="value(name)"
echo ""
echo "  WIF_SERVICE_ACCOUNT = ${SA_EMAIL}"
echo ""
