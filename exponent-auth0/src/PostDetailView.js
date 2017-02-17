import React from 'react'
import { Font } from 'exponent'
import {
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  Modal,
} from 'react-native'
import CommentView from './CommentView'
import CreateCommentView from './CreateCommentView'

export default class PostDetailView extends React.Component {

  state = {
    fontLoaded: false,
    width: 0,
    height: 0,
    modalVisible: false,
  }

  static route = {
    navigationBar: {
      title: 'Post Details',
    }
  }

  async componentDidMount() {
    Image.getSize(this.props.route.params.post.imageUrl, (width, height) => {

      const screenWidth = Dimensions.get('window').width

      const scaleFactor = width / screenWidth
      const imageHeight = height / scaleFactor

      this.setState({width: screenWidth, height: imageHeight})
    })

    // load font
    await Font.loadAsync({
      'open-sans-light': require('../assets/fonts/OpenSans-Light.ttf'),
    })
    this.setState({fontLoaded: true})
  }

  render() {

    const {width, height} = this.state

    return (
      <ScrollView style={styles.container}>
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.modalVisible}
        >
          <CreateCommentView
            onComplete={() => this.setState({modalVisible: false})}
            imageUrl={this.props.route.params.post.imageUrl}
            imageWidth={this.state.width}
            imageHeight={this.state.height}
            createdBy='Karl'
          />
        </Modal>
        <Image
          style={{width: width, height: height}}
          source={{uri: this.props.route.params.post.imageUrl}}
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {this.props.route.params.post.description}
          </Text>
        </View>
        <View style={styles.commentContainer}>
          <View
            style={styles.newCommentButtonContainer}
          >
            <TouchableHighlight
              onPress={() => this._addComment()}
            >
              <Image
                style={styles.newCommenButton}
                source={require('../assets/img/comments.png')}
              />
            </TouchableHighlight>
          </View>
          {this.props.route.params.post.comments.map((comment, i) => {
            return (<CommentView
              key={i}
              user={comment.user.name}
              comment={comment.content}
              createdAt={comment.createdAt}
            />)
          })}
        </View>
      </ScrollView>
    )
  }

  _addComment = () => {
    this.setState({modalVisible: true})
  }

}


const styles = StyleSheet.create({
  container: {
  },
  titleContainer: {
    height: 100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    color: 'rgba(0,0,0,.8)',
    fontWeight: '300',
    fontSize: 20,
  },
  commentContainer: {
    backgroundColor: 'rgba(0,0,0,.03)',
  },
  newCommentButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  newCommenButton: {
    width: 25,
    height: 25,
  }
})

PostDetailView.propTypes = {
  // post: React.PropTypes.object,
}