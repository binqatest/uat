import { RequestHandler } from 'express';

export interface RoamingRateRow {
  country: string;
  callToEthiopia: number; // Birr/min
  callToLocal: number; // Birr/min
  callToOther: number; // Birr/min
  receivingCall: number; // Birr/min
  dataMb: number; // Birr/MB
  sendingSms: number; // Birr/SMS
  receivingSms: number; // Birr/SMS
}

export interface MappingRow {
  tariffPlanKey: string;
  callTypeKey: string;
  originationTypeKey: string;
  destinationTypeKey: string;
  peakKey: string;
  rateIdValue: string;
}

let processedRates: RoamingRateRow[] = [];
let mappingTable: MappingRow[] = [];
let excelFileName: string | null = null;
let zipFileName: string | null = null;

function seedSample() {
  processedRates = [
    { country: 'Kenya', callToEthiopia: 35, callToLocal: 15, callToOther: 45, receivingCall: 10, dataMb: 2, sendingSms: 1, receivingSms: 0.5 },
    { country: 'Tanzania', callToEthiopia: 33, callToLocal: 14, callToOther: 44, receivingCall: 9, dataMb: 1.8, sendingSms: 1, receivingSms: 0.5 },
  ];
  mappingTable = [
    { tariffPlanKey: 'ROAM_STANDARD', callTypeKey: 'VOICE', originationTypeKey: 'ROAMING', destinationTypeKey: 'ETH', peakKey: 'PEAK', rateIdValue: 'RATE001' },
    { tariffPlanKey: 'ROAM_STANDARD', callTypeKey: 'DATA', originationTypeKey: 'ROAMING', destinationTypeKey: 'ANY', peakKey: 'OFFPEAK', rateIdValue: 'RATE002' },
  ];
  excelFileName = 'roaming_rates.csv';
  zipFileName = 'rate_ids.zip';
}
seedSample();

export const uploadRoamingRates: RequestHandler = (_req, res) => {
  // In this mock, we accept the upload and seed sample data
  seedSample();
  return res.json({ message: 'Upload received. File validated and processed successfully.', excelFileName, zipFileName });
};

export const getRoamingRates: RequestHandler = (_req, res) => {
  return res.json({ items: processedRates, excelFileName, zipFileName });
};

export const downloadRoamingExcel: RequestHandler = (_req, res) => {
  const header = 'Country,Call to Ethiopia,Call to Local,Call to Other Countries,Receiving Call,Data (MB),Sending SMS,Receiving SMS\n';
  const body = processedRates.map(r => [r.country, r.callToEthiopia, r.callToLocal, r.callToOther, r.receivingCall, r.dataMb, r.sendingSms, r.receivingSms].join(',')).join('\n');
  const content = header + body + '\n';
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="roaming_rates.csv"');
  res.send(content);
};

export const downloadRateIdsZip: RequestHandler = (_req, res) => {
  const content = 'This is a mock ZIP content with Rate IDs.';
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', 'attachment; filename="rate_ids.zip"');
  res.send(content);
};

export const getMappingTable: RequestHandler = (_req, res) => {
  return res.json({ items: mappingTable });
};

export const downloadMappingCsv: RequestHandler = (_req, res) => {
  const header = 'TariffPlan::key,Call_Type::key,Origination_Type::key,Destination_Type::key,Peak::key,Rate_ID::value\n';
  const body = mappingTable.map(m => [m.tariffPlanKey, m.callTypeKey, m.originationTypeKey, m.destinationTypeKey, m.peakKey, m.rateIdValue].join(',')).join('\n');
  const content = header + body + '\n';
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="mapping_table.csv"');
  res.send(content);
};

export const compareMappingTables: RequestHandler = (_req, res) => {
  // Mock differences
  return res.json({
    summary: { added: 1, removed: 0, updated: 2 },
    added: [{ tariffPlanKey: 'ROAM_PLUS', callTypeKey: 'SMS', originationTypeKey: 'ROAMING', destinationTypeKey: 'ANY', peakKey: 'ANY', rateIdValue: 'RATE100' }],
    removed: [],
    updated: [{ key: 'ROAM_STANDARD|VOICE|ROAMING|ETH|PEAK', oldRateId: 'RATE001', newRateId: 'RATE003' }, { key: 'ROAM_STANDARD|DATA|ROAMING|ANY|OFFPEAK', oldRateId: 'RATE002', newRateId: 'RATE004' }],
  });
};
