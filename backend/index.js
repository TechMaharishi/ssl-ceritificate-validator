const express = require('express');
const tls = require('tls');

const app = express();
const port = 3000;

app.use(express.json());

const getCertificate = (domain) => {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, domain, { servername: domain }, () => {
      const cert = socket.getPeerCertificate(true);
      if (!cert || !Object.keys(cert).length) {
        reject(new Error('No certificate found.'));
      } else {
        resolve(cert);
      }
      socket.end();
    });

    socket.on('error', (err) => {
      if (err.code === 'ENOTFOUND') {
        reject(new Error(`Domain not found: ${domain}. Please check the domain name and try again.`));
      } else if (err.code === 'ECONNREFUSED') {
        reject(new Error(`Connection refused. Unable to reach ${domain}.`));
      } else {
        reject(new Error(`Failed to fetch certificate: ${err.message}`));
      }
    });
  });
};

const validateExpiryDate = (cert) => {
  const now = new Date();
  const validTo = new Date(cert.valid_to);
  return {
    validTo,
    isExpired: now > validTo,
  };
};

const verifyDomain = (cert, domain) => {
  const commonName = cert.subject.CN;
  const altNames = cert.subjectaltname ? cert.subjectaltname.split(', ').map(name => name.replace('DNS:', '').trim()) : [];
  const isValidForDomain = [commonName, ...altNames].includes(domain);
  return { isValidForDomain };
};

// API to validate a certificate
app.post('/api/validate-certificate', async (req, res) => {
  const { domain } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required. Please provide a domain name.' });
  }
  try {
    const cert = await getCertificate(domain);
    const expiryInfo = validateExpiryDate(cert);
    const domainInfo = verifyDomain(cert, domain);

    return res.json({
      validityStatus: expiryInfo.isExpired ? 'Expired' : 'Valid',
      expirationDate: expiryInfo.validTo,
      issuerDetails: cert.issuer,
      subjectDetails: cert.subject,
      validForDomain: domainInfo.isValidForDomain
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
