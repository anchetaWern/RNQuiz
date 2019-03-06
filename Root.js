import React, { Component } from "react";
import { YellowBox } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import LoginScreen from "./src/screens/Login";
import QuizScreen from "./src/screens/Quiz";

YellowBox.ignoreWarnings(["Setting a timer"]);

const RootStack = createStackNavigator(
  {
    Login: LoginScreen,
    Quiz: QuizScreen
  },
  {
    initialRouteName: "Login"
  }
);

const AppContainer = createAppContainer(RootStack);

class Router extends Component {
  render() {
    return <AppContainer />;
  }
}

export default Router;