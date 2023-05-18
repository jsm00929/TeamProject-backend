import { PrismaClient } from "@prisma/client";
import { log } from "../utils/logger";

export const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },

    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
    {
      emit: "event",
      level: "error",
    },
  ],
});

prisma.$on("query", (event) => {
  log.debug(
    `\n\n  [✅Query]: ${event.query}\n\n  [✅Params]: ${event.params}\n\n  [✅Duration]: ${event.duration}ms`
  );
});

prisma.$on("error", (event) => {
  log.error(event.message);
});
