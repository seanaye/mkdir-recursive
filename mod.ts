const pathSeparator = "/";

/**
 * Returns true if file or dir is found
 * @param filename - path to search for on disk
 * @returns - Promise which resolves to the boolean whether the location exists
 */
export async function exists(filename: string | URL): Promise<boolean> {
  try {
    await Deno.stat(filename);
    // successful, file or directory must exist
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // file or directory does not exist
      return false;
    } else {
      // unexpected error, maybe permissions, pass it along
      throw error;
    }
  }
}

/**
 * Utility for recursively creating a given directory.
 * Given any valid URL it will create the leaf directory but not the trailing file.
 * Does not perform any destructive actions on the fs.
 * Will not create files, only directories
 * @param url - a valid url to an existing or non existing file or dir
 */
export async function ensureDirExists(url: URL) {
  const segments = url
    .pathname
    .split(pathSeparator)
    .filter((s) => s && !s.includes("."));

  const leafDir = segments.join(pathSeparator);

  const next = new URL(leafDir + pathSeparator, "file://");

  // create the next dir if it doesn't exist
  if (await exists(next)) {
    return
  }

  try {
    await Deno.mkdir(next, { recursive: true });
  } catch (e) {
    // handle race condition where multiple created at once
    if (!(e instanceof Deno.errors.AlreadyExists)) {
      throw e;
    }
  }
}
