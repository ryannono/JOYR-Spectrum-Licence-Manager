import React, {Component, Suspense} from 'react';
import {BrowserRouter, Navigate, Route, RouterProvider} from 'react-router-dom';
import {userContext} from './app-contexts';
import {UserInfo} from './global-types';
import {
  apiUserInfoRequest,
  logoutUser,
  updateUserInfo,
} from './global-functions';
import {appRouter, authRouter} from './router';

export default class App extends Component<{}, UserInfo> {
  constructor(props: {}) {
    super(props);
    this.state = {authenticated: false};
    this.getUserInfo = this.getUserInfo.bind(this);
    this.handleUserInfoChange = this.handleUserInfoChange.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    const userInfoIsAquired = localStorage.getItem('userInfoAcquired');
    if (!userInfoIsAquired || userInfoIsAquired === 'false') {
      localStorage.setItem('userInfoIsAquired', 'true');
      this.getUserInfo();
    }
  }

  // componentWillUnmount() {
  //   localStorage.removeItem('userInfoAcquired');
  // }

  async getUserInfo() {
    const response = await apiUserInfoRequest(
      localStorage.getItem('accessToken') as string
    );
    updateUserInfo(this.handleUserInfoChange, response as UserInfo);
  }

  handleUserInfoChange(
    propertyToSet: keyof UserInfo,
    propertyValue: string | boolean
  ) {
    localStorage.setItem(propertyToSet, propertyValue as string);
    if (propertyToSet === 'authenticated') {
      this.setState({authenticated: propertyValue as boolean});
    } else if (propertyToSet === 'userId') {
      this.setState({userId: propertyValue as string});
    } else if (propertyToSet === 'userEmail') {
      this.setState({userEmail: propertyValue as string});
    } else if (propertyToSet === 'userRole') {
      this.setState({userRole: propertyValue as string});
    } else if (propertyToSet === 'accessToken') {
      this.setState({accessToken: propertyValue as string});
    }
  }

  async handleLogout() {
    await logoutUser();
    this.setState({authenticated: false});
  }

  render() {
    const UserInfoGetterAndSetter = {
      currentUserInfo: this.state,
      editUserInfo: this.handleUserInfoChange,
      getUserInfo: this.getUserInfo,
    };

    return (
      <userContext.Provider value={UserInfoGetterAndSetter}>
        <RouterProvider
          router={this.state.authenticated ? appRouter : authRouter}
        />
      </userContext.Provider>
    );
  }
}
