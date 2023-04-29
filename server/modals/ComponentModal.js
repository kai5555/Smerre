const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema
const SchemaTypes = mongoose.Schema.Types;

var ComponentSchema = new Schema({
    name: {type: String},
    entity_id: {type: String, unique: true, required: true},
    type: {type: String},
    block: {type: Number, required: true},
});  

module.exports = mongoose.model("Component", ComponentSchema, "Components");