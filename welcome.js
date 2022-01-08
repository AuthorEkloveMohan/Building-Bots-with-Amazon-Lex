const {
  get_session_attributes,
  get_invocation_source,
  delegate,
  close,
  InvocationSource,
  stringFormatter,
  fetchMessage,
  Intent
} = require("./lex_utils");

const { messages } = require("./messages/welcome");

/**
 * TODO: Add the keys for any message types that
 * we would use for this intent
 */
const MessageType = {
  CLOSING: "closing",
};
/**
 * TO DO: Kept the retry count as constant. In real scenario,
 * this will be a counter that you may want to keep in session
 * attribute to get the current retry count for a slot.
 */
const RETRY_COUNT = 1;

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
  sessionAttributes.currentIntent = Intent.WELCOME;

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
  sessionAttributes.currentIntent = Intent.WELCOME;
  
  return close(intent_request, sessionAttributes, build_closing_message(MessageType.CLOSING, RETRY_COUNT, null));
};
/**
 * Use this method when the message has to be build dynamically.
 * The message will have placeholders like {0} {1}, and this method
 * will help in replacing {0} with the value we pass in args[0], 
 * {1} with args[1] and so on...
 * 
 * @param {string} confirmation_state They key of the message under 
 *                                     messages/intent.js file
 * @param {number} retry_count        The message number which is required
 *                                     to be sent to message. This is similar
 *                                     to the variation message but with more
 *                                     control.   
 * @param  {Array} args                pass all the arguments that will be required
 *                                     to build the dynamic messages. This should 
 *                                     match with the message placeholder count.
 *                                     e.g. if the placeholder has 5 placeholders,
 *                                     i.e. {0},{1},{2},{3},{4} then the args should
 *                                     pass 5 values 
 * @returns                            formatted message that contains the dynamically
 *                                     built message.
 */
const build_closing_message = (confirmation_state, retry_count, ...args) => {
  let message = stringFormatter(
    fetchMessage(messages, MessageType.CLOSING, confirmation_state, retry_count), ...args);
  return [message.message];
};

module.exports = {
  welcomeHandler: handler,
};
