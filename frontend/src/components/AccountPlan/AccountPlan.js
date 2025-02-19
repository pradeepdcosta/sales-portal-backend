import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const sections = [
  {
    id: 1,
    title: 'Executive Summary',
    subsections: [
      'Management Summary',
      'Account Vision',
      'Executive Sponsor',
      'Key Account Information',
      'Priority Opportunities',
      'Document Approval'
    ]
  },
  {
    id: 2,
    title: 'Customer Overview',
    subsections: [
      'Customer Business Overview',
      'Customer Business Strategy and Challenges',
      'Market Drivers: External factors impacting the customer'
    ]
  },
  // ... sections 3 and 4
];

const AccountPlan = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={4}>
        Account Development Plan
      </Typography>
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} key={section.id}>
            <Paper
              sx={{ 
                p: 3, 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
              }}
              onClick={() => navigate(`/account/${accountId}/section/${section.id}`)}
            >
              <Typography variant="h5" color="primary">
                {section.id.toString().padStart(2, '0')}
              </Typography>
              <Typography variant="h6">
                {section.title}
              </Typography>
              <Box component="ul" sx={{ mt: 2 }}>
                {section.subsections.map((subsection) => (
                  <Typography 
                    component="li" 
                    key={subsection}
                    sx={{ color: 'text.secondary' }}
                  >
                    {subsection}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AccountPlan; 