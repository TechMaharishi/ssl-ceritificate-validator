const express = require('express');
const tls = require('tls');
const cors = require('cors');
const { Certificate } = require('pkijs');
const asn1js = require('asn1js');
const { fromBER } = asn1js;

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Function to fetch the certificate for a domain
const getCertificate = (domain) => {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, domain, { servername: domain }, () => {
      const cert = socket.getPeerCertificate(true);
      if (!cert || !Object.keys(cert).length) {
        reject(new Error('No certificate found.'));
      } else {
        resolve(cert.raw);
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

// Function to validate the expiry date of a certificate
const validateExpiryDate = (cert) => {
  const now = new Date();
  const validTo = new Date(cert.notAfter.value);
  return {
    validTo,
    isExpired: now > validTo,
  };
};

// Function to verify if the certificate is valid for the provided domain
const verifyDomain = (cert, domain) => {
  const commonName = cert.subject.typesAndValues.find(attr => attr.type === '2.5.4.3').value.valueBlock.value;
  const altNamesExt = cert.extensions.find(ext => ext.extnID === '2.5.29.17');
  const altNamesArray = altNamesExt ? altNamesExt.parsedValue.altNames.map(name => name.value) : [];
  const isValidForDomain = [commonName, ...altNamesArray].includes(domain);
  return { isValidForDomain };
};

// Validate the certificate for a domain using PKIjs
app.post('/api/validate-certificate', async (req, res) => {
  const { domain } = req.body;
  if (!domain) {
    return res.status(400).json({ error: 'Domain is required. Please provide a domain name.' });
  }
  try {
    const certRaw = await getCertificate(domain);

    // Parse the certificate using PKIjs
    const asn1 = fromBER(certRaw);
    const cert = new Certificate({ schema: asn1.result });

    const expiryInfo = validateExpiryDate(cert);
    const domainInfo = verifyDomain(cert, domain);

    return res.json({
      validityStatus: expiryInfo.isExpired ? 'Expired' : 'Valid',
      expirationDate: expiryInfo.validTo,
      issuerDetails: cert.issuer.typesAndValues.map(attr => ({ [attr.type]: attr.value.valueBlock.value })),
      subjectDetails: cert.subject.typesAndValues.map(attr => ({ [attr.type]: attr.value.valueBlock.value })),
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
