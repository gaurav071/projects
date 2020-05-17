import mongoose from 'mongoose';

const dbConfig = {
    dev  : {
        database : 'test-cases-api-dev'
    },
    test : {
        database : 'test-cases-api-test'
    },
};

const { database } = dbConfig[process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'];

mongoose.connect(`mongodb://localhost:32770/${database}`)
    .then(() => console.log('Connected to MongoDB'))
    .catch(() => console.error('MongoDB Connection Error'));

export default mongoose;

