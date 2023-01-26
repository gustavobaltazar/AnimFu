import express from 'express'
import { z } from 'zod'
import cors from 'cors'
import * as trpcExpress from '@trpc/server/adapters/express';
import superjson from 'superjson'
import { initTRPC, TRPCError, inferAsyncReturnType } from '@trpc/server';
import { User } from '@prisma/client';
import { prisma } from './prisma'
import axios, { AxiosError } from 'axios';


export const createContext = async ({
    req,
    res
}: trpcExpress.CreateExpressContextOptions) => {
    const setSessionIdCookie = (sessionId: string) => {
        res.cookie('sessionId', sessionId, { httpOnly: true })
    }

    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return { prisma, setSessionIdCookie };
    }

    const session = await prisma.session.findFirst({
        where: { sessionId },
        include: {
            user: true
        }
    })
    
    return { prisma, session, setSessionIdCookie };
}

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape;
    },
});

const isAuthenticatedMiddleware = t.middleware(async ({ctx, next}) => {
    if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return next({
        ctx: {
            user: ctx.session.user
        }
    });
})


export const router = t.router;

export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure;

export const privateProcedure = t.procedure.use(isAuthenticatedMiddleware);

