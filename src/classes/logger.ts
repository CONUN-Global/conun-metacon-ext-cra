import loggerInstance from "src/axios/loggerInstance";
interface LogDetails{
  logTarget:string;
  tags:string[];
  level: "ERROR" | "INFO" | "WARN";
  message: any;
}
export class Logger {

  private isActive:boolean;

  private domain = "extension";                          // What conun service sent it
  private agent = "chrome";                              // What platform (chrome, etc)
  private osType: string | undefined;                    // What OS it's running on
  private from: string | undefined;                      // Which user is using the app

  //Tags, level, logtarget, and message are set per log sent

  private getOS(){

    /*  
    This as any cast is because TS says:
    Property 'userAgentData' does not exist on type 'Navigator'.
    ...but if you go to a browser and you console.log window.navitator you can see said property.
    We need to check in the future to see if this issue is resolved.
    */
    const navigator = window.navigator as any; 
    return navigator.userAgentData.platform;
  }

  private formatLogtarget(targetString:String){
    return `${this.domain}.${targetString}`
  }

  private JSONformatted(logDetails:LogDetails){
    return {
      "@domain": this.domain,
      "@osType":this.osType,
      "@agent":this.agent,
      "from": this.from,
      "@logTarget": this.formatLogtarget(logDetails.logTarget),
      "@tags": logDetails.tags,
      "level": logDetails.level,
      "message": JSON.stringify(logDetails.message),
      }
  }

  constructor(isActive:boolean, userWalletAddress:string){
    this.isActive = isActive;
    this.osType = this.getOS();
    this.from = userWalletAddress;
  }

  get shouldLog(){
    return this.isActive;
  }
  
  public async sendLog(logDetails:LogDetails){
    if (this.isActive){
      try {
        await loggerInstance.post("", this.JSONformatted(logDetails))
      } catch(e){
        console.warn(e)
      }

    }
  }
}


