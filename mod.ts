const pathSeparator = "/";

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
 * Utility for recursively creating a given directory
 * Does not perform any destructive actions on the fs
 * Will not create files, only directories
 * @param start - a valid, already existing, path on disk
 * @param end - a valid path which contains start
 * @returns the URL of the last directory which was created
 */
export async function recursiveCreate(start: URL, end: URL): Promise<URL> {
  const diff = end.toString().replace(start.toString(), "");
  const segments = diff
    .split(pathSeparator)
    .filter((s) => s && !s.includes("."));

  const nextSegment = segments.at(0);

  // recursive end case
  if (!nextSegment) {
    return start;
  }

  const next = new URL(`${pathSeparator}${nextSegment}`, start);

  // create the next dir if it doesn't exist
  if (!(await exists(next))) {
    await Deno.mkdir(next);
  }

  return await recursiveCreate(next, end);
}
