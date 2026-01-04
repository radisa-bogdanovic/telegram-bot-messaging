// server.ts
import fastify, { FastifyInstance } from "fastify";
import "dotenv/config";
import authPlugin from "./plugins/auth";
import { sendTelegramMessage } from "./utils/telegram";

// =====================
// Helper funkcija za slanje poruke
// =====================

// =====================
// Telegram rute
// =====================
async function telegramRoutes(fastify: FastifyInstance) {
	// Registrujemo auth plugin za /api scope
	fastify.register(authPlugin, { prefix: "/api" });

	// Registrujemo endpoint unutar /api scope
	fastify.register(
		async (api) => {
			api.post("/telegram/send", async (request, reply) => {
				const body = request.body as {
					botToken?: string;
					chatId?: string;
					message?: string;
				};

				// validacija
				if (!body.botToken || !body.chatId || !body.message) {
					return reply
						.status(400)
						.send({ error: "Missing botToken, chatId or message" });
				}

				if (body.message.length > 4096) {
					return reply
						.status(400)
						.send({ error: "Message too long (max 4096 chars)" });
				}

				try {
					const result = await sendTelegramMessage({
						botToken: body.botToken,
						chatId: body.chatId,
						message: body.message,
					});

					return reply.send({ success: true, result });
				} catch (err: any) {
					return reply.status(500).send({ error: err.message });
				}
			});
		},
		{ prefix: "/api" }
	);
}

// =====================
// Inicijalizacija Fastify
// =====================
const fastifyInstance = fastify({ logger: true });

// Health check endpoint
fastifyInstance.get("/health", async () => ({ status: "ok" }));

// Registracija telegram ruta
telegramRoutes(fastifyInstance);

// Start server
const start = async () => {
	try {
		await fastifyInstance.listen({
			port: Number(process.env.PORT) || 3000,
			host: "0.0.0.0",
		});
		console.log("Server running on port " + (process.env.PORT || 3000));
	} catch (err) {
		fastifyInstance.log.error(err);
		process.exit(1);
	}
};

start();
