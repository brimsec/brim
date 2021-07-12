[![Brim CI](https://github.com/brimdata/brim/workflows/Brim%20CI/badge.svg)](https://github.com/brimdata/brim/actions?query=workflow%3A%22Brim+CI%22+branch%3Amain)
# Brim Development

Thank you for contributing to Brim!

Per [common practice](https://www.thinkful.com/learn/github-pull-request-tutorial/Feel-Free-to-Ask#Feel-Free-to-Ask), please [open an issue](https://github.com/brimdata/brim/wiki/Troubleshooting#opening-an-issue) before sending a pull request. If you think your ideas might benefit from some refinement via Q&A, come talk to us on [Slack](https://www.brimsecurity.com/join-slack/) as well.

Brim is early in its life cycle and will be expanding quickly. Please star and/or watch the repo so you can follow and track our progress.

## Code Base Walkthrough

Before you start, review the [Code Base Walkthrough](https://github.com/brimdata/brim/wiki/Code-Base-Walkthrough). This doc provides an overview of the directory structure, libraries used, and other useful details for new developers. A [YouTube video](https://www.youtube.com/watch?v=CPel0iu1pig) is also available that provides a detailed walk-through of the material.

## Setup

You should have `node v12.12.0` and `git` installed. You can start a local instance of Brim via:

[Install Node](https://nodejs.org/en/download/package-manager/)

```bash
git clone https://github.com/brimdata/brim
cd brim
npm install
npm start
```

`npm install` will download all required dependencies, including zqd and zeek. Running `npm start` will compile source files in the root directory to `./dist` and open the app (see babel.config.js for details on what get compiled). When a file is changed, it will recompile it and reload the app.

On subsequent updates, `git pull` then `npm install`.

### zed lake

`zed lake`, from the [Zed](https://github.com/brimdata/zed) repository, is the daemon responsible for data ingestion and query execution. As an npm postinstall step, a`zqd`binary is downloaded and stored in the`./zdeps`directory. Brim will automatically execute and terminate the zqd binary from`./zdeps` on application start and exit.

When developing features that need a non-released zqd instance, you can:

- change the `brimdata/zed` dependency in package.json to refer to a branch or git commit, either in `brimdata/zed` or some fork. If the dependency doesn't look like an official tagged Zed repository, the Brim npm postinstall step will try to build and use zqd from the specified commit.
- Or, you can build zqd yourself, and make it accessible via PATH, then run `brim_zqd_from_path=1 npm start`.

### zeek

Brim, via zqd, uses [Zeek](https://www.zeek.org) to convert packet captures into Zeek logs. These logs are then combined and stored in [ZNG](https://github.com/brimdata/zed/blob/main/docs/formats/zng.md) format.

As an npm postinstall step, a [zeek artifact](https://github.com/brimdata/zeek/releases) is downloaded and expanded into the `./zdeps/zeek` directory. This artifact contains a zeek binary and associated scripts, and a "zeek runner" script or command that is called by zqd. zqd is passed the full path to the zeek runner via the `-zeekrunner` command line option. When a pcap file is ingested, zqd runs the zeek runner with no arguments and its working directory set to an output directory for the zeek TSV logs, and then feeds the pcap data to the zeek runner via stdin. zqd then internally converts the zeek TSV logs into ZNG format.

An alternate Zeek setup may be used by overriding the zeek runner location. This may be done either by launching Brim with the `BRIM_ZEEK_RUNNER` environment variable set to the absolute path of a zeek runner script or commmand, or by setting the "Zeek Runner" preference in the Brim UI. See the [Zeek Customization](https://github.com/brimdata/brim/wiki/Zeek-Customization) wiki article for additional details.

### suricata

Brim uses [Suricata](https://suricata-ids.org) to extract Suricata alert logs from packet captures. These alerts are also transformed into ZNG and combined with the zeek logs. Overall this feature's operation and configuration are similar to those of the Zeek feature. Here, the runner is passed to zqd with the `-suricatarunner` option, and it can be overridden via the Brim UI or the environment variable `BRIM_SURICATA_RUNNER`.

The Suricata rules are updated every time Brim is launched. The update itself is started by zqd by invoking a suricata-update runner that is passed to it as `-suricataupdater`. The default updater uses the default Emerging Threats Open rules, like vanilla Suricata. A custom updater can be used; to do so change the updater path via the Brim UI or the environment variable `BRIM_SURICATA_UPDATER`.

## Tests

Unit tests use [Jest](https://jestjs.io/) which has an [excellent cli](https://jestjs.io/docs/en/cli). Here are some examples you might use frequently.

```bash
npm test                                      # Run all the tests
npx jest Client.test.js                       # Run a single test file
npx jest Client.test.js -t "increment by one" # Run a single test by name
npx jest --watch                              # Run all tests on every change
```

For integration tests, see [test/integration/README.md](test/integration/README.md).

**Snapshots**

Some tests use `expect(result).toMatchSnapshot()`. The first time the test is run, it stores the result in a `.snap` file automatically. Later runs, compare their results to the snapshot. Snapshots can easily be updated with the `-u` command line option.

```bash
npx jest -u # Updates all snapshots with results from this run
```

You can selectively update snapshots by running a single file or test and appending the `-u` option.

```bash
npx jest query.test.js -u # Only updates snapshots used in query.test.js
```

## Pull Requests

Our CI server checks for code format diffs, type errors, eslint errors, unit test failures, and integration test failures. You can check all these things locally before pushing your branch.

```bash
npm run format # Prettier formats and saves the project files
npm run lint   # Check eslint
npm run tsc    # Check the types
npm test       # Unit tests with jest
npm run itest  # Integration tests with jest & spectron

npm run check  # Runs all the above at once except for itests
```

## Installation Packaging

You can create an installable artifact - like a disk image for MacOS - via:

```bash
npm run release
```

Any platform artifacts created will be found under `./dist/installers`.

### MacOS Notarization

[Notarized](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution)
MacOS releases are created automatically by our CI process when a Github
release is created. The below is useful if you need to create one by hand.

```bash
npm run build
APPLE_ID=<user> APPLE_ID_PASSWORD=<app-specific-password> npx electron-builder --mac
```

Where `APPLE_ID` is the apple ID user name, and `APPLE_ID_PASSWORD` is an app-specific password created for notarization (details [here](https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution/customizing_the_notarization_workflow)). This will also sign the contents of the package, which requires a [Developer ID](https://developer.apple.com/developer-id/) certificate to be present in your keychain.

Notarization can take some time to complete ("typically less than an hour"). If you want to check on the status of the notarization request, run:

```bash
xcrun altool --notarization-history 0 -u <user> -p <app-specific-password>
```

## Licensing

This repository contains source code that is licensed under either a
BSD-3-Clause license or the Polyform Perimeter license - see the LICENSE.txt
file for specifics.

If you make a contribution to this repository, whether to source code licensed
under the BSD-3-Clause license or the Polyform Perimeter license, you agree
that you are licensing your contribution under the terms of the BSD-3-Clause
license found in LICENSE.txt, and you agree that you have the right to license
your contribution under those license terms. 

### Why the two licenses?

We want to prevent technology giants from using the Polyform Perimeter license
covered code to create replacement offerings of our projects.

The overwhelming majority of Brim or zqd users and developers will not be
restricted by this license, including those using Brim or zqd in commercial
settings.

The use of the source-available Polyform Perimeter license prevents use
cases like:
* Marketing a work as a “as-a-service” style offering for server
  components like zqd, while using material covered under the Polyform
  Perimeter license
* Marketing a work as a replacement for the Brim desktop application,
  while using material covered under the Polyform Perimeter license

We believe users and developers should have access to the source code for our
project, and we need a sustainable business model to continue funding our
work. Using the source-available Polyform Perimeter license on portions
of the source code lets us realize both.
