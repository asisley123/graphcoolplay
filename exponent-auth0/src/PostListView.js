import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import React from 'react'
import {
  Text,
  View,
  ListView,
  StyleSheet,
  Modal,
  TouchableHighlight,
} from 'react-native'
import PostItem from './PostItem'
import CreatePostView from './CreatePostView'
import {Button} from 'react-native-material-design'

import Router from '../main'

const AllPostsQuery = gql`
  query AllPostsQuery { 
      allPosts { 
          description
          imageUrl
          comments {
              createdAt
              content
              user {
                  name
              }
          }
      } 
  }
`

class PostListView extends React.Component {

  static route = {
    navigationBar: {
      title: 'Posts',
    }
  }

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows([]),
      modalVisible: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps
    const descriptions = data.allPosts.map(post => post.description)
    const imageUrls = data.allPosts.map(post => post.imageUrl)

    const posts = data.allPosts.map(post => {
      return {
        'description': post.description,
        'imageUrl': post.imageUrl,
        'comments': post.comments,
      }
    })

    if (!data.loading && !data.error) {
      const { dataSource } = this.state
      this.setState({
        dataSource: dataSource.cloneWithRows(posts),
      })
    }
  }

  render() {

    console.log()

    return (
      <View style={{flex: 1, paddingTop: 22}}>

        <Modal
          animationType={"slide"}
          transparent={true}
          visible={false}
          onRequestClose={() => {alert("Modal has been closed.")}}
        >
          <CreatePostView
            onComplete={() => this.setState({modalVisible: this.state.modalVisible})}
          />
        </Modal>

        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(post, section, row) => {
            console.log('render post with comments: ', post.comments.length, post.description)
            return (<PostItem
              description={post.description}
              imageUrl={post.imageUrl}
              comments={post.comments}
              onSelect={this._onRowSelected}
            />)
          }}
        />
        <Button
          style={styles.addButton}
          text='+' raised={true}
          onPress={() => {
            this.setState({modalVisible: true})
          }}
        />

      </View>
    )
  }

  _onRowSelected = (post) => {
    console.log('select post: ', post)
    console.log('comments: ', post.comments)
    this.props.navigator.push(Router.getRoute('postDetails', {post: post}))
  }

}

const styles = StyleSheet.create({
  addButton: {
    width: 100,
  }
})

const postListViewWithQueries = graphql(AllPostsQuery)(PostListView)
export default postListViewWithQueries