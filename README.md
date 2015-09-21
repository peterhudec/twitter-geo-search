# Twitter Geo Search

Simple geolocation aware Twitter search.

## Prerequisities

You should have `node.js` installed.

## Setup

Clone the repository.

```bash
$ git clone https://github.com/peterhudec/twitter-geo-search
$ cd twitter-geo-search
```

You need to create an alias for your localhost because Twitter needs real domain for its OAuth 1.0.

```bash
$ vim /etc/hosts
$ cat /etc/hosts
# /etc/hosts
127.0.0.1    localhost
127.0.0.1    yourlocalhostalias.com
```

Create a Twitter OAuth application at https://apps.twitter.com/

Create `config.js` from `config-template.js` and fill-out all the credentials of your newly created Twitter app.

```bash
$ cp ./config-template.js ./config.js
$ vim ./config.js
```

Install dependencies.

```bash
$ npm install
```

Run the app.

```bash
$ node ./app.js
```

## Usage

Navigate to your domain alias with your browser, enter search terms and watch tweets.