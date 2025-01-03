/**
 * @fileoverview Custom ESLint plugin designed to enforce strict import rules in projects following the Feature-Sliced Design architecture. 
 * @author Vladislav
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + "/rules");



