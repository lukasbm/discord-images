# Bot

## Run

Set the env variables as described in the main readme.
Then run `npm run start`

## Docker

First build the image: `docker build -t discord-images/bot .`

Then run it. Make sure you have the serviceAccount and the environment variables ready.
```bash
docker run discord-images/bot -d --rm --name discord-images-bot
    -v ./serviceAccount.json:/app/serviceAccount.json:ro
    -e FIREBASE_API_TOKEN=<token>
    -e DISCORD_BOT_TOKEN=<token>
```
