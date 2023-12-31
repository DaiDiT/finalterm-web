const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://darrylnwfal:v2H808TyB6C0lnv1@cluster0.ekuav4x.mongodb.net/finalterm').then(() => {
    console.log("Mongodb connected");
}).catch((err) => {
    console.log({ err });
    process.exit(1);
});