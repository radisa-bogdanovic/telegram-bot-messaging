export async function sendTelegramMessage({
	botToken,
	chatId,
	message,
}: {
	botToken: string;
	chatId: string;
	message: string;
}) {
	const res = await fetch(
		`https://api.telegram.org/bot${botToken}/sendMessage`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chat_id: chatId,
				text: message,
			}),
		}
	);

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`Telegram API error: ${errorText}`);
	}

	return res.json();
}
