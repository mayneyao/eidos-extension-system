const getDirHandle = async (_paths: string[]) => {
  const paths = [..._paths];
  const opfsRoot = await navigator.storage.getDirectory();
  let dirHandle = opfsRoot;
  for (const path of paths) {
    dirHandle = await dirHandle.getDirectoryHandle(path, { create: true });
  }
  return dirHandle;
};

export class OpfsManager {
  listDir = async (_paths: string[]) => {
    const dirHandle = await getDirHandle(_paths);
    const entries: FileSystemFileHandle[] = [];
    for await (const entry of (dirHandle as any).values()) {
      entries.push(entry);
    }
    return entries;
  };

  getFile = async (_paths: string[]) => {
    const paths = [..._paths];
    if (paths.length === 0) {
      throw new Error("paths can't be empty");
    }
    const filename = paths.pop();
    const dirHandle = await getDirHandle(paths);
    const fileHandle = await dirHandle.getFileHandle(filename!, {
      create: true,
    });
    const file = await fileHandle.getFile();
    return file;
  };

  addDir = async (_paths: string[], dirName: string) => {
    const paths = [..._paths];
    if (paths.length === 0) {
      throw new Error("paths can't be empty");
    }
    const dirHandle = await getDirHandle(paths);
    const r = await dirHandle.getDirectoryHandle(dirName, { create: true });
    console.log(r);
    // const opfsRoot = await navigator.storage.getDirectory()
    // const path = await opfsRoot.resolve(r)
  };

  addFile = async (_paths: string[], file: File) => {
    const paths = [..._paths];
    if (paths.length === 0) {
      throw new Error("paths can't be empty");
    }
    const dirHandle = await getDirHandle(paths);
    const fileHandle = await dirHandle.getFileHandle(file.name, {
      create: true,
    });
    const writable = await (fileHandle as any).createWritable();
    await writable.write(file);
    await writable.close();
    // fileHandle get path
    const opfsRoot = await navigator.storage.getDirectory();
    const relativePath = await opfsRoot.resolve(fileHandle);
    return relativePath;
  };

  deleteEntry = async (_paths: string[], isDir = false) => {
    const paths = [..._paths];
    if (paths.length === 0) {
      throw new Error("paths can't be empty");
    }
    if (isDir) {
      const dirHandle = await getDirHandle(paths);
      // The remove() method is currently only implemented in Chrome. You can feature-detect support via 'remove' in FileSystemFileHandle.prototype.
      await (dirHandle as any).remove({
        recursive: true,
      });
    } else {
      const filename = paths.pop();
      const dirHandle = await getDirHandle(paths);
      await dirHandle.removeEntry(filename!);
    }
  };

  renameFile = async (_paths: string[], newName: string) => {
    const paths = [..._paths];
    if (paths.length === 0) {
      throw new Error("paths can't be empty");
    }
    const filename = paths.pop();
    const dirHandle = await getDirHandle(paths);
    const fileHandle = (await dirHandle.getFileHandle(filename!, {
      create: true,
    })) as any;
    await fileHandle.move(newName);
  };
}

// deprecated
export const opfsManager = new OpfsManager();
