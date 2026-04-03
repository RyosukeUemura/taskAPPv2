<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | SPA認証（Sanctum）でCookieを使うために
    | supports_credentials を true にする必要がある。
    |
    */

    // CORSを適用するパス
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // フロントエンド（Vite / ブラウザ）が動くオリジン
    'allowed_origins' => ['http://localhost'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // ★ Cookieを含むリクエストを許可する（Sanctum SPA認証に必須）
    'supports_credentials' => true,

];
