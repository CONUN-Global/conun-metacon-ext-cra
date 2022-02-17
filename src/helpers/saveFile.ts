export function saveFile(fileName: string, contents: BlobPart[]) {
  console.log("importbackup");
  const blob = new Blob(contents, {
    type: "text/plain;charset=utf-8",
  });
  saveAs(blob, `${fileName}.json`);
}
export function saveChromeFile(fileName: string, contents: BlobPart[]) {
  const blob = new Blob(contents, {
    type: "application/json;charset=utf-8",
  });

  const url = window.URL.createObjectURL(blob);

  const downloadOptions: chrome.downloads.DownloadOptions = {
    url,
    filename: fileName + ".json",
  };

  chrome.downloads.download(downloadOptions);
}
