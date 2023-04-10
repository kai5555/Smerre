const { object } = require('joi');
var {Schema, model} = require('mongoose');

var AutomationSchema = new Schema({
    name: {type: String, unique: true, required: true},
    alias: {type: String, required: true},
    lines: {type: Object, required: true},
    boxes: {type: Object, required: true},
    enabled:  {type: Boolean, default: true},
});  

var Automation = model("Automation", AutomationSchema, "Automations");
module.exports = Automation;