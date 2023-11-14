import * as React from 'react';
import Typography from '../components/Typography';
import ProductHeroLayout from './ProductHeroLayout';


const backgroundImage =
  '/static/25544.jpg?auto=format&fit=crop&w=1400';
const logo = '/static/QBot Logo.png?auto=format&fit=crop&w=200';

const LandingPage = (  ) => {
  return (
    <ProductHeroLayout
      sxBackground={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundColor: '#7fc7d9', // Average color of the background image.
        backgroundPosition: 'center',
      }}
    >
      {/* Increase the network loading priority of the background image. */}
      <img
        style={{ display: 'none' }}
        src={backgroundImage}
        alt="increase priority"
      />
      <Typography style={{ marginBottom: "200px" }} color="inherit" align="center" variant="h2" marked="center">
        Welcome to QBot
      </Typography>

      <Typography
        color="inherit"
        align="center"
        variant="h5"
        sx={{ mb: 4, mt: { xs: 4, sm: 10 } }}
      >
        Your Class, Your Questions, Instant Answers
      </Typography>
      <Typography variant="body2" color="inherit" sx={{ mt: 2 }}>
        Explore QBot – Your Personal Academic Assistant
      </Typography>
    </ProductHeroLayout>
  );
}

export default LandingPage;
