# find-entry
> Find an Entry File

## install
```bash
npm install find-entry
```

## usage
```js
import findEntry from "find-entry";

// find in current working directory
findEntry();
"/Users/john/repo/src/index.js"

// find with relative path
findEntry("./repo");
"/Users/john/repo/src/index.js"

// find with absolute path
findEntry("/Users/john/repo");
"/Users/john/repo/src/index.js"

// find a TypeScript entry point
findEntry("/Users/john/repos/tslib");
"/Users/john/repos/tslib/src/index.ts";

// find entry point named after the package
findEntry("/Users/john/repos/my-library");
"/Users/john/repos/my-library/src/myLibrary.js"
```

