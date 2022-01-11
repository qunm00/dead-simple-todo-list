import { useState } from 'react'
import { 
  View, 
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { Icon } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'

import {
  createTodo,
  getTodo
} from '../utils/dataHelper'

import dayjs from 'dayjs'
import toObject from 'dayjs/plugin/toObject'
import objectSupport from 'dayjs/plugin/objectSupport'
dayjs.extend(toObject)
dayjs.extend(objectSupport)

const inputContainerSizing = 50

const NewTodo = ({ 
    setTodos
  }) => {
    const [task, setTask] = useState('')
    const [datePickerVisible, setDatePickerVisible] = useState(false)

    const handlePressNewTask = () => {
      setDatePickerVisible(true)
    }

    const handleDateTimePicker = ({ nativeEvent: { timestamp }, type }) => {
      if (type === 'set') {
        const { years, months, date } = dayjs(timestamp).toObject()
        const deadline = dayjs({
          years, months, date
        })
        Alert.alert(
          'Adding a new to do',
          `${task} will need to be done by ${deadline.toString()}`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Confirm',
              style: 'default',
              onPress: async () => {
                const date = dayjs().format('DDMMYY')
                await createTodo(task, deadline)
                const data = await getTodo(date)
                setTodos(data)
              }
            }
          ]
        )
      } 
      setDatePickerVisible(false)
      setTask('')
    }

    return (
      <View style={styles.inputContainer}>
        {
          datePickerVisible &&
            <DateTimePicker
              value={new Date()}
              mode='date'
              minimumDate={new Date()}
              display='default'
              onChange={handleDateTimePicker}
            />
        }

        <TextInput
          style={styles.inputBar}
          value={task}
          placeholder="what's to be done?"
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handlePressNewTask}
        >
          <Icon
            type="font-awesome-5"
            name="plus-square"
            size={26}
          />
        </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    height: inputContainerSizing,
  },
  inputBar: {
    flexGrow: 1,
    fontSize: 16
  },
  submitButton: {
    backgroundColor: "#d3d3d3",
    borderColor: "black",
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: inputContainerSizing + 5,
    height: inputContainerSizing + 5
  }
})

export default NewTodo