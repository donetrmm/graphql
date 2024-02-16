import 'dotenv/config'
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const books: any = [
    {
        id: 1,
        title: 'The Awakening',
        author: 'Kate Chopin',
        stock: 2
    },
    {
        id: 2,
        title: 'City of Glass',
        author: 'Paul Auster',
        stock: 13
    },
    {
        id: 3,
        title: "The Great Gatsby",
        author: 'Paul Auster',
        stock: 23
    },
];

const authors = [
    {
        id: 1,
        name: 'Iskander',
        lastName: 'Ramos',
        age: 19
    },
    {
        id: 2,
        name: 'María',
        lastName: 'García',
        age: 32
    },
    {
        id: 3,
        name: 'John',
        lastName: 'Doe',
        age: 45
    },
    {
        id: 4,
        name: 'Emily',
        lastName: 'Smith',
        age: 28
    }
];

// Definir schema
const typeDefs = `
    type Book {
        id: ID
        title: String
        author: String
        stock: Int
    }
    type Author {
        id: ID
        name: String
        lastName: String
        age: Int
    }
    type Query {
        books: [Book]
        authors: [Author]
        book(id: ID!): Book
    }

    input BookInput {
        title: String
        stock: Int
    }

    input UpdateBookInput {
        id: ID!
        title: String
        stock: Int
    }

    input DeleteBookInput {
        id: ID!
    }

    type Mutation {
        createBook(book: BookInput): Book
        updateBook(book: UpdateBookInput): Book
        deleteBook(book: DeleteBookInput): Book
    }
`;

const resolvers = {
    Query: {
        books: () => books,
        book: (_parent: any, args: any) => {
            const bookId = args.id;
            return books.find((book: any) => book.id === Number(bookId));
        },
        authors: () => authors,
    },

    Mutation: {
        createBook: (_: void, args: any) => {
            const bookInput = args.book;
            const book = {
                id: books.length + 1,
                title: bookInput.title,
                stock: bookInput.stock,
            };
            books.push(book);
            return book;
        },
        updateBook: (_: void, args: any) => {
            const { id, title, stock } = args.book;
            const bookIndex = books.findIndex((book: any) => book.id === Number(id));
            if (bookIndex === -1) {
                throw new Error('Libro no encontrado.');
            }
            if (title) {
                books[bookIndex].title = title;
            }
            if (stock !== undefined) {
                books[bookIndex].stock = stock;
            }
            return books[bookIndex];
        },
        deleteBook: (_: void, args: any) => {
            const { id } = args.book;
            const bookIndex = books.findIndex((book: any) => book.id === Number(id));
            if (bookIndex === -1) {
                throw new Error('Libro no encontrado');
            }
            const deletedBook = books.splice(bookIndex, 1);
            return deletedBook[0];
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const PORT = parseInt(process.env.PORT || "3000");

(async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: PORT }
    });

    console.log(`Corriendo en ${url}`);
})();

console.log("OK!");
