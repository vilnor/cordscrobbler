<div align="center">

<p>
	<img width="256" src="./assets/icon-and-name.svg" alt="Cordscrobbler"/>
</p>
<p>Last.fm scrobbler for songs played by other bots on your Discord server.</p>

![Build status](https://github.com/Erick2280/cordscrobbler/workflows/build/badge.svg)

</div>

---

## Updates
This is a fork of the original [cordscrobbler](https://github.com/Erick2280/cordscrobbler) created by [Erick2280](https://github.com/Erick2280).
Changes include
* Added support for scrobbling from FlaviBot 
* Updated to discord.js v14
* Updated to use slash commands instead of DMs
* Changed to using a postgres database instead of Firestore
* Disabled support for other music bots since they have not been tested with the updates

## How it works

This bot scrobbles songs played by other bots on your Discord server to Last.fm. It will automatically scrobble if the user is on the same audio channel as the bot, on any server that this bot is added to.

To enable it for you, you'll need to use the `/register` command and log in with your Last.fm account.

## Supported integrations

- [FlaviBot](https://flavibot.xyz/)

## Running from source

This project can be run in a docker container or directly through Node.js. Both methods require the below `.env` file to be filled out.

In the project root folder, create a new `.env` file and copy the contents of the `.env.template`.

Replace the following fields:
- `<your-discord-bot-token>`: The Discord token for your bot, which can be obtained from the [Discord developer portal](https://discordapp.com/developers/applications).
- `<your-discord-application-id>`: The Discord id for your developer application, also obtained from the [Discord developer portal](https://discordapp.com/developers/applications).
- `<your-spotify-app-client-id>` and `<your-spotify-app-client-secret>`: Tokens from your Spotify integration, which can be obtained on the [Spotify developer dashboard](https://developer.spotify.com/dashboard/applications). This bot uses the Spotify API to look for track information.
- `<your-lastfm-api-key>` and `<your-lastfm-shared-secret>`: The tokens from Last.fm API, which can be obtained on the [Last.fm create API account form](https://www.last.fm/api/account/create).
- `<your-postgres-host>`, `<your-postgres-user>`, `<your-postgres-password>`, `<your-postgres-database>`, and `<your-postgres-port>`: Connection details for your postgres database.
- `<your-topgg-token>`: The token from top.gg API, to post bot usage statistics. It is optional, and statistics are only sent when `NODE_ENV` is set to `production`.

Remember to keep these tokens in a safe place.

### Docker
Make sure Docker is installed.

First, build the container using

    docker build -t cordscrobbler .

Next, run the container using 

    docker run cordscrobbler

That's it!

### Node.js
Make sure Node.js is installed.

First, install the project dependencies running:

    npm install


Finally, to start the bot, run:

    npm run start

## Contact

If you find any problems during the bot usage, please [open an issue](https://github.com/vilnor/cordscrobbler/issues) here on GitHub. PRs are welcome too!

Erick also has a [Cordscrobbler Discord server](https://discord.gg/yhGhQj6cGa) you are welcome to join!
