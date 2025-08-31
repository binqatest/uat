import { RequestHandler } from 'express';

interface NotificationItem {
  id: string;
  nccId: string;
  businessUnit: 'CBU' | 'EBU' | 'M-PESA';
  resourceType: 'DATA' | 'VOICE' | 'SMS';
  validity: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'UNLIMITED' | 'MEGA';
  bundleType: string;
  notificationType: string;
  price: number | null;
  content: string;
  marketing: { en: string; am: string; om: string; so: string; ti: string };
  updatedAt: string;
  author: string;
  reason?: string;
}

let nid = 1000;
const notificationsDb: NotificationItem[] = [
  {
    id: String(nid++),
    nccId: 'CBU001',
    businessUnit: 'CBU',
    resourceType: 'DATA',
    validity: 'DAILY',
    bundleType: 'Standard',
    notificationType: 'Activation',
    price: 50,
    content: 'Daily data bundle content',
    marketing: { en: 'Daily data', am: '', om: '', so: '', ti: '' },
    updatedAt: new Date().toISOString(),
    author: 'System',
    reason: 'Auto generated',
  },
];

function filter(items: NotificationItem[], q: any) {
  let out = items.slice();
  const { businessUnit, resourceType, validity, bundleType, notificationType, search } = q;
  if (businessUnit) out = out.filter((i) => i.businessUnit === businessUnit);
  if (resourceType) out = out.filter((i) => i.resourceType === resourceType);
  if (validity) out = out.filter((i) => i.validity === validity);
  if (bundleType) out = out.filter((i) => i.bundleType.toLowerCase().includes(String(bundleType).toLowerCase()));
  if (notificationType) out = out.filter((i) => i.notificationType.toLowerCase().includes(String(notificationType).toLowerCase()));
  if (search) out = out.filter((i) => i.content.toLowerCase().includes(String(search).toLowerCase()) || i.nccId.toLowerCase().includes(String(search).toLowerCase()));
  return out;
}

export const listNotifications: RequestHandler = (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const pageSize = Math.max(1, Math.min(50, Number(req.query.pageSize ?? 10)));
  const filtered = filter(notificationsDb, req.query);
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  res.json({ items, total, page, pageSize });
};

export const getNotification: RequestHandler = (req, res) => {
  const item = notificationsDb.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

export const updateNotification: RequestHandler = (req, res) => {
  const idx = notificationsDb.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const curr = notificationsDb[idx];
  const patch = req.body || {};
  const merged: NotificationItem = { ...curr, ...patch, marketing: { ...curr.marketing, ...(patch.marketing || {}) }, updatedAt: new Date().toISOString() };
  notificationsDb[idx] = merged;
  res.json(merged);
};

export const deleteNotification: RequestHandler = (req, res) => {
  const idx = notificationsDb.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  notificationsDb.splice(idx, 1);
  res.json({ ok: true });
};

export const regenerateNotification: RequestHandler = (req, res) => {
  const item = notificationsDb.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  item.content = item.content + ' (regenerated)';
  item.updatedAt = new Date().toISOString();
  res.json(item);
};

export const downloadNotification: RequestHandler = (req, res) => {
  const item = notificationsDb.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Disposition', `attachment; filename=notification-${item.id}.txt`);
  res.send(item.content);
};
