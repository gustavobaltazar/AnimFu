import express from 'express'
import cors from 'cors'
import { prisma } from './utils/prisma'
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './server';
import { createContext } from './utils/trpc'
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    credentials: true
}));
app.use(cookieParser())
app.use(express.json());

app.get("/", async (req, res) => {
    return res.status(200).json({ message: "Hello World!" });
});

app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
);

app.listen(4000, () => {
    console.log("Server running on port 4000");
});
