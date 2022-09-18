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
The repo currently provides a Procfile for Heroku deployent and a Dockerfile for a containerized Deployment.

The bot calls the AI classifier for each image attachment of a discord message, then stores the concepts in google firebase upon classification.

Environment variables:

- `DISCORD_BOT_TOKEN`: the gateway token for the bot
- `FIREBASE_API_TOKEN`: the api token for google firebase
- `GOOGLE_APPLICATION_CREDENTIALS`: (absolute) path to the firebase admin sdk secret which includes the acces keys/tokens

in `./functions/.env`:

- `DISCORD_CLIENT_ID`: discord oauth client id
- `DISCORD_CLIENT_SECRET`: discord oauth client secret

### The AI

This implementation currently uses the external Service Clarifai for image classification. This can be replaced by any AI model you want (e.g. Tensorflow) by implementing the interfaces of `analyze/analyze.ts`.
