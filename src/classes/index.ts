
/*
{
  "@domain": "extension",
  "@logTarget": "extensiondd.transfer",
  "@tags": "test",
  "@osType": "linux",
  "@agent": "chrome",
  "from": "me",
  "level": "ERROR",
  "message": "test"
  }
*/



export class Logger {

  public domain = "extension";
  public agent = "chrome";
  public logTarget: string | undefined;
  public tags: string | undefined;
  public osType: string | undefined;
  public from: string | undefined;
  public level: string | undefined;
  public message: string | undefined;


  private getOS(){

    /*  This as any cast is because TS says:
        Property 'userAgentData' does not exist on type 'Navigator'.
        ...but if you go to a browser and you console.log window.navitator you can see said property.
        We need to check in the future to see if this issue is resolved.

    */
    const navigator = window.navigator as any; 
    return navigator.userAgentData.platform;
  }

  constructor(fromUserID:string){
    this.from = fromUserID;
    this.osType = this.getOS();
  }
}


