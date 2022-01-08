const {
  get_session_attributes,
  get_invocation_source,
  delegate,
  elicit_intent,
  InvocationSource,
  fetchMessage,
} = require("./lex_utils");

const { messages } = require("./messages/fallback");
/**
 * TODO: Add the keys for any message types that
 * we would use for this intent
 */
const MessageType = {
  INTENTS: "intents",
  DEFAULT: "FallbackIntent",
};

/** 
  * This function is the entry point for this intent. 
  * You may not need to modify this method. Aviod putting 
  * any business logic here. All validation and initialization
  * logic should be placed in the  "validateAndinitializationData"
  * method and logic related to Fulfillment should be placed in the
  * "fulfillment" method.  
  * Currently these are the only two scenarios under which Lex calls
  * Lambda. 
  * 
  * @param    {object} intent_request   the entire request object from Lex 
  * @param    {object} callback         a callback function to be called 
  *                                     once the processing is complete  
  * @returns  {object}                  Response to Lex with updated 
  *                                     slot values/validation messages
*/
const handler = (intent_request, callback) => {
  const source = get_invocation_source(intent_request);

  if (source === InvocationSource.INITIALIZATION_AND_VALIDATION) {
    callback(validateAndinitializationData(intent_request));
    return;
  }
  if (source === InvocationSource.FULFILLMENT) {
    callback(fulfillment(intent_request));
    return;
  }
  //this will never happen since there are only 2 points in Lex for Lambda invocation.
  //keeping this just for completeness sake.
  callback(delegate(intent_request, get_session_attributes(intent_request)));
  return;
};
/** 
  * This function should contain logic related to 
  * slot data validation and/or
  * slot data initialization.
  * If neither of this is applicable, return the 
  * dialog action as "Delegate" (call method delegate from lex_utils.js) 
  * 
  * @param    {object} intent_request   the entire request object from Lex  
  * @returns  {object}                  Response to Lex with updated 
  *                                     slot values/validation messages
*/
const validateAndinitializationData = (intent_request) => {
  const sessionAttributes = get_session_attributes(intent_request);
  
  return delegate(intent_request, sessionAttributes);
};
/** 
  * This function should contain logic related to 
  * fulfilment of this intent. This function may also contain
  * confirmation prompts. The "accept" and "denied" scnearios
  * need to be handled here.  
  *    
  * @param    {object} intent_request   the entire request object from Lex  
  * @returns  {object}                  Response to Lex with updated 
  *                                     fulfillment message
*/
const fulfillment = (intent_request) => {
  const sessionAttributes = get_session_attributes(intent_request);
  
  let intent = sessionAttributes.currentIntent || MessageType.DEFAULT;

  let message = fetchMessage(messages, MessageType.INTENTS, intent, 1);

  return elicit_intent(intent_request, sessionAttributes, [message.message]);
};
module.exports = {
  fallbackHandler: handler,
};
