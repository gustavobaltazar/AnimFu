import express from 'express'
import cors from 'cors'
import { prisma } from './utils/prisma'

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    const examples = await prisma.example.findMany()
    return res.status(200).json({ message: "Hello World!", examples });
});

app.listen(4000, () => {
    console.log("Server running on port 4000");
});
