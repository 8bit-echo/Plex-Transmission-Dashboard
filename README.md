# Torrent Dashboard
>This dashboard was designed for use with a raspberry pi on a local network to interface with a Transmission client on the same network over the RPC protocol. Uses the official Raspberry Pi Touchscreen with chromium in Kiosk mode.

## Getting Started
 - clone this repo
 - open a terminal at the root of the project
 - `cd` into the back-end folder
 - run `yarn` to install the server-side dependencies
 - run `cp .env.example .env` and replace with environment variables matching your setup.
 - `cd` into the front-end and run `yarn && yarn build` to build front-end assets.
 - run the node server on the backend to start the application. `node ./server.js`
 - go to localhost:3000 in your browser. the front-end assets are served by the node server.

![screenshot]('./screenshot.png')


## Development

### Back-end
  Scripts: 

  `yarn start`: run server in production mode.

  `yarn dev` : run back-end in development mode with "--watch"

  `yarn inspect`:  run with debugger enabled for chrome or VS Code.

### Front-end
  The front end of this project uses the Vue CLI for development, so all that jazz is available to you. 

  Scripts:
  `serve`: runs the front-end only, which is pretty useless here.

  `build`: build files for production

  `dev`: run front-end with --watch flag (since files are served from back-end, no hot-reloading)

  `lint`: run the code linter.
    