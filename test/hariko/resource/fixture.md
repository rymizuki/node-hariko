# GET /

+ Response 200 (text/plain)

        Hello world

# GET /api/app

+ Response 200 (application/json)

            {}

# ユーザ [/api/user/{user_id}]

## 一覧取得 [GET /api/user{?page}]

+ Response 200 (application/json)

            {}

## 取得 [GET]

+ Response 200 (application/json)

            {}

## 追加 [POST /api/user]

+ Response 200 (application/json)

            {}

## 更新 [PUT]

+ Response 200 (application/json)

            {}

# アイテム [/api/item/{item_id}]

## 取得 [GET]

+ Request GET /api/item/hariko (application/json)

+ Response 200 (application/json)

            []

+ Request GET /api/item/deco (application/json)

+ Response 200 (application/json)

            []

# エラー

## アクション [GET /api/error]
