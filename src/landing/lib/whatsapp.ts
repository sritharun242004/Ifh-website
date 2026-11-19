/* WhatsApp Business Cloud API: send the sign-up confirmation template (server only).
   Template (registered by Madhan, body params in order):
   "Hi {{1}}, your free IFH spot #{{2}} is locked. We will call you soon to set up your home listing. - IFH, நம்ம ஊரு App"
   Env: WA_TOKEN, WA_PHONE_NUMBER_ID, WA_TEMPLATE_NAME, optional WA_TEMPLATE_LANG (default "en"). */

const GRAPH = "https://graph.facebook.com/v21.0";

export async function sendSignupConfirmation(phone10: string, name: string, position: number): Promise<boolean> {
  const { WA_TOKEN, WA_PHONE_NUMBER_ID, WA_TEMPLATE_NAME, WA_TEMPLATE_LANG } = process.env;
  if (!WA_TOKEN || !WA_PHONE_NUMBER_ID || !WA_TEMPLATE_NAME) {
    console.warn("[whatsapp] WA_TOKEN / WA_PHONE_NUMBER_ID / WA_TEMPLATE_NAME missing: confirmation skipped");
    return false;
  }
  try {
    const res = await fetch(`${GRAPH}/${WA_PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${WA_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: `91${phone10}`,
        type: "template",
        template: {
          name: WA_TEMPLATE_NAME,
          language: { code: WA_TEMPLATE_LANG || "en" },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: name.slice(0, 60) },
                { type: "text", text: String(position) },
              ],
            },
          ],
        },
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      console.error("[whatsapp] send failed", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("[whatsapp] send error", err);
    return false;
  }
}
