//external dependencies
import { ApolloServer } from 'apollo-server-express';
import 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'
import cors from 'cors';

//internal dependencies
import { resolvers } from './schema/resolvers';
import { typeDefs } from './schema/typeDefs';
import { Context } from './Context';
import { refresh, home } from './routes/';

//create apollo express server
async function startApolloServer() {

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: ({ req, res }) => (new Context(req, res))
	});

	await mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
	console.log('📡 Connected To MongoDB!')

	await server.start();
	const app = express();

	app.use(cookieParser())
	app.use(cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	}));

	server.applyMiddleware({ app, path: '/graphql', cors: false });
	console.log('✨ Started Apollo Server!')

	app.get('/', home)

	app.post('/refresh', refresh)

	await new Promise(resolve => app.listen({ port: process.env.PORT }, resolve));
	console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
}

startApolloServer()