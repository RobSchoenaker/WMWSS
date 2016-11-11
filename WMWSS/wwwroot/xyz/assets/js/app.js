require([
], function () {
  "use strict";

  // Initialize the validation
  var koValDefaults = {
    registerExtenders: true,
    messagesOnModified: true,
    errorsAsTitle: false,            // enables/disables showing of errors as title attribute of the target element.
    errorsAsTitleOnModified: false, // shows the error when hovering the input field (decorateElement must be true)
    messageTemplate: null,
    insertMessages: true,           // automatically inserts validation messages as <span></span>
    parseInputAttributes: false,    // parses the HTML5 validation attribute from a form element and adds that to the object
    writeInputAttributes: false,    // adds HTML5 input validation attributes to form elements that ko observable's are bound to
    decorateInputElement: true,         // false to keep backward compatibility
    decorateElementOnModified: true,// true to keep backward compatibility
    errorClass: 'state-error',               // single class for error message and element
    errorElementClass: 'state-error',  // class to decorate error element
    errorMessageClass: 'field-validation-error',  // class to decorate error message
    allowHtmlMessages: true,		// allows HTML in validation messages
    grouping: {
      deep: false,        //by default grouping is shallow
      observable: true,   //and using observables
      live: false		    //react to changes to observableArrays if observable === true
    },
    validate: {
      // throttle: 10
    }
  };
  ko.validation.init(koValDefaults, true);
})