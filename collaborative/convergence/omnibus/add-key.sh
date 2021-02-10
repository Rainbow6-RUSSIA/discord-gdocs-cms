#!/usr/bin/env sh

sleep 10s

echo "WRITING PUBLIC KEY..."

PUBLIC_KEY=$(cat public.key)
AUTH="root:password"
QUERY_RES=$(curl -s "http://$AUTH@localhost:2480/query/convergence/sql/SELECT%20status%2C%20databaseName%20from%20Domain%20WHERE%20id%3D%22default%22")
STATUS=$(echo "$QUERY_RES" | jq ".result[0].status" | cut -d '"' -f 2)
DATABASE_NAME=$(echo "$QUERY_RES" | jq ".result[0].databaseName" | cut -d '"' -f 2)

if [ $STATUS != "online" ] 
then
    echo "SERVER STILL STARTING"
    exit 1
fi

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