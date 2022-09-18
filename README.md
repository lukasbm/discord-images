# Discord

Explore your discord images, categorized in an easy to use interface

## Features

- Multitenancy
- Discord Bot that automatically scans images
- AI Service that categorizes them
- Backend that stores the results for each image
- Web interface to easily find your discord images

## Deployment

### Bot

The Bot can be deployed in any way you want.
The repo currently provides a Dockerfile for a containerized Deployment.

The bot calls the AI classifier for each image attachment of a discord message, then stores the concepts in google firebase upon classification.

### Environment variables

for the bot:

- `DISCORD_BOT_TOKEN`: the gateway token for the bot
- `FIREBASE_API_TOKEN`: the api token for google firebase

in `./functions/.env`:

- `DISCORD_CLIENT_ID`: discord oauth client id
- `DISCORD_CLIENT_SECRET`: discord oauth client secret

for the frontend:

- `vite.DISCORD_CLIENT_ID`: TODO

for all:

- `./serviceAccount.json`: is the file that countains the private key for the admin sdk, it should be located in the root of the repo.
