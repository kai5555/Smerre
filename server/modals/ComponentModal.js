const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Component = new Schema({
    type: { type: String, required: true },
    entity_id: { type: String, required: true },
});

module.exports = mongoose.model('component', Component, "Components")