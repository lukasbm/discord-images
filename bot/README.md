# Bot

## Run

Set the env variables as described in the main readme.
Then run `npm run start`

## Docker

First enter the directory `cd bot`, then build the image: `cd bot && docker build -t discord-images/bot .`

Then run it. Make sure you have the serviceAccount and the environment variables ready.

```bash
docker run  -d --rm --name discord-images-bot \
    -v $(pwd)/serviceAccount.json:/app/serviceAccount.json:ro \
    -e FIREBASE_API_TOKEN=<token> \
    -e DISCORD_BOT_TOKEN=<token> \
    -e CLARIFAI_API_KEY=<token> \
    discord-images/bot
```
