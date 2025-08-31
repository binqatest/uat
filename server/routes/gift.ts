import { RequestHandler } from 'express';

const msisdnRegex = /^\+?\d{8,15}$/;

export const handleGift: RequestHandler = (req, res) => {
  const { sender, receiver, bundleId } = req.body || {};
  if (!msisdnRegex.test(sender) || !msisdnRegex.test(receiver)) {
    return res.status(400).json({ error: 'Invalid MSISDN(s).' });
  }
  if (!bundleId || typeof bundleId !== 'string') {
    return res.status(400).json({ error: 'Invalid bundle ID.' });
  }

  return res.json({ message: `Bundle ${bundleId} sent from ${sender} to ${receiver}.` });
};
