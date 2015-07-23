# App [/api/app]

## Get [GET]

+ Response 200 (application/json)

            {
              "status": 200
            }

## Create [POST]

+ Response 200 (application/json)

            {
              "status": 200
            }

## Update [PUT]

+ Response 200 (application/json)

            {
              "status": 200
            }

## Delete [DELETE]

+ Response 200 (application/json)

            {
              "status": 200
            }

# User [/api/user/{user_id}]

## Get [GET]

+ Response 200 (application/json)

            {}

# Item [/api/item/{?page}]

## Get [GET]

+ Request GET /api/item/?page=1 (application/json)

+ Response 200 (application/json)

            {"page": 1}

+ Request GET /api/item/?page=2 (application/json)

+ Response 200 (application/json)

            {"page": 2}

