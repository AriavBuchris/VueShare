// import apollo server for integrating graphQL 
const { ApolloServer, AuthenticationError } = require('apollo-server');

// import a mongoDB client
const mongoose = require('mongoose');

// for importing file from file system
const fs = require('fs'); 
const path = require('path'); 
const filePath = path.join(__dirname, 'typeDefs.gql');

// for using json web token
const jwt = require('jsonwebtoken');

// apollo server requires schema / typeDefs read by file sync 
const typeDefs = fs.readFileSync(filePath, 'utf-8');

// tell apollo server how to resolve queries and mutations
const resolvers = require('./resolvers');

// access all environment variables defined in file path privatly through process.env
require('dotenv').config({ path: 'variables.env' });

// models for apollo server context
const User = require('./models/User');
const Post = require('./models/Post');

// connect to mLab database
mongoose
    .connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    .then(console.log("DB connected"))
    .catch(err => console.error(err));

// verify JWT passed from client
const getUser = async token => {
    if (token) {
        try {
            return await jwt.verify(token, process.env.SECRET);
        } catch (err) {
            throw new AuthenticationError('Your session has ended, please signin again.');
        }
    }
}
// create apollo server for our graphql backend
const server =  new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => ({ 
        name: error.name, 
        message: error.message.replace("Context creation failed:", "") 
    }),
    context: async ({ req }) => {
        const token = req.headers["authorization"];
        return { User, Post, currentUser: await getUser(token) };
    }
});

// graphql playground runs on port 4000 by default
server.listen().then(( {url} ) => {
    console.log(`Server listening on ${url}`);
});