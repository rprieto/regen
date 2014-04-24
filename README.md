# regen

> Generate files with a 1-to-1 dependency.

*Because sometimes you don't need a complex build tool :)*

[![NPM](https://nodei.co/npm/regen.png)](https://www.npmjs.org/package/regen)

[![Travis CI](https://api.travis-ci.org/rprieto/regen.png)](https://travis-ci.org/rprieto/regen) [![Dependency Status](https://david-dm.org/rprieto/regen.png?theme=shields.io)](https://david-dm.org/rprieto/regen) [![devDependency Status](https://david-dm.org/rprieto/regen/dev-status.png?theme=shields.io)](https://david-dm.org/rprieto/regen#info=devDependencies)

- Uses globs to pick which files to process
- Supports both an "easy" syntax and custom functions
- Only processes files when the source has changed
- Full async / concurrency support
- Creates any required destination folders

# Example

Take a screenshot of all your movies:

```js
var regen = require('regen');

regen({
  cwd:     './movies',
  src:     '**/*.{mp4,mov}',
  dest:    '../thumbs/$path/$name.jpg',
  process: 'ffmpeg $src -vframes 1 -y $dest'
}, callback);
```

# API

```js
regen({
  cwd:     /* the directory from which to to resolve paths */,
  src:     /* source file filter */,
  dest:    /* how to generate output file names */,
  process: /* async operation to run on each file */
}, callback);
```

### `cwd`

The directory from which `src` and `dest` paths are resolved. `cwd` can be an absolute path, or relative to the current process.

### `src` 

A [glob](https://www.npmjs.org/package/glob) filter to pick source files, relative to `cwd`.  For example:

- `**/*` all files
- `**/lib*.c` all *c* files starting with *"lib"*
- `photos/*.jpg` all *jpg* files in *"photos"*
- `**/*.{txt,md}` both *txt* and *md* files

Note: all globs must use forward slashes, even on Windows.

### `dest`

A function to derive the destination file path from each source.  
It must return either an absolute path, or a relative path from `cwd`.

```js
function dest(src) {
  // the 'src' param is a relative path from 'cwd'
  return path.join('bin', src.replace('.txt', '_checksum.txt'));
}
```

Instead of a function, you can also pass in a string with the following tokens:

- `$path` relative path of the source file in `cwd`
- `$name` source file name, without the extension or the `.`
- `$ext` source file extension, without the `.`

Examples:

- `/absolute/output/$name.$ext`
- `relative/$path/$name_suffix.$ext`

Note: this path syntax must use forward slashes, even on Windows.

### `process`

The async operation to be executed on each file. It will only run if the destination does not exist, or if the source file has changed since. Files are processed in parallel, up to the number of CPUs.

It can be either a function:

```js
function process(src, dest, callback) {
  // src and dest are absolute paths
}
```

Or a string to be executed with [child_process.exec](http://nodejs.org/api/child_process.html), with the following tokens:

- `$src` the full path to the source file
- `$dest` the full path to the destination file

Examples:

- `ffmpeg $src -vframes 1 -y $dest`
- `cat $src | md5 > $dest`
