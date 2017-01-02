import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, Text, WebView, Modal, Image, AsyncStorage } from 'react-native';
import CookieManager from 'react-native-cookies';
import { Header, Title, Button, Icon } from 'native-base';
import { LinkButton, Loading } from '../components';
import { connectFeathers } from '../connect';

const HOME_BACKGROUND = require('../img/hope.png');

class LoginScene extends Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    feathers: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      authUrl: '',
      webViewVisible: false,
      showLogin: false,
    };
    this.setAuthUrl = ::this.setAuthUrl;
    this.handleWebViewChange = ::this.handleWebViewChange;
    this.authenticate = ::this.authenticate;
  }

  componentWillMount() {
    const { feathers } = this.props;
    feathers.authenticate()
    .then((user) => {
      AsyncStorage.setItem('user', JSON.stringify(user.data));
      this.props.navigator.resetTo('HomeScene');
    })
    .catch(() => {
      feathers.logout();
      this.setState({ showLogin: true });
    });
  }

  setAuthUrl(destination) {
    this.setState({
      authUrl: `http://localhost:3030/auth/${destination}`,
      webViewVisible: true,
    });
  }

  authenticate(token) {
    const { feathers } = this.props;
    return feathers.authenticate({
      type: 'token',
      token,
    })
    .then(() => this.props.navigator.resetTo('HomeScene'))
    .catch(() => feathers.logout());
  }

  handleWebViewChange(url) {
    if (url.url.indexOf('/success') > -1) {
      CookieManager.getAll((error, cookie) => {
        this.authenticate(cookie['feathers-jwt'].value);
        this.setState({ webViewVisible: false });
      });
    }
  }

  renderWebView() {
    const { webViewVisible } = this.state;
    return (
      <Modal
        animationType="slide"
        visible={webViewVisible}
      >
        <View style={styles.container}>
          <Header iconRight>
            <Title>Social Login</Title>
            <Button transparent onPress={() => this.setState({ webViewVisible: false })}>
              <Icon name="ios-close" />
            </Button>
          </Header>
          <WebView
            startInLoadingState
            onNavigationStateChange={this.handleWebViewChange}
            source={{ uri: this.state.authUrl }}
            renderLoading={() => <Loading />}
          />
        </View>
      </Modal>
    );
  }

  render() {
    const { showLogin } = this.state;
    return showLogin && (
      <Image style={styles.wrap} source={HOME_BACKGROUND}>
        <Text style={[styles.headerText, styles.header]}>
          Hope Ping
        </Text>
        <Text style={[styles.headerText, styles.subheading]}>
          Giving Hope to Those in Need
        </Text>
        <LinkButton
          onPress={() => this.setAuthUrl('facebook')}
          label="Login With Facebook"
        />
        <LinkButton
          onPress={() => this.setAuthUrl('google')}
          label="Login With Google"
        />
        <LinkButton
          onPress={() => this.setAuthUrl('linkedin')}
          label="Login With LinkedIn"
        />
        {this.renderWebView()}
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  headerText: {
    backgroundColor: 'transparent',
    fontFamily: 'JosefinSlab',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 50,
    fontFamily: 'Pacifico',
  },
  subheading: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 50,
    fontFamily: 'Pacifico',
  },
});


export default connectFeathers(LoginScene);
