/**
 * This file contains all the helper methods that will
 * be used across the lambda code. You can add any more
 * utility functions to this file based on your business logic.
 * 
 */


/**
 * Constant for all the states the Lex bot can have.
 * You dont need to add anything to this constant till the 
 * time Amazon adds a new state in future.
 */
const State = {
  IN_PROGRESS: "InProgress",
  FULFILLED: "Fulfilled",
  FAILED: "Failed",
  READY_FOR_FULFILLMENT: "ReadyForFulfillment",
  WAITING: "Waiting",
  FULFILLMENT_IN_PROGRESS: "FulfillmentInProgress"
};
/**
 * Currently there are the only 3 ways we can invoke
 * Lex bot from any channel.
 */
const Mode = {
    TEXT: "Text",
    SPEECH: "SPEECH",
    DTMF: "DTMF"
}
/**
 * The different actions that can be returned by Lambda to Lex.
 * You need not to add any more till the time Amazon add a new
 * Action.
 */
const DialogAction = {
  ELICIT_SLOT: "ElicitSlot",
  ELICIT_INTENT: "ElicitIntent",
  CONFIRM_INTENT: "ConfirmIntent",
  DELEGATE: "Delegate",
  CLOSE: "Close",
};
/**
 * Lex can talk to Lambda only from these hook i.e.
 * a. For validation and Initization of the slot and
 * b. for fulfillment
 */
const InvocationSource = {
  INITIALIZATION_AND_VALIDATION: "DialogCodeHook",
  FULFILLMENT: "FulfillmentCodeHook",
};
/**
 * All the formats that Lex supports for sending the 
 * messages. 
 */
const ContentType ={
    PLAIN_TEXT: "PlainText",
    IMAGE_RESPONSE_CARD: "ImageResponseCard",
    CUSTOM_PAYLOAD: "CustomPayload",
    SSML: "SSML"
}
/**
 * Grow this constants list will any new intent we add.
 * You should not be hardcoding any of the intent names
 * anywhere else in the code. Use this constant instead.
 */
const Intent = {
  WELCOME: "Welcome",
  FALLBACK: "FallbackIntent"
}

/**
 * Helper method for indicating lex to prompt the user to
 * fetch value for the specific slot. You should call this method 
 * during the validtion and Initilization phase. 
 * 
 * @param {object} intent_request The original event data as passed from Lex
 * @param {string} slotToElicit The name of the slot that Lex should
 *                              prompt the user for.
 * @param {object} session_attributes The updated session values
 * @param {Array} messages The final message to be prompted to the user for
 *                         the slotToElicit.
 * @returns object data with the format the Lex can interpret.
 */
const elicit_slot = (intent_request, slotToElicit, session_attributes, messages) => {
  intent_request.sessionState.intent.state = State.IN_PROGRESS;

  return {
    sessionState: {
      sessionAttributes: session_attributes,
      dialogAction: {
        type: DialogAction.ELICIT_SLOT,
        slotToElicit: slotToElicit,
      },
      intent: intent_request.sessionState.intent,
    },
    requestAttributes: intent_request.requestAttributes,
    sessionId: intent_request.sessionId,
    messages: messages,
  };
};
/**
 * Helper method indicating that the bot to determined the user's 
 * intent.
 * 
 * @param {object} intent_request The original event data as passed from Lex
 * @param {object} session_attributes The updated session values
 * @param {Array} messages The final message to be prompted to the user 
 * @returns object data with the format the Lex can interpret.
 */
const elicit_intent = (intent_request, session_attributes, messages) => {
  intent_request.sessionState.intent.state = State.FULFILLED;

  return {
    sessionState: {
      sessionAttributes: session_attributes,
      dialogAction: {
        type: DialogAction.ELICIT_INTENT,
      },
      state: State.FULFILLED,
    },
    requestAttributes: intent_request.requestAttributes,
    sessionId: intent_request.sessionId,
    messages: messages,
  };
};
/**
 * Helper method indicating that the bot to wait for the user to confirm
 * that the collected infromation is correct.
 * 
 * @param {object} intent_request The original event data as passed from Lex
 * @param {object} session_attributes The updated session values
 * @param {Array} messages The final message to be prompted to the user 
 * @returns object data with the format the Lex can interpret.
 */
const confirm_intent = (intent_request, session_attributes, messages) => {
  intent_request.sessionState.intent.state = State.IN_PROGRESS;

  return {
    sessionState: {
      sessionAttributes: session_attributes,
      dialogAction: {
        type: DialogAction.CONFIRM_INTENT,
      },
      intent: intent_request.sessionState.intent,
    },
    requestAttributes: intent_request.requestAttributes,
    sessionId: intent_request.sessionId,
    messages: messages,
  };
};
/**
 * Helper method indicating that the next action has to be determined by 
 * Lex.
 * 
 * @param {object} intent_request The original event data as passed from Lex
 * @param {object} session_attributes The updated session values
 * @param {Array} messages The final message to be prompted to the user 
 * @returns object data with the format the Lex can interpret.
 */
const delegate = (intent_request, session_attributes) => {
  return {
    sessionState: {
      sessionAttributes: session_attributes,
      dialogAction: {
        type: DialogAction.DELEGATE,
      },
      intent: intent_request.sessionState.intent,
      state: State.READY_FOR_FULFILLMENT,
    },
    requestAttributes: intent_request.requestAttributes,
    sessionId: intent_request.sessionId,
  };
};
/**
 * Helper method indicating that the conversation has reached a 
 * locagical end.
 * 
 * @param {object} intent_request The original event data as passed from Lex
 * @param {object} session_attributes The updated session values
 * @param {Array} messages The final message to be prompted to the user 
 * @returns object data with the format the Lex can interpret.
 */
