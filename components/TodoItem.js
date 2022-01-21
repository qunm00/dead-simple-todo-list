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
import { STATUS } from '../Global'

const SCREEN_WIDTH = Dimensions.get('window').width
const FORCE_TO_OPEN_THRESHOLD = SCREEN_WIDTH * 0.40
const SHOW_BUTTON_THRESHOLD = SCREEN_WIDTH * 0.20
const BUTTON_WIDTH = SCREEN_WIDTH * 0.25 
const SCROLL_THRESHOLD = 0 
const FORCING_DURATION = 350

const TodoItem = ({
  todo,
  isCurrent,
  cleanFromScreen,
  markCompleted,
  setModalVisible,
  setTodo,
  swipingCheck
}) => {
  let lastTap = new Date()
  let isSwiping = false
  const { id, task, status } = todo

  const handleDoubleTap = () => {
    const currentTap = new Date()
    if (currentTap - lastTap < 300) {
      setTodo(todo)
      setModalVisible(true)
    }
    lastTap = new Date()
  }

  const position = new Animated.ValueXY(0, 0)
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false, 
    onMoveShouldSetPanResponder: () => true, 
    onResponderTerminationRequest: () => true,
    onPanResponderGrant: (event, gesture) => {
      position.setOffset({x: position.x._value, y: 0})
      position.setValue({ x: 0, y: 0})
    },
    onPanResponderMove: (event, gesture) => {
      // disableScrollView(true)
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
      if (gesture.dx > SCROLL_THRESHOLD) {
        userSwipedRight()
      } else {
        userSwipedLeft()
      }
    },
    onPanResponderTerminate: () => {
      Animated.spring(position, {
        toValue: { x: 0, y: 0},
        useNativeDriver: false 
      }).start()
      // }).start(() => disableScrollView(false))
    }
  })

  const disableScrollView = (swiping) => {
    // swipingCheck(swiping)
    if (isSwiping !== swiping) {
      swipingCheck(swiping)
      isSwiping = swiping 
    }
  }

  const showButton = (side) => {
    const x = side === 'right' ? BUTTON_WIDTH + 60 : -BUTTON_WIDTH - 60 
    Animated.timing(position, {
      toValue: { x, y: 0},
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false
    }).start()
    // }).start(() => disableScrollView(false))
  }

  const resetPosition = () => {
    Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 200,
      useNativeDriver: false
    }).start()
    // }).start(() => disableScrollView(false))
  }

  const completeSwipe = (dimension, callback) => {
    const x = dimension === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: FORCING_DURATION,
      useNativeDriver: false
    }).start(() => {
        dimension === 'left'
        ? cleanFromScreen(id)
        : markCompleted(id)
      }
    )
    callback()
  }

  const userSwipedLeft = () => {
    if (position.x._value <= -FORCE_TO_OPEN_THRESHOLD) {
      completeSwipe('left', () => {})
    } else if (
      position.x._value <= -SHOW_BUTTON_THRESHOLD &&
      position.x._value > -FORCE_TO_OPEN_THRESHOLD
    ) {
      showButton('left')
    } else {
      resetPosition()
    }
  }

  const userSwipedRight = () => {
    if (position.x._value >= FORCE_TO_OPEN_THRESHOLD) {
      completeSwipe('right', () => {})
    } else if (
      position.x._value >= SHOW_BUTTON_THRESHOLD && 
      position.x._value < FORCE_TO_OPEN_THRESHOLD
    ) {
      showButton('right')
    } else {
      resetPosition()
    }
  }

  const getLeftButtonProps = () => {
    const opacity = position.x.interpolate({
      inputRange: [0, SHOW_BUTTON_THRESHOLD, SCREEN_WIDTH],
      outputRange: [0, 1, 0] 
    })
    const width = position.x.interpolate({
      inputRange: [0, SHOW_BUTTON_THRESHOLD, FORCE_TO_OPEN_THRESHOLD],
      outputRange: [BUTTON_WIDTH, BUTTON_WIDTH, FORCE_TO_OPEN_THRESHOLD]
    })
    return {
      opacity,
      width
    }
  }

  const getRightButtonProps = () => {
    const opacity = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, -SHOW_BUTTON_THRESHOLD, 0],
      outputRange: [0, 1, 0]
    })
    const width = position.x.interpolate({
      inputRange: [-FORCE_TO_OPEN_THRESHOLD, -SHOW_BUTTON_THRESHOLD, 0],
      outputRange: [FORCE_TO_OPEN_THRESHOLD, BUTTON_WIDTH, BUTTON_WIDTH]
    })
    return {
      opacity,
      width
    }
  }

  if (!isCurrent || (status === STATUS.completed)) {
    return (
      <View style={styles.container}>
          <View
            style={[styles.textContainer, {
              backgroundColor: STATUS.colorDisplay[status],
              opacity: 0.2
            }]}
          >
            <Text style={styles.textStyle}>{task}</Text>
          </View>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.buttonContainer, 
            {
              backgroundColor: 'lime',
            },
            getLeftButtonProps()
          ]}
        >
          <TouchableOpacity 
            onPress={() => 
              completeSwipe('right', () => {})
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
              Done 
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            position.getLayout(),
            {
              backgroundColor: STATUS.colorDisplay[status],
            }
          ]}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            onPress={handleDoubleTap}
          >
            <Text style={styles.textStyle}>{task}</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.buttonContainer, 
            { 
              right: 0,
              backgroundColor: 'red',
            }, 
            getRightButtonProps(),
          ]}
        >
          <TouchableOpacity 
            onPress={() => completeSwipe('left', () => {})}
          >
            <Icon
              type="font-awesome"
              name="trash"
            />
            <Text style={styles.textStyle}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 5,
    elevation: 3
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 35,
    borderRadius: 7,
    elevation: 3,
    zIndex: 3
  },
  textStyle: {
    fontSize: 17,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
    paddingHorizontal: 18,
    paddingVertical: 23,
    position: 'absolute',
    elevation: 3,
  },
})

export default TodoItem