Visual Observation Demo 
====================================
This demo showcases the abilities of the IBM Watson Visual Recognition Service.
More specifically the demo makes it possible to connect a smartphone functioning as
a webcam taking pictures every few seconds and sends them to a Node-RED application. 
The Node-RED application sends the pictures to the IBM Watson Visual Recognition Service and 
displays the results of the service in a dashboard.


### Deploy and Configure the NodeRED Dashboard
1. Host a NodeRED instance (e.g. for free via [IBM Cloud](https://console.bluemix.net/dashboard/apps) using the [Node-RED Starter](https://console.bluemix.net/catalog/starters/node-red-starter?taxonomyNavigation=apps) boilerplate)
2. Add the following npm packages to the package.json of the NodeRED instance
    
    ```javascript
    {
      [...]
      "dependencies": {  
              [...]
              "node-red-dashboard": "^2.6.2",
              [...]
      }
      [...]
    }
    ```
3. Add the following configuration to the "settings.js" (under IBM Cloud this file is called "bluemix-settings.js"") of the NodeRED instance to increase the allowed size of HTTP requests in order to be able to sen images properly and to allow CORS
    
    ```javascript
    var settings = module.exports = {
         [...]
        
        // allows CORS
        httpNodeCors: {origin: true},
        
        // allows HTTP requests to be 5mb large
        apiMaxLength: '60mb',
    
        [...]
    };
    ```
4. Start the NodeRED instance
5. Import the NodeRED flow from [node-red-flow.json](/dashboard/node-red-flow.json) and deploy it ([introductions](https://developers.sensetecnic.com/article/how-to-import-a-node-red-flow/) )
6. Configure the credentials needed to connect to the IBM Watson IoT Platform
    1. Open the "IBM Watson IoT Platform" node
    2. Edit the API Key
    3. Enter the API Key and API Token generated while registering a new application to the IBM Watson IoT Platform
    4. Confirm the changes and deploy the flow
7. Access the dashboard via the following URL: ".../ui"
