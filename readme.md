# vararu.org

This is the source code for my personal website, deployed at [vararu.org](http://vararu.org/).

Because of the way `github-pages` work with custom domains, the actual source files for this website are in the `source` branch. The `master` branch is a dump of the latest `./dist` build.

## Building

Checkout into the `source` branch using `git checkout source`, and then install the necessary dependencies:

```bash
$ npm i -g gulp
$ npm i
$ bower i
```

### Commands

Run `gulp` to build:

```bash
$ gulp
```

Run `gulp serve` to serve the build in your browser:

```bash
$ gulp serve
```

Run `gulp watch` for the development workflow:

```bash
$ gulp watch
```

Run `gulp pagespeed` with a server running on port `3000` to test the website against `Google Pagespeed Insights`:

```bash
$ node index.js # Start a provided express server that does gzip caching.
$ gulp pagespeed
```

### License

[MIT](MIT).
