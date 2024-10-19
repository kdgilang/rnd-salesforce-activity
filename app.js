'use strict';
var express = require('express');
var app = express(); 
const path = require('path'); 
var bodyParser = require('body-parser'); 
const { Console } = require("console");
const fs = require("fs");
var request = require("request");

const myLogger = new Console({
  stdout: fs.createWriteStream("normalStdout.txt"),
  stderr: fs.createWriteStream("errStdErr.txt"),
});
// saving to normalStdout.txt file
exports.logExecuteData = [];

app.use(express.static(path.join(__dirname)));
console.log(path.join(__dirname, 'static'));


app.use(bodyParser.urlencoded({ extended:true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

 

app.get('/',function(req,res){
 
    res.sendFile(path.join(__dirname+'/index.html')); 
  }); 


  app.get('/activity/test',function(req,res){ 
var FirstName = "vijay";
var LastName = "";

var title = "Welcome {{firstname}} {{lastname}}";
var subtitle = "Welcome {{firstname}} {{lastname}}";

    title = title.replace(/{{firstname}}/g, FirstName).replace(/{{lastname}}/g, LastName);
    subtitle = subtitle.replace(/{{firstname}}/g, FirstName).replace(/{{lastname}}/g, LastName);
    myLogger.log('title:==>'+title);   
    myLogger.log('subtitle:==>'+subtitle);   

  });

  app.post('/activity/execute',function(req,res){ 
    console.log('Request.body');
    console.log(req.body);  

    var page_scope_id = req.body.inArguments[0].contactKey;
    var FirstName = req.body.inArguments[0].FirstName;
    var LastName = req.body.inArguments[0].LastName ?? "";
    var title = req.body.inArguments[0].title;
    var image_url = req.body.inArguments[0].image_url; 
    var subtitle = req.body.inArguments[0].subtitle;

    var btn_type = req.body.inArguments[0].btn_type
    var btn_title = req.body.inArguments[0].btn_title
    var btn_url = req.body.inArguments[0].btn_url

    var btn_type_2 = req.body.inArguments[0].btn_type_2
    var btn_title_2 = req.body.inArguments[0].btn_title_2
    var btn_url_2 = req.body.inArguments[0].btn_url_2

    var btn_type_3 = req.body.inArguments[0].btn_type_3
    var btn_title_3 = req.body.inArguments[0].btn_title_3
    var btn_url_3 = req.body.inArguments[0].btn_url_3 
     
    title = title.replace('{firstname}', FirstName).replace('{lastname}', LastName);
    subtitle = subtitle.replace('{firstname}', FirstName).replace('{lastname}', LastName);

    myLogger.log('FirstName:==>'+FirstName);   
    myLogger.log('LastName:==>'+LastName); 

    myLogger.log('title:==>'+title);   
    myLogger.log('subtitle:==>'+subtitle);   

    var buttons = [];

    /*
    // Dev
    var sfmc_token_url = 'https://mcb0skqwnkf9343phk26n669jyz0.auth.marketingcloudapis.com/v2/token';
    var sfmc_api_url = "https://mcb0skqwnkf9343phk26n669jyz0.rest.marketingcloudapis.com//data/v1/async/dataextensions/key:7E6A8023-BDD2-4210-9672-1B79FF5C4ED7/rows";

    var sfmc_client_id = 'ws49hfw3pzplbc3j3je57tzh';
    var sfmc_client_secret = 'rQwSw5AxMqAtKWUCPCGrUt7q';*/

    var sfmc_token_url = 'https://mc6wxn2zsdzvghl9965pvsq8n3d4.auth.marketingcloudapis.com/v2/token';
    var sfmc_api_url = "https://mc6wxn2zsdzvghl9965pvsq8n3d4.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:BDABB975-396E-4EA6-8ED9-77A0CF731ECA/rows";

    var sfmc_client_id = 'p81uasn9f3c5gzqc89vla0me';
    var sfmc_client_secret = 'XbiM1eQRDYv0lK5iyZYqY1gq';
 
    if(btn_type == "web_url"){
      buttons.push(
        {
          "type": btn_type,
          "url": btn_url,
          "title": btn_title
      }
      );
    }else if(btn_type == "phone_number"){
      buttons.push(
        {
          "type": btn_type,
          "payload": btn_url,
          "title": btn_title
      }
      );
    }else if(btn_type == "account_link"){
      buttons.push(
        {
          "type": btn_type,
          "url": btn_url
        }
      );
    } 

    if( typeof btn_type_2 !== 'undefined' && typeof btn_title_2 !== 'undefined' && typeof  btn_url_2 !== 'undefined' && btn_type_2 !== "" && btn_title_2 !== "" && btn_url_2 !== ""){

      if(btn_type_2 == "web_url"){
        buttons.push(
          {
            "type": btn_type_2,
            "url": btn_url_2,
            "title": btn_title_2
        }
        );
      }else if(btn_type_2 == "phone_number"){
        buttons.push(
          {
            "type": btn_type_2,
            "payload": btn_url_2,
            "title": btn_title_2
        }
        );
      }else if(btn_type_2 == "account_link"){
        buttons.push(
          {
            "type": btn_type_2,
            "url": btn_url_2
          }
        );
      }
      
    }
    if(typeof btn_type_3 !== 'undefined' && typeof btn_title_3 !== 'undefined' && typeof  btn_url_3 !== 'undefined' && btn_type_3 !== "" && btn_title_3 !== "" && btn_url_3 !== ""){
      
      if(btn_type_3 == "web_url"){
        buttons.push(
          {
            "type": btn_type_3,
            "url": btn_url_3,
            "title": btn_title_3
        }
        );
      }else if(btn_type_3 == "phone_number"){
        buttons.push(
          {
            "type": btn_type_3,
            "payload": btn_url_3,
            "title": btn_title_3
        }
        );
      }else if(btn_type_3 == "account_link"){
        buttons.push(
          {
            "type": btn_type_3,
            "url": btn_url_3
          }
        );
      }


    }
    myLogger.log('buttons:==>'+JSON.stringify(buttons));   

    try {

    const options = {
      method: 'POST',
      url: 'https://bulletinboard.verticurl.com/vclorealpoc/store.php',
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      body: {
        request_id: page_scope_id,
        template_type: 'generic',
        elements: [
          {
              "title": title,
              "image_url": image_url,
              "subtitle": subtitle,
              "default_action": {
                  "type": btn_type,
                  "url": btn_url,
                  "webview_height_ratio": "tall"
              },
              "buttons": buttons
           }
      ]  
      },
    };
   myLogger.log(JSON.stringify(options));   
    request(options, (error, response, body) => {
      if (error) {
        myLogger.log('Error:==>'+error);   
      } else {
     //   myLogger.log('response:==>'+JSON.stringify(response));
      //  myLogger.log('body:==>'+JSON.stringify(body));

        const fb_msg = {
          method: 'POST',
          url: 'https://bulletinboard.verticurl.com/vclorealpoc/sendmsg.php',
          headers: {
            'Content-Type': 'application/json',
          },
          json: true,
          
          body: {
            "request_id": page_scope_id,
            "recipient_id": page_scope_id
          },
        };

        request(fb_msg, (fb_msg_error, fb_msg_response, fb_msg_body) => {
          if (fb_msg_error) {
            myLogger.log('Error:==>'+fb_msg_error);   
          } else {
            myLogger.log('response:==>'+JSON.stringify(fb_msg_response));


            const sfmc_options = {
              method: 'POST',
              url: sfmc_token_url,
              headers: {
                'Content-Type': 'application/json',
              },
              json: true,
              body: {
                grant_type: 'client_credentials',
                client_id: sfmc_client_id,
                client_secret: sfmc_client_secret,
              },
            };
            request(sfmc_options, (sfmc_token_error, sfmc_response, sfmc_body) => {
              if (sfmc_token_error) {
                myLogger.log('Error:==>'+sfmc_token_error);   
              } else {
                myLogger.log('response:==>'+JSON.stringify(sfmc_response));

                var txtMsgReqData = {
                  items: [
                            { page_scope_id: page_scope_id,
                              MessageTitle: "fb_msg",
                              TemplateType: "",
                              Message: fb_msg_body.message.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '') ?? "",
                              MessageID: fb_msg_body.data.request_id ?? "",
                              Status: fb_msg_body.success
                            }
                        ]
                  };

                  myLogger.log('items:==>'+JSON.stringify(txtMsgReqData));
                const journeyoptions = {
                  method: 'POST',
                  url: sfmc_api_url,
                  headers: {
                    'Content-Type': 'application/json',
                    'cache-control': 'no-cache',
                    'Authorization': 'Bearer '+sfmc_body.access_token,
                  },
                  json: true,
                  body: txtMsgReqData
                };

                myLogger.log('response:==>'+JSON.stringify(journeyoptions));

               request(journeyoptions, (sfmc_error, j_response, j_body) => {
                  if (error) {
                    myLogger.log('Error:==>'+sfmc_error);   
                  } else {
                    myLogger.log('response:==>'+JSON.stringify(j_response));
                    myLogger.log('j_body:==>'+JSON.stringify(j_body));
                    
                  }
                });  
                
              }
            });
           
          }
        });

      }
    });




   // myLogger.log(JSON.stringify(req.body.inArguments[0]));  
   // myLogger.log(page_scope_id);  
   // myLogger.log(FirstName);  
    res.status(200).json({ message: 'Event received successfully' });

  } catch (error) {
    myLogger.log('catch error:==>'+error); 
  }

  });
  app.post(/\/activity\/(save|publish|validate)/, (req, res) => {
      console.log('Request.body'); 
		return res.status(200).json({success: req.body});
}); 
  app.listen(process.env.port || 3000);
   
  console.log('Running at Port 3000');