import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

const WalletChecker = () => {
  const [wallets, setWallets] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setWallets(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const walletArray = wallets.split('\n').map(wallet => wallet.trim()).filter(wallet => wallet !== "");

    if (walletArray.length === 0) {
      setError("Please enter at least one wallet address.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/check_wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wallets: walletArray }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong with the request.");
      }

      const data = await response.json();
      if (data.success) {
        setResults(data.results);
        setError('');
      } else {
        setError('No matching entries found.');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #1a1a1a, #2b2b2b)', 
      color: 'white', 
      minHeight: '100vh', 
      padding: '40px', 
      fontFamily: '"Roboto", "Segoe UI", sans-serif', // Rounded and modern font
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <Typography variant="h3" align="center" gutterBottom style={{ marginBottom: '30px' }}>
        Sybil Wallet Address Checker
      </Typography>

      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', width: '100%' }}>
        <TextField
          label="Enter wallet address/es, one per line"
          multiline
          rows={10}
          value={wallets}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          style={{ marginBottom: '20px' }}
          InputProps={{
            style: {
              backgroundColor: '#333', 
              color: 'white',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
              padding: '10px',
            },
          }}
          InputLabelProps={{
            style: { color: '#90e000' }, 
          }}
        />
        <br />
        <Button
          type="submit"
          variant="contained"
          color="success"
          fullWidth
          style={{
            marginTop: '20px',
            fontSize: '18px',
            borderRadius: '25px',
            padding: '12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Check Wallets
        </Button>
      </form>

      {error && (
        <Typography variant="body1" color="error" align="center" style={{ marginTop: '20px' }}>
          {error}
        </Typography>
      )}

      {results.length > 0 && (
        <TableContainer 
          component={Paper} 
          style={{ 
            marginTop: '30px', 
            backgroundColor: '#2c2c2c', 
            maxWidth: '600px', 
            width: '100%', 
            maxHeight: '400px', // Set a fixed height for the table
            overflowY: 'auto'  // Enable scrolling if content exceeds height
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ color: '#90e000', fontWeight: 'bold' }}>Wallet Address</TableCell>
                <TableCell style={{ color: '#90e000', fontWeight: 'bold' }}>Data Found</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell style={{ color: 'white' }}>{result.wallet}</TableCell>
                  <TableCell style={{ color: result.found ? 'red' : '#90e000' }}>
                    {result.found ? 'Blacklisted' : 'Not Found'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default WalletChecker;
