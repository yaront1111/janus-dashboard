import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Button, Grid, Card, CardContent } from '@mui/material';
import useWallet from '../hooks/useWallet';
import getContract from '../utils/getContract';
import { ethers } from 'ethers';

const ProjectDetail = () => {
  const { id } = useParams();
  const { signer } = useWallet();
  const [project, setProject] = useState(null);
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

  if (loading) return <Typography>Loading...</Typography>;
  if (error || !project) return <Typography color="error">Failed to load project details.</Typography>;

  return (
    <Grid container spacing={3} style={{ padding: '2rem' }}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h4">{project.name}</Typography>
            <Typography variant="h6">Funding Target: {ethers.utils.formatEther(project.fundingTarget)} ETH</Typography>
            <Typography variant="h6">Funds Raised: {ethers.utils.formatEther(project.totalFundsRaised)} ETH</Typography>
            <Typography variant="h6">Coin Price: {ethers.utils.formatEther(project.coinPrice)} ETH</Typography>
            <Typography variant="h6">Coin Supply: {project.coinSupply}</Typography>
            <Typography variant="h6">Investor Count: {project.investorCount}</Typography>
            <Typography variant="h6">Stage: {project.stage.toString()}</Typography>
            <Typography variant="body1">Status: {project.isActive ? 'Active' : 'Closed'}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        {project.isActive ? (
          <Button variant="contained" color="primary" component={Link} to={`/invest/${project.id}`}>
            Invest Now
          </Button>
        ) : (
          <Typography variant="h6">This project is closed for investments.</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ProjectDetail;
