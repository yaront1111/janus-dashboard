import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import useWallet from '../hooks/useWallet';
import getContract from '../utils/getContract';
import { ethers } from 'ethers';

const Home = () => {
  const { signer } = useWallet();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!signer) return;

      try {
        const contract = getContract(signer);
        const totalProjects = await contract._currentProjectId(); // Adjust based on your smart contract

        let tempProjects = [];
        for (let i = 1; i < totalProjects; i++) {
          const project = await contract.projects(i);
          tempProjects.push(project);
        }
        setProjects(tempProjects);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [signer]);

  if (loading) return <CircularProgress style={{ margin: '2rem' }} />;
  if (error) return <Typography color="error">Failed to load projects.</Typography>;

  return (
    <Grid container spacing={3} style={{ padding: '2rem' }}>
      {projects.map((project) => (
        <Grid item xs={12} sm={6} md={4} key={project.id}>
          <Card>
            <CardContent>
              <Typography variant="h5">{project.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                Funding Target: {ethers.utils.formatEther(project.fundingTarget)} ETH
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Funds Raised: {ethers.utils.formatEther(project.totalFundsRaised)} ETH
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Coin Price: {ethers.utils.formatEther(project.coinPrice)} ETH
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Coin Supply: {project.coinSupply}
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={Link} to={`/project/${project.id}`} size="small" color="primary">
                View Project
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Home;
