import Exponent from 'exponent'
import React from 'react'
import {StyleSheet, Text, View, Button, Linking, TouchableHighlight} from 'react-native'
import ApolloClient, {createNetworkInterface} from 'apollo-client'
import {ApolloProvider} from 'react-apollo'
import PostListView from './src/PostListView'
import PostDetailView from './src/PostDetailView'
import jwtDecoder from 'jwt-decode'
import gql from 'graphql-tag'

import {
  createRouter,
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation'

const redirect_uri = 'exp://da-x7f.nikolasburk.exponent-auth0.exp.direct/+/redirect'
const auth0_client_id = 'uLSnQEYIghkTAzRwst7bsm0SucHulkXV'
const authorize_url = 'https://nikolasburk.eu.auth0.com/authorize'
const graphQLEndpoint = 'https://api.graph.cool/simple/v1/ciyzv01u06xq60185dno4c7nu'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: graphQLEndpoint}),
})

const Router = createRouter(() => ({
  posts: () => PostListView,
  postDetails: () => PostDetailView,
}))

class App extends React.Component {

  state = {
    username: 'Nikolas Burk',
  }

  componentDidMount() {
    Linking.addEventListener('url', this._handleAuth0Redirect);
  }

  render() {

    if (this.state.username) {

      return (
        <ApolloProvider client={client}>
          <NavigationProvider router={Router}>
            <StackNavigation initialRoute='posts' />
          </NavigationProvider>
        </ApolloProvider>
      )
    }
    else {
      return (
        <View style={styles.container}>
          <TouchableHighlight
            onPress={() => {
              console.log('login')
              this._loginWithAuth0()
            }}
          >
            <Text>Log In</Text>
          </TouchableHighlight>
        </View>
      )

    }

  }

  /**
   * Converts an object to a query string.
   */
  _toQueryString(params) {
    return '?' + Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
  }

  _logout = () => {
    // this.setState({
    //   username: undefined,
    //   counter: undefined
    // })
  }

  _loginWithAuth0 = async () => {
    console.log('_loginWithAuth0')
    const redirectionURL = authorize_url + this._toQueryString({
        client_id: auth0_client_id,
        response_type: 'token',
        scope: 'openid name',
        redirect_uri,
        state: redirect_uri,
      })
    console.log('redirect: ', redirectionURL)
    Exponent.WebBrowser.openBrowserAsync(redirectionURL)
  }

  _handleAuth0Redirect = async (event) => {
    console.log('_handleAuth0Redirect')
    if (!event.url.includes('+/redirect')) {
      return
    }
    Exponent.WebBrowser.dismissBrowser()
    const [, queryString] = event.url.split('#')
    const responseObj = queryString.split('&').reduce((map, pair) => {
      const [key, value] = pair.split('=')
      map[key] = value // eslint-disable-line
      return map
    }, {})
    const encodedToken = responseObj.id_token
    const decodedToken = jwtDecoder(encodedToken)
    const username = decodedToken.name

    const networkInterface = createNetworkInterface({ uri: graphQLEndpoint })

    networkInterface.use([{
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {}  // Create the header object if needed.
        }
        req.options.headers['authorization'] = `Bearer ${encodedToken}`
        next()
      }
    }])

    const client = new ApolloClient({
      networkInterface
    })

    // check if a user is already logged in
    const userResult = await client.query({
      query: gql`{
          user {
              id
          }
      }`
    })

    console.log('create new user', username, encodedToken)
    await client.mutate({mutation: gql`mutation {
        createUser(
        authProvider: {
          auth0: {
            idToken: "${encodedToken}"
          }
        }
        name: "${username}"
        ) {
            id
        }
    }`})
    this.setState({username})

  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

Exponent.registerRootComponent(App)

export default Router