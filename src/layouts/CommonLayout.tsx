import React from 'react';
import { Container, Grid } from '@material-ui/core';

import commonStyles from 'components/styles/common';
import Header from 'layouts/Header';

interface CommonLayoutProps {
  children: React.ReactElement;
}

const CommonLayout: React.FC<CommonLayoutProps> = ({ children }: CommonLayoutProps) => {
  const classes = commonStyles();

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Container maxWidth="lg" className={classes.headerContainer}>
          <Grid container justify="center">
            <Grid item>{children}</Grid>
          </Grid>
        </Container>
      </main>
    </>
  );
};

export default CommonLayout;
