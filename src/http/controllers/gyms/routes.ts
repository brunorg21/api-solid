import { FastifyInstance } from "fastify";
import { verifyJwt } from "../../middlewares/verify-jwt";
import { search } from "./search";
import { findNearby } from "./find-nearby";
import { create } from "./create";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJwt);

  app.get("/gyms/search", search);
  app.get("/gyms/nearby", findNearby);

  app.post("/gyms", create);
}
