import { RequestHandler } from 'express';

const msisdnRegex = /^\+?\d{8,15}$/;

export const handleLoan: RequestHandler = (req, res) => {
  const { msisdn, loanId } = req.body || {};
  if (!msisdnRegex.test(msisdn)) {
    return res.status(400).json({ error: 'Invalid MSISDN.' });
  }
  if (!loanId || typeof loanId !== 'string') {
    return res.status(400).json({ error: 'Invalid loan ID.' });
  }

  return res.json({ message: `Loan ${loanId} processed for ${msisdn}.` });
};
