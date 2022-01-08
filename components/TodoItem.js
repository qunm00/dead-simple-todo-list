import { 
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Easing
} from 'react-native'
import { Icon } from 'react-native-elements'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCROLL_THRESHOLD = 0 
const FORCING_DURATION = 350
const FORCE_TO_OPEN_THRESHOLD = SCREEN_WIDTH * 0.4 
const RIGHT_BUTTON_THRESHOLD = SCREEN_WIDTH * 0.15
const LEFT_BUTTON_THRESHOLD = SCREEN_WIDTH * 0.15 

const TodoItem = ({
  task,
  cleanFromScreen,
  leftButtonPressed,
  deleteButtonPressed,
  editButtonPressed
}) => {
  const position = new Animated.ValueXY(0, 0)

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false, // we don't want the item to be animated with a touch
    onMoveShouldSetPanResponder: () => true, // we want to animate the item with a movement
    onResponderTerminationRequest: () => false,
    onPanResponderGrant: (event, gesture) => {
      position.setOffset({x: position.x._value, y: 0}) // we specify the offset to continue swiping from the place where user left
      position.setValue({ x: 0, y: 0}) // clearing the position
    },
    onPanResponderMove: (event, gesture) => {
      if (gesture.dx >= SCROLL_THRESHOLD) {
        const x = gesture.dx - SCROLL_THRESHOLD
        position.setValue({ x, y: 0 })
      } else if (gesture.dx <= -SCROLL_THRESHOLD) {
        const x = gesture.dx + SCROLL_THRESHOLD
        position.setValue({ x, y: 0 })
      }
    },
    onPanResponderRelease: (event, gesture) => {
      position.flattenOffset()
      if (gesture.dx > 0) {
        userSwipedRight(gesture)
      } else {
        userSwipedLeft(gesture)
      }
    },
    onPanResponderTerminate: () => {
      Animated.spring(position, {
        toValue: { x: 0, y: 0},
        useNativeDriver: false 
      }).start()
    }
  })

  const resetPosition = () => {
    Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 200,
      useNativeDriver: false
    }).start()
  }

  const userSwipedLeft = (gesture) => {
    if (gesture.dx <= -(RIGHT_BUTTON_THRESHOLD)) {
      showButton('left')
    } else {
      resetPosition()
    }
  }

  const userSwipedRight = (gesture) => {
    if (gesture.dx >= FORCE_TO_OPEN_THRESHOLD) {
      completeSwipe('right', () => leftButtonPressed())
    } else if (
      gesture.dx >= LEFT_BUTTON_THRESHOLD && 
      gesture.dx < FORCE_TO_OPEN_THRESHOLD
    ) {
      showButton('right')
    } else {
      resetPosition()
    }
  }

  const showButton = (side) => {
    const x = side === 'right' ? SCREEN_WIDTH / 4 : -SCREEN_WIDTH * .40  
    Animated.timing(position, {
      toValue: { x, y: 0},
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false
    }).start()
  }

  const getLeftButtonProps = () => {
    const opacity = position.x.interpolate({
      inputRange: [35, 75, 320],
      outputRange: [0, 1, 0.25]
    })
    const width = position.x.interpolate({
      inputRange: [0, 70],
      outputRange: [0, 70]
    })
    return {
      opacity,
      width
    }
  }

  const getRightButtonProps = () => {
    const opacity = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, -120, -35],
      outputRange: [0, 1, 0]
    })
    return {
      opacity
    }
  }

  const completeSwipe = (dimension, callback) => {
    const x = dimension === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: FORCING_DURATION,
      useNativeDriver: false
    }).start((id) => cleanFromScreen(id))
    callback()
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.leftButtonContainer, 
          getLeftButtonProps()
        ]}
      >
        <TouchableOpacity 
          onPress={() => 
            completeSwipe('right', () => leftButtonPressed())
          } 
        >
          <Icon
            type="font-awesome"
            name="check"
          />
          <Text
            style={styles.textStyle}
            numberOfLines={1}
          >
            Accept
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[styles.textContainer, position.getLayout()]}
        {...panResponder.panHandlers}
      >
        <Text style={styles.textStyle}>{task}</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.rightButtonContainer, 
          { left: SCREEN_WIDTH * 0.52 }, 
          getRightButtonProps()
        ]}
      >
        <TouchableOpacity onPress={() => completeSwipe('left', () => deleteButtonPressed())}>
          <Icon
            type="font-awesome"
            name="trash"
          />
          <Text style={styles.textStyle}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[
          styles.rightButtonContainer, 
          { backgroundColor: '#FFC400' }, 
          getRightButtonProps()
        ]}
      >
        <TouchableOpacity onPress={() => editButtonPressed()}>
          <Icon
            type="font-awesome"
            name="edit"
          />
          <Text style={styles.textStyle}>Edit</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    marginHorizontal: 5,
    marginTop: 30,
    elevation: 3
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 35,
    width: SCREEN_WIDTH / 1.03,
    marginHorizontal: 3,
    borderRadius: 7,
    backgroundColor: '#CFD8DC',
    elevation: 3,
    zIndex: 3
  },
  textStyle: {
    fontSize: 17
  },
  leftButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    borderRadius: 7,
    paddingHorizontal: 18,
    paddingVertical: 23,
    backgroundColor: '#50f442',
    position: 'absolute',
    elevation: 3
  },
  rightButtonContainer: {
    position: 'absolute',
    left: SCREEN_WIDTH * 0.74,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    borderRadius: 7,
    paddingHorizontal: 18,
    paddingVertical: 23,
    elevation: 3,
    backgroundColor: '#D50000',
    zIndex: 1
  }
})

export default TodoItem