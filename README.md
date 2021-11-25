<p align="center">
  <img alt="CONUN preview" src="https://raw.githubusercontent.com/CONUN-Global/conun-homepage/fcc7721617445e0fa571ac00bc8463ee3716ada8/src/assets/icons/conun-logo.svg" height="60" />
  <br><br>
</p>

# CONUN METACON Chrome Extension

METACON is a cryptocurrency wallet organizer for Google Chrome, interacting with the CONUN mainnet and Ethereum blockchain. It allows users to store multiple wallets securely and manage account keys easily. 

## Getting started with Metacon:

- Use git to clone the repository on your computer.
- Use `yarn` or `npm -i` to fetch and install the required packages
- Set up the correct environment variables (see below)
- Build the project using `yarn build`, or `yarn build-win` if you're on windows.
- Open Chrome, Chromium, or Brave browser, and navigate to the extensions page, e.g `chrome://extensions/`
- Toggle developer mode
- Select 'load unpacked' and navigate to the folder `build` in the project's directory

N.B The Metacon extension relies on an external web app to login, which is not supplied with this project.
You will be required to implement your own login service that is able to handover login data to the extension.


### Setting up the environment variables

The required environment variables are as follows:

| Key                        	| Description                                                    	| Example                                                                     	|
|----------------------------	|----------------------------------------------------------------	|-----------------------------------------------------------------------------	|
| REACT_APP_SERVER_URL       	| The URL for the server running the CONUN Blockchain middleware 	| "https://example.conun.io/api/etc"                                          	|
| REACT_APP_WEB3_URL         	| The URL used to configure web3 (infura)                        	| "https://mainnet.infura.io/v3/000000000000"                                 	|
| REACT_APP_LOGGER_URL       	| The URL of a logging service to send error messages to         	| "https://example.conun.io/logger/"                                          	|
| REACT_APP_WEBAPP_ADDRESS   	| The URL of the login service for Metacon                       	| "https://login.conun.io/example"                                            	|
| REACT_APP_GOOGLE_CLIENT_ID 	| The ID key for Google OAUth                                    	| "3948712349087134-ZXhhbXBsZS1jaHJvbWUta2V5.<br/>apps.googleusercontent.com" 	|
| REACT_APP_KAKAO_CLIENT_ID  	| The ID key for Kakao Auth                                      	| "a2FrYW8ta2V5LWhhc2g"                                                       	|
| REACT_APP_SMART_CONTRACT   	| The name for the private blockchain token and contract         	| "CONX"                                                                      	|

Place the environment variables in a file such as `.env.development.local` and `.env.production.local` that is inside the root directory of the project.
