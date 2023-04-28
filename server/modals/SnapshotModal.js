const mongoose = require('mongoose');
require('mongoose-double')(mongoose);

const Schema = mongoose.Schema
const SchemaTypes = mongoose.Schema.Types;

const Snapshot = new Schema(
    {
        image: { type: String, required: true },
        camera: { type: String, required: true },
        timestamp: { type: Date, required: true },
    },
)

module.exports = mongoose.model('snapshot', Snapshot, "Snapshots")