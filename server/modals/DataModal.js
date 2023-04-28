const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema
const SchemaTypes = mongoose.Schema.Types;

const Data = new Schema(
    {
        sensor: { type: String, required: true },
        value: { type: SchemaTypes.Double, required: true },
        timestamp: { type: Date, required: true },
    },
)

module.exports = mongoose.model('data', Data, "Data")