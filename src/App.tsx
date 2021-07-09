import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

import CommonLayout from 'layouts/CommonLayout';
import Home from 'pages/Home';
import SignUp from 'pages/SignUp';
import SignIn from 'pages/SignIn';
import Users from 'pages/Users';
import EditUserProfile from 'pages/EditUserProfile';
import NotFound from 'pages/NotFound';

import { getCurrentUser } from 'lib/api/auth';
import { User } from 'interfaces/index';

export const AuthContext = createContext({} as {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isSignedIn: boolean;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>
  currentUser: User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
});

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  const handleGetCurrentUser = async () => {
    try {
      const response = await getCurrentUser();
      console.log(response);

      if (response?.status === 200) {
        setIsSignedIn(true);
        setCurrentUser(response?.data.currentUser);
      } else {
        console.log("No current user");
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    handleGetCurrentUser();
  }, [setCurrentUser]);

  const Private = ({ children }: { children: React.ReactElement }) => {
    if (!loading) {
      if (isSignedIn && currentUser) {
        return children;
      } else {
        Cookies.remove('_access_token');
        Cookies.remove('_client');
        Cookies.remove('_uid');
        setIsSignedIn(false);
        setCurrentUser(undefined);
        return <Redirect to='/sign-in' />;
      }
    } else {
      return <>Loading...</>;
    }
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
        <CommonLayout>
          <Switch>
            <Route exact path='/sign-up' component={SignUp} />
            <Route exact path='/sign-in' component={SignIn} />
            <Private>
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/users' component={Users} />
                <Route exact path='/edit-profile' component={EditUserProfile} />
                <Route component={NotFound} />
              </Switch>
            </Private>
          </Switch>
        </CommonLayout>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}
export default App;
