"use strict";
const { get_intent_name, Intent } = require("./lex_utils");
const { welcomeHandler } = require("./welcome");
const { fallbackHandler } = require ("./fallback");

/**
 * Entry point for the Lambda function. Under runtime settings,
 * change the pointer in the handler to "index.handler" to point to this file.
 *  
 * @param {object} event the event data as posted by Lex
 * @param {object} context the context object
 * @param {object} callback the callback function to be called when the
 *                          execution is complete.
 */
exports.handler = (event, context, callback) => {
  try {
    dispatch(event, (response) => {
      callback(null, response);
    });
  } catch (err) {
    callback(err);
  }
};
/**
 * This function follows a pattern. Everytime you create a new intent,
 * add it to the if clause. For every new intent, create a const in "Intent",
 * under the lex_utils file. No other change should be built into this function.
 *     
 * @param {object} intentRequest the entire event data as passed by Lex
 * @param {object} callback the callback function to be called once the
 *                          processing is complete
 * @returns The final response, after the intent validation/fulfillment
 *          business logic execution 
 */
function dispatch(intentRequest, callback) {
  const intent_name = get_intent_name(intentRequest);
  console.log(`bot.name=${intentRequest.bot.name}`);
  console.log(`intent=${intent_name}`);

  if (intent_name === Intent.WELCOME) return welcomeHandler(intentRequest, callback);

  if (intent_name === Intent.FALLBACK) return fallbackHandler(intentRequest, callback);

  throw new Error(`Intent with name ${intent_name} not supported`);
}
