#!/usr/bin/env sh

sleep 1m

PUBLIC_KEY=$(cat public.key)
echo "WRITING PUBLIC KEY..."

AUTH="root:password"

DATABASE_NAME=$(curl -s "http://$AUTH@localhost:2480/query/convergence/sql/SELECT%20databaseName%20from%20Domain%20WHERE%20id=%22default%22" | jq ".result[0].databaseName" | cut -d '"' -f 2)

RESPONCE_CODE=$(curl -X POST "http://$AUTH@localhost:2480/command/$DATABASE_NAME/sql" \
    -so /dev/null -w '%{response_code}' \
    -H "Content-Type: application/json" \
    --data "{
        \"command\":\"insert into JwtAuthKey (description, id, updated, key, enabled) VALUES (\"Default Key\", \"defaultkeyid\", date(), ?, true)\",
        \"parameters\": [\"$PUBLIC_KEY\"]
    }")
echo "SERVER RESPONCE CODE: $RESPONCE_CODE"

if [ $RESPONCE_CODE -eq 200 ] 
then
    echo "ADD KEY SUCCESS"
    exit 0
else
    echo "ADD KEY FAILED"
    exit 1
fi