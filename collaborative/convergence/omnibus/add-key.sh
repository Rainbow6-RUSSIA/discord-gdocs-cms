#!/usr/bin/env sh

sleep 1m

PUBLIC_KEY=$(cat public.key)
echo "$PUBLIC_KEY"

AUTH="root:password"

DATABASE_NAME=$(curl "http://$AUTH@localhost:2480/query/convergence/sql/SELECT%20databaseName%20from%20Domain%20WHERE%20id=%22default%22" | jq ".result[0].databaseName" | cut -d '"' -f 2)
echo "$DATABASE_NAME"

curl -X POST "http://$AUTH@localhost:2480/command/$DATABASE_NAME/sql" \
    -H "Content-Type: application/json" \
    --data "{
        \"command\":\"insert into JwtAuthKey (description, id, updated, key, enabled) VALUES (\"Default Key\", \"defaultkeyid\", date(), ?, true)\",
        \"parameters\": [\"$PUBLIC_KEY\"]
    }"