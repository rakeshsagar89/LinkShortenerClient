import './App.css';
import React, { useState } from 'react';

function App() {

  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  console.log(process.env.REACT_APP_API_BASE_URL, "url");

  const API_BASE_URL = 'https://link-shortener-server-wa7c.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/shorten`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ originalUrl: originalUrl })
    });

    const short = await res.text();
    setShortUrl(short);
  };

  const handleRedirect = async (shortUrl) => {
    try {
      const response = await fetch(shortUrl, { method: "GET", redirect: "manual" });
      // const short = await response.text();
      // const code = short.split('/').pop();
      console.log(response,"response");
      if (response.status === 0) {
        const location = response.url;   //response.url ||
        window.open(location, "_blank");
      } else
        if (response.status === 302) {
          const location = response.url;
          console.log("Redirect to:", location);
          window.location.href = location;
        } else if (response.status === 410) {
          alert("This link has expired. Please Generate Again");
        } else if (response.status === 404) {
          alert("URL does not exist.");
          window.location.href = window.location.origin;
          // window.location.href = 'http://localhost:3000';
        } else {
          alert("Unexpected response");
        }
    } catch (error) {
      console.error("Redirect failed:", error);
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center', marginTop: '10%' }}>
        <label>Enter the Link : </label>
        <input value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} placeholder="Enter URL" />
        <button type="submit">Shorten</button>
      </form>
      {shortUrl && (
        <p style={{ textAlign: 'center', marginTop: '2%' }}>
          Short URL:{" "}
          <button onClick={() => handleRedirect(shortUrl)} style={{ cursor: "pointer", color: "blue", textDecoration: "underline", background: "none", border: "none" }}>
          {shortUrl}
          </button>
        </p>
      )}
    </div>
  );
}

export default App;
