import React, { Component } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

const option_letters = ['A', 'B', 'C', 'D'];
const base_url = "YOUR NGROK HTTPS URL";

class Quiz extends Component {
  
  static navigationOptions = {
    header: null
  };

  state = {
    display_question: false,
    countdown: 10,
    show_result: false,
    selected_option: null,
    disable_options: true,
    total_score: 0,
    
    index: 1, 
   
    display_top_users: false
  }

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    
    this.pusher = navigation.getParam('pusher');
    this.myUsername = navigation.getParam('myUsername');
    this.quizChannel = navigation.getParam('quizChannel');

    this.quizChannel.bind('question-given', ({ index, question, optionA, optionB, optionC, optionD, answer }) => {
      
      this.setState({
        display_question: true,
        countdown: 10,
        show_result: false,
        disable_options: false,
        selected_option: null,

        index, 
        question, 
        optionA, 
        optionB, 
        optionC, 
        optionD, 
        answer
      });

      const interval = setInterval(() => {
        this.setState((prevState) => {
          const cnt = (prevState.countdown > 0) ? prevState.countdown - 1 : 0
          if (cnt == 0) {
            clearInterval(interval);
          }

          return {
            countdown: cnt
          }
        });
      }, 1000);

    });
    
    this.quizChannel.bind('top-users', ({ users }) => {
      console.log('received top users: ', JSON.stringify(users));
      this.setState({
        top_users: users,
        display_top_users: true
      });
    });
  }


  render() {
    
    const { 
      total_score,
      countdown, 
      index, 
      question, 
      optionA, 
      optionB, 
      optionC, 
      optionD, 
      answer, 

      display_question,
      top_users,
      display_top_users
    } = this.state;
    
    const options = [optionA, optionB, optionC, optionD];

    return (
      <View style={styles.container}>
        
        <View>
          <Text>Total Score: {total_score}</Text>
        </View>

        <View style={styles.countdown}>
          <Text style={styles.countdown_text}>{countdown}</Text>
        </View>

        {
          !display_question &&
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        }

        {
          display_question && !display_top_users && 
          <View style={styles.quiz}>  
            <View>
              <View>
                <Text style={styles.big_text}>{question}</Text>
              </View>

              <View style={styles.list_container}>
                { this.renderOptions(options, answer) }
              </View>
            </View>
          </View>
        }

        {
          display_top_users &&
          <View style={styles.top_users}>
            <Text style={styles.big_text}>Top Users</Text>
            <View style={styles.list_container}>
            { this.renderTopUsers() }
            </View>
          </View>
        }
            
      </View>
    );
  }

  renderTopUsers = () => {
    const { top_users } = this.state;
    return top_users.map(({ username, score }) => {
      return (
        <View key={username}>
          <Text style={styles.sub_text}>{username}: {score} out of 10</Text>
        </View>
      );
    });
  }

  renderOptions = (options, answer) => {
    const { show_result, selected_option, disable_options } = this.state;

    return options.map((opt, index) => {
      const letter = option_letters[index];
      const is_selected = selected_option == letter;
      const is_answer = (letter == answer) ? true : false; 

      return (
        <TouchableOpacity disabled={disable_options} onPress={() => this.placeAnswer(index, answer)} key={index}>
          <View style={styles.option}>
            <Text style={styles.option_text}>{opt}</Text>

            {
              is_answer && show_result && is_selected && <Icon name="check" size={25} color="#28a745" />
            }
            
            {
              !is_answer && show_result && is_selected && <Icon name="times" size={25} color="#d73a49" />
            }
          </View>
        </TouchableOpacity>
      );
    });
  }
  

  placeAnswer = (index, answer) => {
    
    const selected_option = option_letters[index];
    const { countdown, total_score } = this.state;

    if (countdown > 0) {
      if (selected_option == answer) { 
        this.setState((prevState) => {
          return {
            total_score: prevState.total_score + 1
          }
        });
    
        axios.post(base_url + '/increment-score', {
          username: this.myUsername
        }).then(() => {
          console.log('incremented score');
        }).catch((err) => {
          console.log('error occurred: ', e);
        });
      } 
    }

    this.setState({
      show_result: true,
      disable_options: true,
      selected_option
    });

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
  top_users: {
    alignItems: 'center'
  }
}