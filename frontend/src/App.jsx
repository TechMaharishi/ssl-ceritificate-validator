import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [domain, setDomain] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/validate-certificate', { domain });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
      setData(null);
    }
  };

  const formatDetails = (details) => {
    if (!details || details.length === 0) return 'N/A';
    return details.map((detail, index) => {
      const key = Object.keys(detail)[0];
      const value = detail[key];
      return (
        <li key={index} className="mb-1">
          <strong>{fullFormMapping[key] || key}:</strong> {value}
        </li>
      );
    });
  };

  const fullFormMapping = {
    '2.5.4.6': 'Country',
    '2.5.4.10': 'Organization',
    '2.5.4.3': 'Common Name',
    '2.5.4.8': 'State or Province',
    '2.5.4.7': 'Locality',
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">SSL Certificate Validator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter domain (e.g., google.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="focus:outline-none focus:border-blue-500 w-full p-3 transition duration-200 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="hover:bg-blue-700 focus:outline-none w-full py-3 text-white transition duration-200 bg-blue-600 rounded-lg"
          >
            Validate
          </button>
        </form>

        {error && (
          <div className="animate-pulse relative p-4 mt-6 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="sm:inline block">{error}</span>
          </div>
        )}

        {data && (
          <div className="p-6 mt-6 bg-gray-100 rounded-lg shadow-inner">
            <h2 className="mb-4 text-2xl font-semibold text-gray-700">Certificate Information</h2>
            <ul className="space-y-2">
              <li><strong>Validity Status:</strong> {data.validityStatus}</li>
              <li><strong>Expiration Date:</strong> {new Date(data.expirationDate).toLocaleDateString()}</li>
              <li>
                <strong>Issuer Details:</strong>
                <ul className="ml-6 text-gray-600 list-disc">
                  {formatDetails(data.issuerDetails)}
                </ul>
              </li>
              <li>
                <strong>Subject Details:</strong>
                <ul className="ml-6 text-gray-600 list-disc">
                  {formatDetails(data.subjectDetails)}
                </ul>
              </li>
              <li>
                <strong>Valid for Domain:</strong>
                <span className={data.validForDomain ? 'text-green-600' : 'text-red-600'}>
                  {data.validForDomain ? 'Yes' : 'No'}
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
