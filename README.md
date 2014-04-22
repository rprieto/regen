# regen

> Generate files with a 1-to-1 dependency.

*Because sometimes you don't need a complex build tool :)*

[![NPM](https://nodei.co/npm/regen.png)](https://www.npmjs.org/package/regen)

- Globs to filter which files to process
- Only processes files when the source has changed
- Supports async functions
- Creates any required destination folders

# API

```
regen({
  source:  /* source folder */,
  filter:  /* source file filter */,
  dest:    /* how to generate output file names */,
  process: /* async function to run on each file */
}, callback);
```

# Arguments

- `source`

The folder containing source files.  
This is relative to the current process `cwd`.

- `filter` 

A [glob](https://www.npmjs.org/package/glob) filter to pick source files.  
Examples: `**/*`, `**/*.jpg`, `lib/*.c`, `**/*.{txt,md}`

- `dest`

A function to derive the destination file path from each source.

```js
function dest(src) {
  // src is a relative path in the 'source' folder
  return path.join('bin', src.replace('.txt', '_checksum.txt'));
}
```

Instead of a function, you can also pass in a string with the following tokens:

```js
'bin/$path/$name_checksum.$ext'
```

- `process`

A function to be executed on each source file.  
Files are processed in parallel - up to the number of CPUs.

```js
function process(src, dest, callback) {
  // src and dest are absolute paths
}
```

# Examples

```js
function checksum(src, dest, callback) {
  require('child_process').exec('cat ' + src + ' | md5 > ' + dest, callback);
}

regen({
  source:  'src',
  filter:  '**/*.tar',
  dest:    'src/$path/$name.md5',
  process: checksum
}, callback);
```
