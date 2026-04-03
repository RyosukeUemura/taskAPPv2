# /docker/node/Dockerfile

FROM node:20-alpine

# 最低限必要なツールだけ入れる
RUN apk add --no-cache bash curl git

# 作業ディレクトリの設定
WORKDIR /app

# コンテナがすぐ終了しないように待機させる（開発用の魔法のコマンド）
CMD ["tail", "-f", "/dev/null"]
