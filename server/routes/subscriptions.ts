import { RequestHandler } from 'express';

export const handleSubscriptions: RequestHandler = (req, res) => {
  const msisdn = String(req.query.msisdn || '').trim();
  if (!/^\+?\d{8,15}$/.test(msisdn)) {
    return res.status(400).json({ error: 'Invalid MSISDN.' });
  }

  const items = [
    { bundleName: 'Daily Data', bucketName: 'Data', status: 'Active', validity: '1 day' },
    { bundleName: 'Weekly Voice', bucketName: 'Voice', status: 'Active', validity: '7 days' },
    { bundleName: 'SMS Pack', bucketName: 'SMS', status: 'Expired', validity: '30 days' },
  ];

  return res.json({ items });
};
