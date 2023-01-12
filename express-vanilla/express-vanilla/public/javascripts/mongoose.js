// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection
mongoose.connect("mongodb+srv://admin:<password>@cluster0.wbmr3yw.mongodb.net/?retryWrites=true&w=majority");

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define a schema
const Schema = mongoose.Schema;

const tradeSchema = new Schema({
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
    // virtuals: {
    //     holdDate:  {v
    //         get() {
    //             return Math.round((this.sold - this.bought) / (1000 * 60 * 60 * 24));
    //         }
    //     }
    // }
});

// Compile model from schema
const Trade = mongoose.model("Trade", tradeSchema);

const newTrade = new Trade({ ticker: "AAPL", cost: 40, note: "VCP" });
newTrade.save(function (err) {
    if (err) console.log(err);
    // saved!
});

console.log(newTrade.ticker);