import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';

import CommonLayout from 'layouts/CommonLayout';
import Home from 'pages/Home';
import SignUp from 'pages/SignUp';
import SignIn from 'pages/SignIn';
import Users from 'pages/Users';
import EditUserProfile from 'pages/EditUserProfile';
import NotFound from 'pages/NotFound';

import { Severity, User } from 'types';
import { getCurrentUser } from 'lib/api/auth';
import AlertMessage from 'components/utils/AlertMessage';

export const AuthContext = createContext(
  {} as {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isSignedIn: boolean;
    setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: User | undefined;
    setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  }
);

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [severity, setSeverity] = useState<Severity>('info');

  const handleGetCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      if (response.status === 200) {
        setIsSignedIn(true);
        setCurrentUser(response.data.currentUser);
      }
    } catch (error) {
      setAlertMessageOpen(true);
      setAlertMessage(String(error));
      setSeverity('error');
    }

    setLoading(false);
  };

  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  const Private = ({ children }: { children: React.ReactElement }) => {
    if (!loading) {
      if (isSignedIn && currentUser) {
        return children;
      }
      Cookies.remove('_access_token');
      Cookies.remove('_client');
      Cookies.remove('_uid');
      setIsSignedIn(false);
      setCurrentUser(undefined);
      return <Redirect to="/sign-in" />;
    }

    return <>Loading...</>;
  };

  return (
    <>
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            loading,
            setLoading,
            isSignedIn,
            setIsSignedIn,
            currentUser,
            setCurrentUser,
          }}
        >
          <CommonLayout>
            <Switch>
              <Route exact path="/sign-up" component={SignUp} />
              <Route exact path="/sign-in" component={SignIn} />
              <Private>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/users" component={Users} />
                  <Route exact path="/edit-profile" component={EditUserProfile} />
                  <Route component={NotFound} />
                </Switch>
              </Private>
            </Switch>
          </CommonLayout>
        </AuthContext.Provider>
      </BrowserRouter>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity={severity}
        message={alertMessage}
      />
    </>
  );
};
export default App;
