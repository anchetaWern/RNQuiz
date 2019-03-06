import React, { Component } from "react";
import { View, Text } from "react-native";

class Quiz extends Component {
  
  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Quiz Screen</Text>
      </View>
    );
  }

}

export default Quiz;

const styles = {
  container: {
    flex: 1,
    padding: 10
  },
  countdown: {
    alignItems: 'flex-end',
    padding: 20
  },
  countdown_text: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quiz: {
    flex: 1,
    justifyContent: 'center'
  },
  big_text: {
    fontWeight: 'bold',
    fontSize: 25
  },
  sub_text: {
    fontSize: 18
  },
  list_container: {
    marginTop: 30
  },
  option: {
    padding: 25,
    flexDirection: 'row'
  },
  option_text: {
    fontSize: 20,
    marginRight: 10
  },
  percentage: {
    marginTop: 20
  },
  percentage_text: {
    fontSize: 16
  },
  top_users: {
    alignItems: 'center'
  }
}