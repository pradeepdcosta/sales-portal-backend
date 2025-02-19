import React from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const SectionView = () => {
  const { accountId, sectionId } = useParams();
  const drawerWidth = 280;

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Navigation</Typography>
        </Box>
        <List>
          {/* TODO: Add nested navigation */}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* TODO: Add section content */}
      </Box>
    </Box>
  );
};

export default SectionView; 