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
    if (!details) return 'N/A';
    return Object.entries(details).map(([key, value]) => (
      <li key={key} className="mb-1">
        <strong>{fullFormMapping[key]}:</strong> {value}
      </li>
    ));
  };

  // Mapping for certificate fields
  const fullFormMapping = {
    C: 'Country',
    O: 'Organization',
    CN: 'Common Name',
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">SSL Certificate Validator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter domain (eg: google.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:border-blue-500 transition duration-200"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none transition duration-200"
          >
            Validate
          </button>
        </form>

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 p-4 rounded relative animate-pulse" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {data && (
          <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-inner">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Certificate Information</h2>
            <ul className="space-y-2">
              <li><strong>Validity Status:</strong> {data.validityStatus}</li>
              <li><strong>Expiration Date:</strong> {new Date(data.expirationDate).toLocaleDateString()}</li>
              <li>
                <strong>Issuer Details:</strong>
                <ul className="list-disc ml-6 text-gray-600">
                  {formatDetails(data.issuerDetails)}
                </ul>
              </li>
              <li>
                <strong>Subject Details:</strong>
                <ul className="list-disc ml-6 text-gray-600">
                  {formatDetails(data.subjectDetails)}
                </ul>
              </li>
              <li><strong>Valid for Domain:</strong> {data.validForDomain ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
