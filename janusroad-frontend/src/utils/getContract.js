import { ethers } from 'ethers';
import contractABI from './contractABI.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS; // Define this in your .env file

const getContract = (signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
};

export default getContract;
