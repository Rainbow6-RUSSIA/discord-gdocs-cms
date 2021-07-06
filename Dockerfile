FROM node:16-alpine AS builder

RUN apk add --no-cache libc6-compat git

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
COPY patches ./patches

RUN yarn install --immutable

COPY . .

ARG NEXT_PUBLIC_SENTRY_DSN
ARG NEXT_PUBLIC_GOOGLE_API_KEY
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_CONVERGENCE_URL
ARG NEXT_PUBLIC_GOOGLE_SCOPES
ARG NEXT_PUBLIC_DISCORD_SCOPES

# fix git dependency
ENV NODE_ENV=production 

ARG BUILD_ID
ARG DATABASE_URL
RUN BUILD_ID=${BUILD_ID} yarn build && yarn prisma:deploy

FROM node:16-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

ENV NODE_ENV=production \
    NODE_OPTIONS=--max-http-header-size=81920

USER node

EXPOSE 3000

ENTRYPOINT [ "node_modules/.bin/next" ]
CMD [ "start" ]
