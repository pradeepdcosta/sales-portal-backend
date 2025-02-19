import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AccountSelection = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming you store the token after login
        const response = await axios.get('http://localhost:5000/api/accounts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={4}>
        Select Account
      </Typography>
      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account.id}>
            <Card 
              sx={{ cursor: 'pointer' }}
              onClick={() => navigate(`/account/${account.id}`)}
            >
              <CardContent>
                <Typography variant="h6">{account.name}</Typography>
                <Typography color="textSecondary">
                  {account.overview}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AccountSelection; 