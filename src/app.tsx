import { useDrop } from "ahooks";
import { useRef } from "react";
import { useAllExtensions } from "./hooks";

export function ExtensionIndexPage() {
  const { extensions, uploadExtension, removeExtension, getAllExtensions } =
    useAllExtensions();
  const dropRef = useRef(null);
  useDrop(dropRef, {
    onText: (text, e) => {
      console.log(e);
      alert(`'text: ${text}' dropped`);
    },
    onFiles: async (_, event) => {
      // alert(`${files.length} file dropped`);
      event?.preventDefault();
      const dirHandle: FileSystemDirectoryHandle = await (
        event as any
      ).dataTransfer.items[0].getAsFileSystemHandle();
      await uploadExtension(dirHandle);
      await getAllExtensions();
    },
    onUri: (uri, e) => {
      console.log(e);
      alert(`uri: ${uri} dropped`);
    },
    // onDragEnter: () => setIsHovering(true),
    // onDragLeave: () => setIsHovering(false),
  });
  const handleUploadExtension = async () => {
    const dirHandle: FileSystemDirectoryHandle = await (
      window as any
    ).showDirectoryPicker();
    await uploadExtension(dirHandle);
    await getAllExtensions();
  };
  const handleExtensionClick = async (extensionName: string) => {
    window.open(`//${window.location.host}/${extensionName}`);
  };

  const handleRemoveExtension = (extensionName: string) => {
    removeExtension(extensionName);
  };

  return (
    <div className="grid w-full grid-cols-5 h-full">
      <div className="col-span-1" />
      <div className="col-span-5 space-y-6 p-4 pb-16 md:block md:p-10 xl:col-span-3">
        <div className="flex items-start justify-between">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">
              All Extensions
            </h2>
            <p className="text-muted-foreground"></p>
          </div>
        </div>
        <div className="flex flex-col grow h-full">
          {extensions.map((extension) => {
            return (
              <div key={extension.name}>
                <span>{extension.name}</span>
                <button
                  onClick={() => handleRemoveExtension(extension.name)}
                  className="mx-2 bg-red-400"
                >
                  del
                </button>
                <button
                  onClick={() => handleExtensionClick(extension.name)}
                  className="mx-2"
                >
                  open
                </button>
              </div>
            );
          })}
          <div
            ref={dropRef}
            onClick={handleUploadExtension}
            className="w-full h-[200px] border border-dashed border-gray-300 rounded-md flex items-center justify-center"
          >
            Drop your dist folder here or click to upload
          </div>
        </div>
      </div>
      <div className="col-span-1" />
    </div>
  );
}
