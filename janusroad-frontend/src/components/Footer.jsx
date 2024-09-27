import React from 'react';
import { Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
        © {new Date().getFullYear()} JanusRoad. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
