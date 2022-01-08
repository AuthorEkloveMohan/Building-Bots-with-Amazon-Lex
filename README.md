# Building-Bots-with-Amazon-Lex
The repository contains the starter code for Amazon Lex v2 Lambda function. The code here can be used as a template for building bots using Amazon Lex. This code is part of the course "Building Bots with Amazon Lex" from Apress. 

This template contains follwing files:
<ul>
  <li> <a href="index.js">index.js</a>- This is the entry point for the lambda function. </li>
  <li> <a href="lex_utils.js">lex_utils.js</a> - Helper function for Amazon Lex V2.</li>
  <li> <a href="welcome.js">welcome.js</a> - this is a dummy intent for the bot. You can delete it or modify it based on your requirements. The template inside this file can be used for any new intent you created. This file contains 3 function:
    <ul>
  <li>handler - entry point to this intent and it calls two function based on the invocation source from Lex.</li>
      <li>validateAndinitializationData - This function wil be called when Lambda is processing the "DialogCodeHook" from Lex </li>
      <li>fulfillment - This function wil be called when Lambda is processing the "FulfillmentCodeHook" from Lex 
    </ul>
  </li>
  <li><a href="fallback.js">fallback.js</a> - Code for the fallback intent. This will generate a fallback message based on the last intent the user was working on.</li>
  <li><a href="messages/welcome.js">messages/welcome.js</a> - This file contains all the prompt messages that will be used during the execution of welcome intent.</li>
  <li><a href="messages/fallback.js">messages/fallback.js</a> - This file contains all the prompt messages that will be used during the execution of fallback intent.</li>
<ul>
