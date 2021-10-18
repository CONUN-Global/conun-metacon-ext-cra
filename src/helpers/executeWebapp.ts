export default async function executeWebapp() {
  console.log("EXECUTE");
  chrome.tabs.query({ url: "http://localhost:3333/" }, (res) => {
    
  console.log(res);
  if (res.length){
    console.log("Sending code")
    const tab = res[0];
    chrome.tabs.executeScript(tab.id!, {
      file:"./webAppInstructions.js"
    }, (res)=> console.log(res))   
  }
});
}
