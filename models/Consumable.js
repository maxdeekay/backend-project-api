const mongoose = require("mongoose");

// consumable schema
const consumableSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    ingredients: {
        type: Array,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

// register consumable
consumableSchema.statics.register = async function (title, ingredients, price) {
    try {
        const consumable = new this({ title, ingredients, price });
        await consumable.save();
        return consumable;
    } catch (error) {
        throw error;
    }
}

const Consumable = mongoose.model("Consumable", consumableSchema);
module.exports = Consumable;