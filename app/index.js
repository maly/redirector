import express from 'express';
import { promises as dns } from 'dns';

const app = express();
const port = process.env.PORT || 1666;

let dnsCache = {};

const getDnsRedirectTarget = async (domain) => {
  // Nejdřív zkusíme cache
  const cachedTarget = dnsCache[domain];
  if (typeof cachedTarget === 'string') {
    console.log(`Cache hit for ${domain} -> ${cachedTarget}`);
    return cachedTarget;
  }

  try {
    const records = await dns.resolveTxt(`_redirect.${domain}`);
    // Očekáváme TXT záznam ve formátu: target-domain.cz
    const target = records[0][0];
    
    // Uložíme do cache
    dnsCache[domain] = target;
    console.log(`DNS lookup and cache set for ${domain} -> ${target}`);
    
    return target;
  } catch (error) {
    console.error(`DNS lookup failed for _redirect.${domain}:`, error);
    return null;
  }
};

const getHostFromRequest = (req) => {
  const host = req.hostname || req.headers.host;
  return host.split(':')[0];
};

// Endpoint pro výpis cache (pro debugging)
app.get('/_internal/cache', (req, res) => {
  res.json(dnsCache);
});

// Endpoint pro vymazání cache (pro debugging/maintenance)
app.post('/_internal/cache/clear', (req, res) => {
  dnsCache = {};
  res.json({ status: 'Cache cleared' });
});

app.use(async (req, res) => {
  // Ignorujeme interní endpointy
  if (req.path.startsWith('/_internal/')) return;

  const originalHost = getHostFromRequest(req);
  const originalPath = req.url;
  
  try {
    const targetDomain = await getDnsRedirectTarget(originalHost);
    
    if (!targetDomain) {
      return res.status(404).send('Redirect target not found');
    }

    const redirectUrl = `https://${targetDomain}${originalPath}`;
    console.log(`Redirecting ${originalHost}${originalPath} -> ${redirectUrl}`);
    res.redirect(301, redirectUrl);
    
  } catch (error) {
    console.error('Redirect failed:', error);
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Redirect server is running on port ${port}`);
});