import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const authPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.addHook("preHandler", async (request, reply) => {
		const auth = request.headers.authorization;

		if (!auth) {
			return reply.status(401).send({ error: "Missing API key" });
		}

		const [, token] = auth.split(" ");

		if (token !== process.env.API_KEY) {
			return reply.status(403).send({ error: "Invalid API key" });
		}
	});
};

// wrapujemo plugin sa fastify-plugin da bi hook bio aktivan pravilno
export default fp(authPlugin);
