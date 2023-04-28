const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema
const SchemaTypes = mongoose.Schema.Types;

const Plant = new Schema(
    {
        name: { type: String, required: true },
        block: { type: Number, required: true },
        description: { type: String },
    },
)

module.exports = mongoose.model('plant', Plant, "Planten")