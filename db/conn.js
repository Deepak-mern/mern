const mongoose =require('mongoose')

const DB = process.env.DATABASE;
const PORT = process.env.PORT;


mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => {
    console.log(`connection Sucessful`);
}).catch((err)=> console.log(`no connection`))
