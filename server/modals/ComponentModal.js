var {Schema, model} = require('mongoose');

var ComponentSchema = new Schema({
    name: {type: String},
    entity_id: {type: String, unique: true, required: true},
    type: {type: String},
    sub_type: {type: String},
    block: {type: String, required: true},
    state: {type: String}
});  

var Component = model("Component", ComponentSchema, "Components");
module.exports = Component;