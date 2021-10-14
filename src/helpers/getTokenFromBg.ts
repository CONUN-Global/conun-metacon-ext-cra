export default function getTokenFromBg(){

    let KEY:any = undefined;

    chrome.runtime.sendMessage({message:"EXT_KEY_REQUEST"}, function(response){
      console.log("Background responded with: ", response)
      KEY = response.payload;

    })
    return KEY
}
