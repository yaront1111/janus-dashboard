import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import useWallet from '../hooks/useWallet';

const Navbar = () => {
  const { currentAccount, connectWallet } = useWallet();

  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          JanusRoad
        </Typography>
        {currentAccount ? (
          <Button color="inherit">
            {truncateAddress(currentAccount)}
          </Button>
        ) : (
          <Button color="inherit" onClick={connectWallet}>
            Connect Wallet
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
