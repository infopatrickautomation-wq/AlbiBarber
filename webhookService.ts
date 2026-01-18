
export interface WebhookPayload {
  event: 'new_booking' | 'booking_cancelled' | 'booking_modified' | 'test_connection';
  booking_id?: string;
  timestamp: string;
  cliente: {
    nome: string;
    cognome: string;
    telefono: string;
    email?: string;
  };
  appuntamento?: {
    data: string;
    ora: string;
    barbiere: string;
    servizi: string[];
    durata_totale: number;
    prezzo_totale: number;
  };
  link_gestione?: string;
}

export async function sendWebhook(url: string, payload: WebhookPayload, retries = 3): Promise<boolean> {
  if (!url || !url.startsWith('http')) {
    console.warn('Webhook URL not configured or invalid.');
    return false;
  }

  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        return true;
      }
      
      console.error(`Webhook failed with status: ${response.status}`);
    } catch (error) {
      console.error(`Webhook attempt ${attempt + 1} failed:`, error);
    }
    
    attempt++;
    if (attempt < retries) {
      // Exponential backoff: 1s, 2s...
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  return false;
}
