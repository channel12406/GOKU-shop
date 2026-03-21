const WHATSAPP_NUMBER = "22951104575"; // Goku Shop Benin number

export function openWhatsApp(message: string) {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
}
