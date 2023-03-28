const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema
const SchemaTypes = mongoose.Schema.Types;

const Humidity = new Schema(
    {
        payload: { type: SchemaTypes.Double, required: true },
    },
)

module.exports = mongoose.model('humdity', Humidity, "VochtigheidLucht")