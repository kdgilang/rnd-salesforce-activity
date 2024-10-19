define(["postmonger"], function (Postmonger) {
  "use strict";

  var connection = new Postmonger.Session();
  var payload = {};
  var lastStepEnabled = false;
  var eventDefinitionKey;
  var steps = [
    // initialize to the same value as what's set in config.json for consistency
    { label: "Step 1", key: "step1" },
    { label: "Step 2", key: "step2" },
    { label: "Step 3", key: "step3" , active: false },
    { label: "Step 4", key: "step4", active: false },
  ];
  var currentStep = steps[0].key;

  $(window).ready(onRender);

  connection.on("initActivity", initialize);
  connection.on("requestedTokens", onGetTokens);
  connection.on("requestedEndpoints", onGetEndpoints);

  connection.on("clickedNext", onClickedNext);
  connection.on("clickedBack", onClickedBack);
  connection.on("gotoStep", onGotoStep);

  connection.trigger('requestTriggerEventDefinition');
   
   connection.on('requestedTriggerEventDefinition',
  function(eventDefinitionModel) {
      if(eventDefinitionModel){
  
          eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
          console.log(">>>Event Definition Key " + eventDefinitionKey); 
      }
  
  });

  connection.on('requestedSchema', function (data) {    //CONNECTION ON
    // save schema
   // console.log('*** Schema ***', JSON.stringify(data['schema']));
   // let schema = JSON.stringify(data['schema']);
});

  function onRender() {
    // JB will respond the first time 'ready' is called with 'initActivity'
    connection.trigger("ready");

    connection.trigger("requestTokens");
    connection.trigger("requestEndpoints");

    // Disable the next button if a value isn't selected
    $("#select1").change(function () {
      var message = getMessage();
      connection.trigger("updateButton", {
        button: "next",
        enabled: Boolean(message),
      });

      $("#message").html(message);
    });

    // Toggle step 4 active/inactive
    // If inactive, wizard hides it and skips over it during navigation
    $("#toggleLastStep").click(function () {
      lastStepEnabled = !lastStepEnabled; // toggle status
      steps[3].active = !steps[3].active; // toggle active

      connection.trigger("updateSteps", steps);
    });
  }

  function initialize(data) {
    if (data) {
      payload = data;
    }

    var message;
    var hasInArguments = Boolean(
      payload["arguments"] &&
        payload["arguments"].execute &&
        payload["arguments"].execute.inArguments &&
        payload["arguments"].execute.inArguments.length > 0
    );

    var inArguments = hasInArguments
      ? payload["arguments"].execute.inArguments
      : {}; 
  
    $.each(inArguments, function (index, inArgument) {
      $.each(inArgument, function (key, val) {
        if (key === "message") {
          message = val;
        } 
      });
    });

    // If there is no message selected, disable the next button
    if (!message) {
      showStep(null, 1);
      connection.trigger("updateButton", { button: "next", enabled: false });
      // If there is a message, skip to the summary step
    } else {
      $("#select1")
        .find("option[value=" + message + "]")
        .attr("selected", "selected");
        
      //$("#message").html(message);
      
      $("#title").val(inArguments[0].title);
      $("#image_url").val(inArguments[0].image_url);
      $("#subtitle").val(inArguments[0].subtitle);  

      $("#btn_type")
      .find("option[value=" + inArguments[0].btn_type + "]")
      .attr("selected", "selected");

      $("#btn_title").val(inArguments[0].btn_title); 
      $("#btn_url").val(inArguments[0].btn_url); 


      if(typeof inArguments[0].btn_type_2 !== 'undefined'  && inArguments[0].btn_type_2 !== '' && inArguments[0].btn_url_2 !== ''){  
        console.log("r");
        $(".addMore").click();  

        $("#btn_type_1")
      .find("option[value=" + inArguments[0].btn_type_2 + "]" )
      .attr("selected", "selected"); 
        $("#btn_title_1").val(inArguments[0].btn_title_2); 
        $("#btn_url_1").val(inArguments[0].btn_url_2); 
      } 

      if(typeof inArguments[0].btn_type_3 !== 'undefined' && inArguments[0].btn_type_3 !== '' && inArguments[0].btn_url_3 !== ''){ 
        console.log("ds");
        $(".addMore").click();
        $("#btn_type_2")
        .find("option[value=" + inArguments[0].btn_type_3 + "]")
        .attr("selected", "selected");  
        $("#btn_title_2").val(inArguments[0].btn_title_3); 
        $("#btn_url_2").val(inArguments[0].btn_url_3); 
      }
      
      showStep(null, 1);
    }
  }

  function onGetTokens(tokens) {
    // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
    // console.log(tokens);
  }

  function onGetEndpoints(endpoints) {
    // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
    // console.log(endpoints);
  }

  function onClickedNext() {
    console.log(currentStep.key);
    /*if (
      (currentStep.key === "step3" && steps[3].active === false) ||
      currentStep.key === "step4"
    )*/ 
    if(currentStep.key === "step2" )
    {
      if ($('#fb_id').valid()) {
        save();
      }else{
        connection.trigger("ready");
      }
    } else {
      console.log("22");
      connection.trigger("nextStep");
    }
  }

  function onClickedBack() {
    connection.trigger("prevStep");
  }

  function onGotoStep(step) {
    showStep(step);
    connection.trigger("ready");
  }

  function showStep(step, stepIndex) {
    if (stepIndex && !step) {
      step = steps[stepIndex - 1];
    }

    currentStep = step; 
    $(".step").hide();

    switch (currentStep.key) {
      case "step1":
        $("#step1").show();
        connection.trigger("updateButton", {
          button: "next",
          enabled: Boolean(getMessage()),
        });
        connection.trigger("updateButton", {
          button: "back",
          visible: false,
        });
        break;
      case "step2":
        $("#step2").show();
        connection.trigger("updateButton", {
          button: "back",
          visible: true, 
        });
        connection.trigger("updateButton", {
          button: "next",
          text: "next",
          visible: true,
        });
        break;
      case "step3":
        $("#step3").show();
        connection.trigger("updateButton", {
          button: "back",
          visible: true,
        });
        if (lastStepEnabled) {
          connection.trigger("updateButton", {
            button: "next",
            text: "next",
            visible: true,
          });
        } else {
          connection.trigger("updateButton", {
            button: "next",
            text: "done",
            visible: true,
          });
        }
        break;
      case "step4":
        $("#step4").show();
        break;
    }
  }

  function save() { 
    var name = $("#select1").find("option:selected").html();
    var value = getMessage();
    var template = getTemplateDetails();
    console.log(JSON.stringify(template));
    // 'payload' is initialized on 'initActivity' above.
    // Journey Builder sends an initial payload with defaults
    // set by this activity's config.json file.  Any property
    // may be overridden as desired.
    payload.name = name;

    payload["arguments"].execute.inArguments = [{ message: value,
      title : template.title,
      image_url : template.image_url,
      subtitle : template.subtitle,

      btn_type : template.btn_type_0,
      btn_title : template.btn_title_0,
      btn_url : template.btn_url_0,
      
      btn_type_2 : template.btn_type_1,
      btn_title_2 : template.btn_title_1,
      btn_url_2 : template.btn_url_1,
      
      btn_type_3 : template.btn_type_2,
      btn_title_3 : template.btn_title_2,
      btn_url_3 : template.btn_url_2,

      contactKey: "{{Contact.Key}}",
      FirstName: "{{Event."+ eventDefinitionKey +".FirstName}}",
      LastName: "{{Event."+ eventDefinitionKey +".LastName}}"

    }];
    payload["arguments"].execute.outArguments =[];
    payload["metaData"].isConfigured = true;
    console.log(JSON.stringify(payload));
    connection.trigger("updateActivity", payload);
  }

  function getMessage() {
    return $("#select1").find("option:selected").attr("value").trim();
  }
  function getTemplateDetails() {
    var params = {};
    params['title']= $("#title").val();
    params['image_url']= $("#image_url").val();
    params['subtitle'] = $("#subtitle").val(); 

    $("select[name='btn_type[]']").each(function (index, item) {
      console.log(index);
      params['btn_type_'+ index]  = $(item).val();
    });
    $("input[name='btn_url[]']").each(function (index, item) {
      params['btn_url_'+ index]  = $(item).val();
    });
    $("input[name='btn_title[]']").each(function (index, item) {
      params['btn_title_'+ index]  = $(item).val();
    });  

    return params;
  }
});