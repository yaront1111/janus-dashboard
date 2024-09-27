import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import useWallet from '../hooks/useWallet';
import getContract from '../utils/getContract';
import { ethers } from 'ethers';

const Invest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { signer, currentAccount } = useWallet();
  const [project, setProject] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!signer) return;

      try {
        const contract = getContract(signer);
        const proj = await contract.projects(id);
        setProject(proj);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, signer]);

  const handleInvest = async () => {
    if (!signer) {
      alert('Please connect your wallet.');
      return;
    }

    if (!investmentAmount || isNaN(investmentAmount) || Number(investmentAmount) <= 0) {
      alert('Please enter a valid investment amount.');
      return;
    }

    try {
      const contract = getContract(signer);
      const tx = await contract.investInProject(id, {
        value: ethers.utils.parseEther(investmentAmount),
      });
      await tx.wait();
      alert('Investment successful!');
      navigate(`/project/${id}`);
    } catch (error) {
      console.error('Investment failed:', error);
      alert('Investment failed. Please try again.');
    }
  };

  if (loading) return <CircularProgress style={{ margin: '2rem' }} />;
  if (error || !project) return <Typography color="error">Failed to load project details.</Typography>;

  return (
    <Grid container spacing={3} style={{ padding: '2rem' }}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h4">Invest in {project.name}</Typography>
            <Typography variant="h6">Coin Price: {ethers.utils.formatEther(project.coinPrice)} ETH</Typography>
            <Typography variant="h6">Remaining Coins: {project.coinSupply}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">Investment Amount (ETH)</Typography>
            <TextField
              type="number"
              variant="outlined"
              fullWidth
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              placeholder="Enter amount in ETH"
              style={{ marginTop: '1rem' }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: '1rem' }}
              onClick={handleInvest}
            >
              Invest
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Invest;
