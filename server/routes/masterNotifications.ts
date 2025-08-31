import { RequestHandler } from 'express';

export type BusinessUnit = 'CBU' | 'EBU' | 'M-PESA';
export type ResourceType = 'DATA' | 'VOICE' | 'SMS';
export type Validity = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'UNLIMITED' | 'MEGA';

export interface MasterNotification {
  id: string;
  businessUnits: BusinessUnit[];
  resourceType: ResourceType;
  validity: Validity;
  bundleType: string;
  notificationType: string;
  dynamicPrice?: boolean;
  price?: number | null;
  name: string;
  content: {
    en: string;
    am: string;
    om: string;
    so: string;
    ti: string;
  };
}

let idSeq = 1;
const db: MasterNotification[] = [
  {
    id: String(idSeq++),
    businessUnits: ['CBU'],
    resourceType: 'DATA',
    validity: 'DAILY',
    bundleType: 'Standard',
    notificationType: 'Activation',
    dynamicPrice: false,
    price: 50,
    name: 'Daily Data',
    content: { en: 'Daily data bundle', am: '', om: '', so: '', ti: '' },
  },
  {
    id: String(idSeq++),
    businessUnits: ['EBU', 'M-PESA'],
    resourceType: 'VOICE',
    validity: 'UNLIMITED',
    bundleType: 'Unlimited Voice',
    notificationType: 'Renewal',
    dynamicPrice: true,
    price: null,
    name: 'Unlimited Voice',
    content: { en: 'Unlimited voice bundle', am: '', om: '', so: '', ti: '' },
  },
];

function applyFilters(items: MasterNotification[], query: any) {
  let out = items.slice();
  const { bu, resourceType, validity, dynamicPrice, bundleType, notificationType, search } = query;
  if (bu) {
    const set = new Set(String(bu).split(','));
    out = out.filter((i) => i.businessUnits.some((b) => set.has(b)));
  }
  if (resourceType) out = out.filter((i) => i.resourceType === resourceType);
  if (validity) out = out.filter((i) => i.validity === validity);
  if (bundleType) out = out.filter((i) => i.bundleType.toLowerCase().includes(String(bundleType).toLowerCase()));
  if (notificationType) out = out.filter((i) => i.notificationType.toLowerCase().includes(String(notificationType).toLowerCase()));
  if (dynamicPrice === 'true') out = out.filter((i) => !!i.dynamicPrice);
  if (dynamicPrice === 'false') out = out.filter((i) => !i.dynamicPrice);
  if (search) out = out.filter((i) => i.name.toLowerCase().includes(String(search).toLowerCase()));
  return out;
}

export const listMasterNotifications: RequestHandler = (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const pageSize = Math.max(1, Math.min(50, Number(req.query.pageSize ?? 10)));
  const filtered = applyFilters(db, req.query);
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  res.json({ items, total, page, pageSize });
};

export const createMasterNotification: RequestHandler = (req, res) => {
  const body = req.body || {};
  const required = ['businessUnits', 'resourceType', 'validity', 'bundleType', 'notificationType', 'name', 'content'];
  for (const k of required) if (body[k] == null) return res.status(400).json({ error: `Missing ${k}` });
  const validity: Validity = body.validity;
  const dynamicPrice = !!body.dynamicPrice;
  const price = validity === 'UNLIMITED' || validity === 'MEGA' ? (dynamicPrice ? null : Number(body.price ?? 0)) : Number(body.price ?? 0);
  const item: MasterNotification = {
    id: String(idSeq++),
    businessUnits: body.businessUnits,
    resourceType: body.resourceType,
    validity,
    bundleType: String(body.bundleType),
    notificationType: String(body.notificationType),
    dynamicPrice,
    price: Number.isFinite(price) ? price : null,
    name: String(body.name),
    content: body.content,
  };
  db.unshift(item);
  res.status(201).json(item);
};

export const getMasterNotification: RequestHandler = (req, res) => {
  const item = db.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

export const updateMasterNotification: RequestHandler = (req, res) => {
  const idx = db.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const curr = db[idx];
  const patch = req.body || {};
  const merged: MasterNotification = { ...curr, ...patch, content: { ...curr.content, ...(patch.content || {}) } };
  db[idx] = merged;
  res.json(merged);
};

export const deleteMasterNotification: RequestHandler = (req, res) => {
  const idx = db.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.splice(idx, 1);
  res.json({ ok: true });
};
