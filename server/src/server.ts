import { userRouter } from './routers/user';
import { animeRouter } from './routers/anime';
import { router } from './utils/trpc'

export const appRouter = router({
    user: userRouter,
    anime: animeRouter,
  });
  
  export type AppRouter = typeof appRouter;