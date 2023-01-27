import express from 'express'
import { z } from 'zod'
import cors from 'cors'
import * as trpcExpress from '@trpc/server/adapters/express';
import superjson from 'superjson'
import { initTRPC, TRPCError, inferAsyncReturnType } from '@trpc/server';
// import { User } from '@prisma/client';
import { prisma } from './prisma'
import axios, { AxiosError } from 'axios';


export const createContext = async ({
    req,
    res
}: trpcExpress.CreateExpressContextOptions) => {
    const setSessionIdCookie = (sessionId: string) => {
        res.cookie('sessionId', sessionId, { httpOnly: true })
    }

    console.log("req.cookies:", req.cookies)
    
    try {
        const session = await prisma.session.findFirst({
            
            where: { sessionId: req.cookies.sessionId },
            include: {
                user: true
            }
        })
        console.log("Session: ", session)
        
        return { prisma, session, setSessionIdCookie };
    } catch (error) {
        return { prisma, setSessionIdCookie };
    }
}

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape;
    },
});

const isAuthenticatedMiddleware = t.middleware(async ({ctx, next}) => {
    console.log("Middleware")
    console.log("session on middleware:", ctx.session)
    if (!ctx.session) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return next({
        ctx: {
            user: ctx.session.user
        }
    });
})

const isAdminMiddleware = t.middleware(async ({ ctx, next }) => { 
    const isAdmin = ctx.session?.user.isAdmin === true;
    if(!isAdmin) {
        throw new TRPCError({ code: "FORBIDDEN" })
    }
    return next({ ctx })
})


export const router = t.router;

export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure;

export const authenticatedProcedure = t.procedure.use(isAuthenticatedMiddleware);

 export const adminProcedure = authenticatedProcedure.use(isAdminMiddleware);
// export const adminProcedure = isAdminMiddleware.use(authenticatedProcedure);
