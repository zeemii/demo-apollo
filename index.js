/**
 * @module index
 */

// Importing the necessary modules
import {ApolloServer} from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone";
import {typeDefs} from "./schema.js";
import db from "./_db.js";

/**
 * Resolvers define the technique for fetching the types defined in the schema.
 * This resolver retrieves games, a game by its ID, reviews, a review by its ID, authors, and an author by its ID from the database.
 * It also resolves the relationships between the types.
 */
const resolvers = {
    Query: {
        /**
         * Fetches all games from the database.
         * @returns {Array} An array of all games.
         */
        games () {
            return db.games
        },
        /**
         * Fetches a game by its ID from the database.
         * @param {Object} _ - The parent object, which holds the result of the parent resolver.
         * @param {Object} args - The arguments passed to the function.
         * @returns {Object} The game object.
         */
        game(_, args) {
            return db.games.find(game => game.id === args.id)
        },
        /**
         * Fetches all reviews from the database.
         * @returns {Array} An array of all reviews.
         */
        reviews () {
            return db.reviews
        },
        /**
         * Fetches a review by its ID from the database.
         * @param {Object} _ - The parent object, which holds the result of the parent resolver.
         * @param {Object} args - The arguments passed to the function.
         * @returns {Object} The review object.
         */
        review(_, args) {
            return db.reviews.find(review => review.id === args.id)
        },
        /**
         * Fetches all authors from the database.
         * @returns {Array} An array of all authors.
         */
        authors () {
            return db.authors
        },
        /**
         * Fetches an author by its ID from the database.
         * @param {Object} _ - The parent object, which holds the result of the parent resolver.
         * @param {Object} args - The arguments passed to the function.
         * @returns {Object} The author object.
         */
        author(_, args) {
            return db.authors.find(author => author.id === args.id)
        },
    },
    Game: {
        /**
         * Fetches all reviews for a game from the database.
         * @param {Object} parent - The parent object, which holds the result of the parent resolver.
         * @returns {Array} An array of reviews for the game.
         */
        reviews(parent) {
            return db.reviews.filter((r) => r.game_id === parent.id)
        }
    },
    Author: {
        /**
         * Fetches all reviews by an author from the database.
         * @param {Object} parent - The parent object, which holds the result of the parent resolver.
         * @returns {Array} An array of reviews by the author.
         */
        reviews(parent) {
            return db.reviews.filter((r) => r.author_id === parent.id)
        }
    },
    Review: {
        /**
         * Fetches the author of a review from the database.
         * @param {Object} parent - The parent object, which holds the result of the parent resolver.
         * @returns {Object} The author object.
         */
        author(parent) {
            return db.author.filter((r) => r.author_id === parent.id)
        },
        /**
         * Fetches the game of a review from the database.
         * @param {Object} parent - The parent object, which holds the result of the parent resolver.
         * @returns {Object} The game object.
         */
        game(parent) {
            return db.game.filter((r) => r.game_id === parent.id)
        }
    },
    Mutation: {
        deleteGame(_, args) {
            db.games = db.games.filter(g => g.id !== args.id)
            return db.games
        }
    }
};

// Creating a new Apollo Server instance
const server = new ApolloServer({
    typeDefs,
    resolvers
});

// Starting the server
const {url} = await startStandaloneServer(server, {
    listen: {port: 4000}
});

// Logging the server URL
console.log(`🚀 Server ready at ${url}`);