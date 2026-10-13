export function normalizeWhatsAppPhone(phone: string): string {
  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;

  const isBrazilianNumber =
    digits.startsWith("55") && (digits.length === 12 || digits.length === 13);

  if (!isBrazilianNumber) {
    throw new Error("Número de WhatsApp inválido.");
  }

  return digits;
}

export function buildWhatsAppUrl({
  phone,
  message,
}: {
  phone: string;
  message: string;
}): string {
  const normalizedPhone = normalizeWhatsAppPhone(phone);
  const trimmedMessage = message.trim();
  const baseUrl = `https://wa.me/${normalizedPhone}`;

  return trimmedMessage
    ? `${baseUrl}?text=${encodeURIComponent(trimmedMessage)}`
    : baseUrl;
}
