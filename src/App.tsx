import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import CommonLayout from 'layouts/CommonLayout';
import Home from 'pages/Home';
import SignUp from 'pages/SignUp';
import SignIn from 'pages/SignIn';

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
      if (isSignedIn) {
        return children;
      } else {
        return <Redirect to='/signin' />;
      }
    } else {
      return <></>;
    }
  }

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ loading, setLoading, isSignedIn, setIsSignedIn, currentUser, setCurrentUser }}>
        <CommonLayout>
          <Switch>
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/signin' component={SignIn} />
            <Private>
              <Switch>
                <Route exact path='/' component={Home} />
              </Switch>
            </Private>
          </Switch>
        </CommonLayout>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}
export default App;
