file-similarity
==============

Score files within a directory based on how similar their contents are. Works as a CLI tool or library! Uses an algorithm similar to [`comm`](https://linux.die.net/man/1/comm) for speed, which is drastically faster than the commonly used [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance).

```sh
time npx file-similarity --output similarity.json

real	0m56.109s
user	0m45.827s
sys	0m1.381s
```

Usage (library)
-----------

```sh
yarn add file-similarity
# or
npm --save file-similarity
```

```js
import { fileSimilarity } from 'file-similarity';
```

Usage (CLI)
-----

```sh
$ npx file-similarity --help
Determine which files within your project are most similar (or exactly!)
Usage
  $ file-similarity [options]
Global Options
  --root                          Use this directory as root for globs and files
                                    (current: )
  --ext                           Only inspect files with these extensions
                                    (current: js,jsx,ts,tsx,scss,css)
  --ignore                        Ignore these comma-separated glob patterns
                                    (current: **/node_modules/**,./node_modules/**,**/coverage/**,./coverage/**,**/__snapshots__/**,./__snapshots__/**)
  --output                        Output to this file
                                    (current: stdout)
  --help                          This help.
```

Some example output using the [react](https://github.com/facebook/react/) codebase:

```
$ git clone git@github.com:facebook/react.git
Cloning into 'react'...
$ cd react/packages/react/src
$ npx file-similarity --output similarity.json
$ jq . ./similarity.json | head -20
[
  {
    "filePath0": "forks/ReactCurrentDispatcher.www.js",
    "filePath1": "forks/ReactCurrentOwner.www.js",
    "lineCount0": 7,
    "lineCount1": 7,
    "commonLines": 6,
    "score": 0.8571428571428571
  },
  {
    "filePath0": "__tests__/testDefinitions/PropTypes.d.ts",
    "filePath1": "__tests__/testDefinitions/ReactDOM.d.ts",
    "lineCount0": 15,
    "lineCount1": 17,
    "commonLines": 13,
    "score": 0.8156862745098039
  },
  {
    "filePath0": "forks/ReactSharedInternals.umd.js",
    "filePath1": "ReactSharedInternals.js",
```

Wiewing the Output
--------------------

The output file is just JSON, so it can be queried using something like [`jq`](https://stedolan.github.io/jq/) (or you could write a script).

Some nice `jq` "recipies":

> Print each pair of similar files "nicely"

```sh
jq -r '.[] | "\(.filePath0)\n\(.filePath1):\n   \(.score)"' similarity.json
```

> Which files are more than 75% similar but not exactly the same?

```sh
jq '.[] | select(.score > 0.75) | select(.score < 1)' similarity.json
```

> How many files are more than 75% similar?

```sh
jq '[.[] | select(.score > 0.75)] | length' similarity.json
```

> What percentage of files are more than 75% similar?

```sh
total=$(jq '. | length' similarity.json); \
morethan=$(jq '[.[] | select(.score > 0.75)] | length' similarity.json); \
echo "scale=5 ; $morethan / $total" | bc
```

Contributing
------------

This library uses [web-scripts](https://github.com/spotify/web-scripts/). When committing, please use `yarn commit` to get semantic commit messages for releasing.

Note: If, when writing tests, you get a mysterious error:

```
ENOENT, no such file or directory '.../node_modules/callsites'
```

It's probably due to [this mock-fs issue](https://github.com/tschaub/mock-fs/issues/234). The workaround is to call `console.log` before mocking the file system.

License
-------

MIT