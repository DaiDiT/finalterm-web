const mongoose = require('mongoose')
mongoose.connect(process.env.DB_HOST).then(() => {
    console.log("Mongodb connected");
}).catch((err) => {
    console.log({ err });
    process.exit(1);
});