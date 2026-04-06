#!/bin/sh
# ── コンテナ起動スクリプト（本番用） ─────────────────────────────────────────
#
# Cloud Run がコンテナを起動するたびにこのスクリプトが実行される。
# 順番が重要：Laravel の初期化 → Nginx 設定の生成 → supervisord 起動
# ─────────────────────────────────────────────────────────────────────────────
set -e  # エラー発生時に即座に終了

echo "=== 🚀 Starting mytask-app ==="
echo "PORT=${PORT:-8080}"

cd /var/www/html

# ── [1] Nginx 設定の生成 ──────────────────────────────────────────────────────
# nginx.conf はテンプレートとして保存されており、${PORT} というプレースホルダーが含まれる。
# envsubst でそこだけを実際のポート番号に置換して、nginx が読める設定ファイルを生成する。
#
# ポイント：envsubst '${PORT}' と明示することで、nginx の変数（$uri 等）は
#           そのままにし、${PORT} だけを置換する。
echo "--- Generating nginx config (PORT=${PORT:-8080})..."
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# ── [2] ストレージの権限設定 ──────────────────────────────────────────────────
# Cloud Run のファイルシステムは一時的（コンテナ再起動でリセット）だが、
# 起動中はLaravelのログ・キャッシュ書き込みに必要。
echo "--- Setting storage permissions..."
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# ── [3] Laravel キャッシュの生成 ──────────────────────────────────────────────
# 本番環境では config:cache で設定値をキャッシュすることでパフォーマンス向上。
# 環境変数から設定を読むため、Cloud Run の環境変数が必要。
echo "--- Caching Laravel config..."
php artisan config:cache --no-interaction

echo "--- Caching Laravel routes..."
php artisan route:cache --no-interaction

echo "--- Caching Laravel views..."
# このアプリは React SPA のため Blade ビューが存在しない。
# view:cache はビューがない場合にエラーを返すので || true でスキップする。
php artisan view:cache --no-interaction 2>/dev/null || echo "No Blade views to cache. Skipped."

# ── [4] データベースマイグレーション ─────────────────────────────────────────
# --force: 本番環境でも確認プロンプトなしで実行する
# 注意: 複数インスタンスが同時起動すると競合することがあるが、
#       Cloud Runはデフォルトでmin-instances=0なのでほぼ問題ない
echo "--- Waiting for database to be ready..."
# Cloud Run は DB_SOCKET（Unix ソケット）で接続するため TCP 待機は不要。
# ローカル docker-compose 環境でのみ TCP 待機を実施する。
if [ -z "${DB_SOCKET:-}" ]; then
  MAX_TRIES=30
  TRIES=0
  until php -r "new PDO('mysql:host=${DB_HOST:-mysql};port=${DB_PORT:-3306};dbname=${DB_DATABASE:-mytask_db}', '${DB_USERNAME:-mytask_user}', '${DB_PASSWORD:-secret}');" 2>/dev/null; do
    TRIES=$((TRIES + 1))
    if [ "$TRIES" -ge "$MAX_TRIES" ]; then
      echo "ERROR: Database did not become ready in time."
      exit 1
    fi
    echo "Database not ready yet. Retry ${TRIES}/${MAX_TRIES}..."
    sleep 1
  done
  echo "Database is ready!"
else
  echo "--- DB_SOCKET detected (Cloud Run). Skipping TCP wait."
fi

echo "--- Running database migrations..."
php artisan migrate --force --no-interaction

echo "=== ✅ Initialization complete. Starting services... ==="

# ── [5] supervisord 起動（nginx + php-fpm を子プロセスとして起動） ─────────────
# exec で supervisord に制御を移譲する（PID 1 になる）
exec /usr/bin/supervisord -c /etc/supervisord.conf
