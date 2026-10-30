// Read-only check. Never displays credentials or sends email.
require('@next/env').loadEnvConfig(process.cwd());
const fs = require('node:fs');
(async () => {
    const key = process.env.UNITPOST_API_KEY?.trim();
    if (!key) throw Error('UNITPOST_API_KEY is not configured.');
    const response = await fetch('https://www.unitpost.com/api/v1/email/domains', { redirect: 'error', headers: { Authorization: `Bearer ${key}`, 'User-Agent': 'Aana-Newsletter/1.0', Accept: 'application/json' }, signal: AbortSignal.timeout(20000) });
    const body = await response.json().catch(() => ({}));
    const rows = Array.isArray(body.data) ? body.data : Array.isArray(body.domains) ? body.domains : [];
    const sender = process.env.NEWSLETTER_FROM || '';
    const email = sender.match(/<([^>]+)>$/)?.[1] || sender;
    const domain = email.split('@')[1];
    const match = rows.find(item => [item.name, item.domain, item.domain_name].includes(domain));
    const report = { httpStatus: response.status, sender: email, domain, domainFound: Boolean(match), domainStatus: match?.status || match?.verification_status || null, note: response.status === 403 ? 'This key may be sending-only; domain-read permission is unavailable.' : undefined };
    fs.writeFileSync('audit/unitpost-connection.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    if (!response.ok && response.status !== 403) process.exitCode = 1;
})().catch(error => { console.error(error.message); process.exitCode = 1; });
