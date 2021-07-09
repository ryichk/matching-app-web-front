import React from 'react';
import { Container, Grid } from '@material-ui/core';

import { useStyles } from 'components/styles/index';
import Header from 'layouts/Header';

interface CommonLayoutProps {
  children: React.ReactElement;
}

const CommonLayout = ({ children }: CommonLayoutProps) => {
  const classes = useStyles();

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Container maxWidth='lg' className={classes.headerContainer}>
          <Grid container justify='center'>
            <Grid item>
              {children}
            </Grid>
          </Grid>
        </Container>
      </main>
    </>
  );
}

export default CommonLayout;
