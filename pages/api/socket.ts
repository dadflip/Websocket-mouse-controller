import { NextApiRequest } from 'next';
import { NextApiResponseWithSocket, initSocket } from '@/lib/socket';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  initSocket(res);
  res.end();
}