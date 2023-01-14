// Import the mongoose module
const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
    ticker:
    {
        type: String,
        uppercase: true,
        required: [true, "Ticket required"]
    },
    returnCash: Number,
    returnPercent: mongoose.Decimal128,
    bought: { type: Date, default: Date.now },
    sold: { type: Date, default: Date.now },
    setups: [String],
    cost: Number,
    mistakes: [String],
    note: String,
    id: Schema.Types.ObjectId,
    virtuals: {
        holdDate:  {
            get() {
                return Math.round((this.sold - this.bought) / (1000 * 60 * 60 * 24));
            }
        }
    }
});

module.exports = mongoose.model("Trade", TradeSchema);