const close = (intent_request, session_attributes, messages) => {
  intent_request.sessionState.intent.state = State.FULFILLED;

  return {
    sessionState: {
      sessionAttributes: session_attributes,
      dialogAction: {
        type: DialogAction.CLOSE,
      },
      intent: intent_request.sessionState.intent,
    },
    requestAttributes: intent_request.requestAttributes,
    sessionId: intent_request.sessionId,
    messages: messages,
  };
};
/**
 * Helper method to determine the action due to which the lambda function
 * is called from lex. 
 * 
 * @param {object} intent_request The original event data as passed from Lex
 * @returns a string value that can be either FulfillmentCodeHook or 
 *          DialogCodeHook
 */
const get_invocation_source = (intent_request) => {
  return intent_request.invocationSource;
};
/**
 * Helper method to determine the name of the intent that is currently
 * being processed by lex. 
 * 
 * @param {object} intent_request The original event data as passed from Lex
 * @returns a string value that contains the name of the current intent
 */
const get_intent_name = (intent_request) => {
  return intent_request.sessionState.intent.name;
};
/**
 * Helper method to determine the name of the intent that is considered
 * the best match based on the user response. 
 * 
 * @param {object} intent_request The original event data as passed from Lex
 * @returns an object that contains the details about the intent that has been 
 *          intepreted by Lex. 
 */
const get_intent = (intent_request) => {
  if (intent_request.interpretations.length > 0)
    return intent_request.interpretations[0].intent;
  return null;
};
/**
 * Helper method to fetch all the session values. In case its not
 * set, the method returns an empty object 
 * 
 * @param {object} intent_request The original event data as passed from Lex
 * @returns an object with the set of values in session. 
 */
const get_session_attributes = (intent_request) => {
  return intent_request.sessionState.sessionAttributes || {};
};
/**
 * Helper method to fetch an Array of all the slots for the current intent. 
 * 
 * @param {object} intent_request The original event data as passed from Lex
 * @returns an Array of objects with all the slots. 
 */
const get_slots = (intent_request) => {
  return intent_request.sessionState.intent.slots;
};
/**
 * Helper method to fetch the interpreted value for a particulat slot.
 * You can change it to original or resolved value if your use case
 * requires. In most cases, it is the interpretedValue. 
 * 
 * @param {object} intent_request The original event data as passed from Lex
 * @param {string} slot_name The name of the slot for which the value is to
 *                            be determined 
 * @returns a string with the interpreted value. 
 */
const get_slot = (intent_request, slot_name) => {
  const slots = get_slots(intent_request);

  if (slots && slots[slot_name]) {
    const slotvalue = slots[slot_name]["value"];
    if (slotvalue) return slotvalue.interpretedValue || null;
  }
  return null;
};
/**
 * Helper method to forcibly set the slot values.  
 * 
 * @param {object} intent_request The original event data as passed from Lex
 * @param {string} slot_name The name of the slot for which the value is to
 *                            be set/reset
 * @param {string} slot_value The value to be set for the slot_name 
 * @returns void. 
 */
const set_slot = (intent_request, slot_name, slot_value) =>{
  if(slot_value){
    intent_request.sessionState.intent.slots[slot_name] = {
      value: {
        interpretedValue: slot_value,
        originalValue: slot_value,
        resolvedValues: [
          slot_value
        ]
      }
    }
  }
  else
    intent_request.sessionState.intent.slots[slot_name] = null;
}
/**
 * Helper method that is repsonsible for building dynamic messages.
 * Any message with placeholders like {0} {1} ... will be replaced by
 * the actual values that are passed in args in that sequence i.e.
 * {0} will be replaced by args[0], {1} with args[1] etc
 * 
 * @param {any} message Either string or JSON message that needs to
 *                      be formatted.
 * @param  {...any} args all arguments that will contain actual values for
 *                        the palceholders.
 * @returns JSON or string based on iput data. This contains the final
 *          message after the placeholders ar ereplaced with actual values.
 */
const stringFormatter = (message,...args) =>{
    let formattedMessage = message;
    let isObjectdata = (typeof formattedMessage === "object");

    formattedMessage =  isObjectdata? JSON.stringify(formattedMessage): formattedMessage;

    for(var index in args){
        formattedMessage = formattedMessage.replace(`{${index}}`, args[index]);
    }
    return isObjectdata? JSON.parse(formattedMessage): formattedMessage;
}
/**
 * 
 * @param {object} messages The JSON which contain all the messages for the intent
 * @param {string} type The main key under which all the messages exist
 * @param {string} key The key under the main "type" which contains the message
 * @param {number} index This is the retry count. based on count, fetch 
 *                        that variation of the message.
 * @returns an object of the fetched message
 */
const fetchMessage = (messages, type, key, index)=>{
    
    if(messages[type] && messages[type][key]){
        const message = messages[type][key].filter(
            (m) => m.order === index
          );
          if(message.length > 0) return message[0];
          return messages[type][key].pop();
    }
    return null;
}
module.exports  = {
  elicit_slot,
  elicit_intent,
  confirm_intent,
  delegate,
  close,
  get_invocation_source,
  get_intent_name,
  get_intent,
  get_session_attributes,
  get_slots,
  get_slot,
  stringFormatter,
  fetchMessage,
  set_slot,
  InvocationSource,
  Intent
};
