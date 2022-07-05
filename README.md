# Whats this?

Given a path to an existing or non-existing file or directory, ensure that the leaf-most directory exists on the disk. This will create the directory if it does not exist.


# Usage

```ts
import { ensureDirExists, exists } from "https://deno.land/x/mkdir_recursive/mod.ts"

const stringExample = "/new/path/on/disk"

console.log(await exists(stringExample)) // false
await ensureDirExists(stringExample)
console.log(await exists(stringExample)) // true


const urlFileExample = new URL("file:///new/path/on/disk/file.ts")

console.log(await exists(urlFileExample)) // false
await ensureDirExists(stringExample)
console.log(await exists("file:///new/path/on/disk")) // true
console.log(await exists("file:///new/path/on/disk/file.ts")) // false
```

