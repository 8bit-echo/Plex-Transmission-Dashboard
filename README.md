# Torrent Dashboard
>This project is a dashboard to help find and manage downloads using Transmission bit torrent and add them to a Plex Media Library on a local network. It is designed to use the official Raspberry Pi 7" touchscreen, and a Progressive Web App for mobile devices.

>Note that this project was made as a personal excercise and is for research purposes only to learn about RPC back-ends, web scraping and PWA development with VueJS. It may not work for you and is not intended to be used for any real-world applications.

## Features
- Extendable web scraper for interfacing with torrent websites and search engines.
- Download manager for Transmission client.
- 1-tap toggle for OpenVPN client.
- Removes illegible nonsense strings from torrent names whie downloading
- Built in support for adding completed downloads directly to Plex Media Server.
- Raspberry Pi 7" Touch Screen support (Chrome in Kiosk Mode).
- PWA companion for mobile devices.

![screenshot](https://github.com/8bit-echo/Torrent-Dashboard/raw/master/screenshot-rpi-dashboard.png "screenshot")
![screenshot](https://github.com/8bit-echo/Torrent-Dashboard/raw/master/screenshot-search.png "screenshot")
![screenshot](https://github.com/8bit-echo/Torrent-Dashboard/raw/master/screenshot-modal.png "screenshot")
![screenshot](https://github.com/8bit-echo/Torrent-Dashboard/raw/master/screenshot-dashboard-iphone.png "screenshot")


## Getting Started
 - clone this repo on the machine that contains Plex Media Server, OpenVPN, and Transmission.
 - open a terminal at the root of the project
 - `cd` into the back-end folder
 - run `yarn` to install the server-side dependencies
 - run `cp .env.example .env` and replace with environment variables matching your setup.
 - `cd` into the client directory and set the envionment variable for `VUE_APP_HOST` in client/.env to match the internal IP address of whichever machine is running the back-end code.
 - run `yarn && yarn build` to build front-end assets.
 - run the node server on the back-end to start the application with admin privleges. `sudo node ./server.js`. (Admin privileges are required to start the openvpn process).
 - go to localhost:2113 in your browser. the front-end assets are served by the node server.
 - if using iOS, visit \<internal-ip-address\>:2113, tap the "Add to Home Screen" option in the action sheet.



## Development


### Back-end

### Adding a different Torrent Website to the scraper.
 - Open back-end/TorrentProvider.js and create a new class that extends TorrentProvider.
 - Copy default `options` object in the constructor of the super and replace the values with the matching name of the site, url parts, and CSS selectors for that site.
 - Some sites do not list the magnet link on the search results page, if this is the case, then you must set the link of the "details" page, and the selector of the magnet inside that page under `this.options.selectors.single`. 
 - Add your new class's name to the `allEngines` export array at the bottom of the file.
 - if some of the date needs to be filtered or massaged from the scrape, you can override the methods included in the parent class to do so.


  Scripts: 

  `yarn start`: run server in production mode.

  `yarn dev` : run back-end in development mode with "--watch"

  `yarn inspect`:  run with debugger enabled for chrome or VS Code.

### Front-end
  The front end of this project uses the Vue CLI for development, so all that jazz is available to you.
  #### Plugins Used
  1. Vuex
  1. Vue Router
  1. Vue PWA

  Scripts:
  `serve`: runs the front-end only, which is pretty useless here.

  `build`: build files for production

  `dev`: run front-end with --watch flag (since files are served from back-end, no hot-reloading)

  `lint`: run the code linter.
    

### Known Issues
1. App not served over https. Cant find a way to get a valid SSL certificate for internal addresses, so the service worker is never properly registered
1. The back-end functions don't have great error handling, and return sometimes inconsistent results, making error handling on client a little shoddy.
1. In-App notifications on "notched" iPhones sometimes stick around at the top edge of the screen when dismissed.

### Planned Additions
1. A "wishlist" tab to store items that I, or other people on my network want to download, but can't get to it right away. 
1. Hopefully proper notifications is Apple ever gets it together.