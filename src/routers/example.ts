import { publicProcedure, router } from "../utils/trpc";
import { z } from "zod";

export const exampleRouter = router({
  hello: publicProcedure.query(({}) => {
    return { msg: "Hello!" };
  }),
});
