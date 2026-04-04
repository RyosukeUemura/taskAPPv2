# 🌤️ 上村好みのタスク管理アプリ

気象データ（Open-Meteo API）と連動し、日々の予定と天気のミスマッチを防ぐためのパーソナライズされたタスク管理ダッシュボードです。「自分の生活を最適化する」という目的のもと、モダンなSPA構成（React × Laravel）で開発しました。

## 💡 開発の背景
一般的なタスク管理アプリでは「その日の天気」まで考慮してくれないため、「週末に洗車のタスクを入れたが、実は雨予報だった」「朝起きてから自転車通勤できるか調べるのが手間」といった日常の小さな課題がありました。
これらをシステムで自動解決し、自身のライフスタイル（上村好み）に完全にフィットさせるために本アプリを開発しました。

## ✨ 主な機能（コアバリュー）
- **気象連動タスクアラート（⚠️）**
  - タスクに「希望する天気（例: 晴れ）」を設定可能。Open-Meteo APIから取得した予定日の天気予報と照合し、不一致の場合は一覧画面にアラートを表示して別日へのリスケジュールを促します。
- **本日の自転車通勤判定（🚲 / ☔️）**
  - 当日の降水確率や天候コードを解析し、ダッシュボードを開いた瞬間に「本日は自転車通勤が可能か」を一目で判定・表示します。
- **セキュアなユーザー認証（SPA認証）**
  - Laravel SanctumによるCookieベースのセッション認証を実装。ユーザーごとに完全に独立したタスク管理が可能です。

## 🛠️ 使用技術スタック
### Frontend
- **React** (TypeScript, Vite)
- **カスタムフック設計** (`useTasks`, `useWeather` などによる関心の分離)

### Backend
- **Laravel 11** (PHP)
- **Laravel Sanctum** (SPA Stateful Authentication)
- **MySQL**

### Infrastructure & External API
- **Docker / Docker Compose** (Nginx, PHP-FPM, MySQLのコンテナ化)
- **Open-Meteo API** (現在・週間天気予報データの取得)

## 🏗️ 技術的なこだわり（アピールポイント）

### 1. カスタムフックによる「関心の分離」
UI（画面の描画）とロジック（データの取得・更新）が密結合になりやすいReactの課題を解決するため、データフェッチや状態管理をカスタムフック（`useTasks`, `useWeather`, `useAuth`）にカプセル化しました。これにより、コンポーネント側は「渡されたデータをどう表示するか」のみに専念でき、保守性と可読性の高いコードベースを実現しています。

### 2. Nginxリバースプロキシを活用したCORS対策とSPA認証
React（ポート5173）とLaravel（ポート8000）のポート違いによるCORSエラーやSanctumのCookie送信の課題を解決するため、Nginxをリバースプロキシとして構成しました。すべて `localhost:80` でリクエストを受け付け、内部でフロントとAPIへルーティングすることで、セキュアで安定したSPA認証環境を構築しています。

### 3. オプショナルチェーンとNull合体演算子による堅牢なUI
外部API（天気予報）のデータ取得遅延や欠損に備え、Reactの描画処理において `weather?.daily_forecast ?? []` のようなモダンな記法を徹底。データが未着の初期ロード時でもアプリケーションがクラッシュしない、安全なレンダリングを実装しています。

## ⚙️ ローカル環境での動かし方
```bash
# 1. リポジトリのクローン
git clone [https://github.com/YourUsername/weather-task-app.git](https://github.com/YourUsername/weather-task-app.git)
cd weather-task-app

# 2. コンテナのビルドと起動
docker compose up -d

# 3. バックエンドのセットアップ（別ターミナルで実行）
docker exec -it mytask_php bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
exit

# 4. フロントエンドのセットアップ（別ターミナルで実行）
cd src/node
npm install
npm run dev
```
※ブラウザで `http://localhost` にアクセスして動作を確認できます。