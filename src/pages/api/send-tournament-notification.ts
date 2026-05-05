import { sendTournamentNotification } from "@/lib/firebase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tournamentId, tournamentPassword } = req.body;

    if (!tournamentId || !tournamentPassword) {
      return res.status(400).json({ error: 'Tournament ID and password are required' });
    }

    const notificationCount = await sendTournamentNotification(tournamentId, tournamentPassword);

    res.status(200).json({ 
      success: true, 
      notificationCount,
      message: `Notification sent to ${notificationCount} participants`
    });
  } catch (error) {
    console.error('Error sending tournament notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
}
