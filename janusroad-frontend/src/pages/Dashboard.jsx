import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import useWallet from '../hooks/useWallet';
import getContract from '../utils/getContract';
import { ethers } from 'ethers';

const Dashboard = () => {
  const { signer, currentAccount } = useWallet();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchInvestments = async () => {
      if (!signer || !currentAccount) return;

      try {
        const contract = getContract(signer);
        const totalProjects = await contract._currentProjectId(); // Adjust based on your smart contract

        let tempInvestments = [];
        for (let i = 1; i < totalProjects; i++) {
          const balance = await contract.balanceOf(currentAccount, i);
          if (balance.gt(0)) {
            const project = await contract.projects(i);
            tempInvestments.push({
              id: project.id,
              name: project.name,
              balance: ethers.utils.formatEther(balance),
              coinPrice: ethers.utils.formatEther(project.coinPrice),
              accumulatedDividends: ethers.utils.formatEther(project.accumulatedDividends),
            });
          }
        }
        setInvestments(tempInvestments);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching investments:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [signer, currentAccount]);

  const handleClaimDividends = async (projectId) => {
    if (!signer) {
      alert('Please connect your wallet.');
      return;
    }

    try {
      const contract = getContract(signer);
      const tx = await contract.claimDividends(projectId);
      await tx.wait();
      alert('Dividends claimed successfully!');
    } catch (error) {
      console.error('Dividend claim failed:', error);
      alert('Failed to claim dividends. Please try again.');
    }
  };

  if (loading) return <CircularProgress style={{ margin: '2rem' }} />;
  if (error) return <Typography color="error">Failed to load investments.</Typography>;

  return (
    <Grid container spacing={3} style={{ padding: '2rem' }}>
      <Grid item xs={12}>
        <Typography variant="h4">Your Investments</Typography>
      </Grid>
      {investments.length === 0 ? (
        <Grid item xs={12}>
          <Typography>You have no active investments.</Typography>
        </Grid>
      ) : (
        investments.map((investment) => (
          <Grid item xs={12} md={6} key={investment.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{investment.name}</Typography>
                <Typography>Tokens Held: {investment.balance} ERC-1155</Typography>
                <Typography>Coin Price: {investment.coinPrice} ETH</Typography>
                <Typography>Accumulated Dividends: {investment.accumulatedDividends} ETH</Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  style={{ marginTop: '1rem' }}
                  onClick={() => handleClaimDividends(investment.id)}
                >
                  Claim Dividends
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default Dashboard;
