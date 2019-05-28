# RNQuiz
A multi-player real-time quiz app created with Node.js and React Native.

You can read the tutorial at [https://pusher.com/tutorials/live-multiplayer-quiz-react-native](https://pusher.com/tutorials/live-multiplayer-quiz-react-native).

### Prerequisites

- React Native development environment
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/)
- [Pusher Channels app instance](https://pusher.com/channels)
- [ngrok account](https://ngrok.com/)

## Getting Started

1. Clone the repo:

```
git clone https://github.com/anchetaWern/RNQuiz.git
cd RNQuiz
```


2. Install the app dependencies:

```
yarn
```

3. Eject the project (re-creates the `ios` and `android` folders):

```
react-native eject
```

4. Link the packages:

```
react-native link react-native-gesture-handler
```

5. Update `.env` file with your Pusher app credentials.

6. Set up the server:

```
cd server
yarn
```

7. Update the `server/.env` file with your Pusher app credentials.

8. Run the server:

```
yarn start
```

9. If you're starting out with an empty `db.sqlite` file, access `http://localhost:5000/create-db` then `http://localhost:5000/create-quiz` on your browser. Otherwise, skip this step.

10. Run ngrok:

```
./ngrok http 5000
```

11. Update the `src/screens/Login.js` and `src/screens/Quiz.js` file with your ngrok https URL.

12. Run the app:

```
react-native run-android
react-native run-ios
```

13. Log in to the app on two separate devices (or emulator).

14. Access `http://localhost:5000/questions` on your browser to start publishing questions.


## Built With

* [React Native](http://facebook.github.io/react-native/)
* [Pusher Channels](https://pusher.com/channels)

## Donation

If this project helped you reduce time to develop, please consider buying me a cup of coffee :)

<a href="https://www.buymeacoffee.com/wernancheta" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
