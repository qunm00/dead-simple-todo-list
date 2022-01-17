import { useState } from 'react'
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
  id,
  task,
  status,
  isCurrent,
  cleanFromScreen,
  markCompleted,
  deleteButtonPressed,
  setModalVisible,
  setId
}) => {
  let lastTap = new Date()

  const handleDoubleTap = () => {
    const currentTap = new Date()
    if (currentTap - lastTap < 300) {
      setId(id)
      setModalVisible(true)
    }
    lastTap = new Date()
  }

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
    }
  })

  const resetPosition = () => {
    Animated.timing(position, {
      toValue: { x: 0, y: 0 },
      duration: 200,
      useNativeDriver: false
    }).start()
  }

  const userSwipedLeft = () => {
    if (position.x._value <= -FORCE_TO_OPEN_THRESHOLD) {
      completeSwipe('left', () => deleteButtonPressed(task))
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

  const showButton = (side) => {
    const x = side === 'right' ? BUTTON_WIDTH + 60 : -BUTTON_WIDTH - 60 
    Animated.timing(position, {
      toValue: { x, y: 0},
      duration: 600,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false
    }).start()
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

  if (!isCurrent) {
    return (
      <View style={styles.container}>
        {status === STATUS.neutral &&
          <View
            style={[styles.textContainer, {
              opacity: 0.2
            }]}
          >
            <Text style={styles.textStyle}>{task}</Text>
          </View>
        }

        {status === STATUS.completed &&
          <View
            style={[
              styles.textContainer, 
              {
                backgroundColor: '#50f442',
                opacity: 0.2,
              }
          ]}
          >
            <Text style={[styles.textStyle]}>
              {task}
            </Text>
          </View>
        }

        {status === STATUS.urgent &&
          <View
            style={[
              styles.textContainer, 
              {
                backgroundColor: '#FF5959',
                opacity: 0.2
              }
          ]}
          >
            <Text style={[styles.textStyle]}>
              {task}
            </Text>
          </View>
        }
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.buttonContainer, 
            {
              backgroundColor: '#50f442',
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

        {status === STATUS.neutral &&
          <Animated.View
            style={[styles.textContainer, position.getLayout()]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity
              onPress={handleDoubleTap}
            >
              <Text style={styles.textStyle}>{task}</Text>
            </TouchableOpacity>
          </Animated.View>
        }

        {status === STATUS.urgent &&
          <Animated.View
            style={[
              styles.textContainer, 
              {
                backgroundColor: '#FF5959'
              },
              position.getLayout()
            ]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity
              onPress={handleDoubleTap}
            >
              <Text style={styles.textStyle}>{task}</Text>
            </TouchableOpacity>
          </Animated.View>
        }

        {status === STATUS.completed &&
          <View
            style={[
              styles.textContainer, 
              {
                backgroundColor: '#50f442',
                opacity: 0.2,
              }
          ]}
          >
            <Text style={[styles.textStyle]}>
              {task}
            </Text>
          </View>
        }

        <Animated.View
          style={[
            styles.buttonContainer, 
            { 
              right: 0,
              backgroundColor: '#D50000',
            }, 
            getRightButtonProps(),
          ]}
        >
          <TouchableOpacity 
            onPress={() => completeSwipe('left', () => deleteButtonPressed(task))}
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
    backgroundColor: '#CFD8DC',
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