import express from 'express'
import cors from 'cors'
import { prisma } from './utils/prisma'
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './server';
import { createContext } from './utils/trpc'

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173"
    ],
    credentials: true
}));
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
