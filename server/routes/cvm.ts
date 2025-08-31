import { RequestHandler } from 'express';

export const handleGetCvmBuckets: RequestHandler = (req, res) => {
  const { bundleId } = req.params;
  if (!bundleId) return res.status(400).json({ error: 'Bundle ID is required.' });

  const buckets = [
    { name: 'DataVolume', unitType: 'MB' },
    { name: 'VoiceMinutes', unitType: 'MIN' },
    { name: 'SMSCount', unitType: 'SMS' },
  ];
  return res.json({ buckets });
};

export const handleCvmSubscribe: RequestHandler = (req, res) => {
  const { msisdn, bundleId, buckets } = req.body || {};
  if (!/^\+?\d{8,15}$/.test(msisdn)) return res.status(400).json({ error: 'Invalid MSISDN.' });
  if (!bundleId || typeof bundleId !== 'string') return res.status(400).json({ error: 'Invalid bundle ID.' });
  if (!Array.isArray(buckets) || buckets.length === 0) return res.status(400).json({ error: 'Buckets are required.' });
  for (const b of buckets) {
    if (!b || typeof b.name !== 'string' || typeof b.value !== 'number' || !Number.isFinite(b.value) || b.value <= 0) {
      return res.status(400).json({ error: 'Invalid bucket values.' });
    }
  }
  return res.json({ message: `CVM bundle ${bundleId} subscribed for ${msisdn}.` });
};
