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
import dayjs from 'dayjs'

import {
  createTodo,
} from '../utils/dataHelper'



const inputContainerSizing = 50

const NewTodo = ({ 
    currentDate,
    isCurrent,
    fetchData
}) => {

    const [task, setTask] = useState('')
    const [datePickerVisible, setDatePickerVisible] = useState(false)
    const [inputFocus, setInputFocus] = useState(false)

    const handlePressNewTask = () => {
      if (task) {
        setDatePickerVisible(true)
      }
    }

    const handleDateTimePicker = ({ nativeEvent: { timestamp }, type }) => {
      if (type === 'set') {
        const deadline = dayjs(timestamp)
        Alert.alert(
          'Adding a new to do',
          `${task} will be added to ${deadline.format('dddd DD MMMM, YYYY')}`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Confirm',
              style: 'default',
              onPress: async () => {
                await createTodo(task, deadline)
                await fetchData()
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
              value={currentDate.toDate()}
              mode='date'
              minimumDate={new Date()}
              display='default'
              onChange={handleDateTimePicker}
            />
        }

        <TextInput
          style={[
            styles.inputBar, 
            inputFocus 
            ? { opacity: 1 } 
            : { opacity: 0.5 },
            isCurrent
            ? { borderColor: '#222831' }
            : { borderColor: '#EEEEEE'}
          ]}
          value={task}
          placeholder="what's to be done?"
          onChangeText={(text) => setTask(text)}
          onFocus={() => setInputFocus(true)}
          onEndEditing={() => setInputFocus(false)}
          editable={isCurrent}
        />
        <TouchableOpacity
          style={[
            styles.submitButton,
          ]}
          onPress={handlePressNewTask}
          activeOpacity={task ? 0.2 : 1}
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
    fontSize: 16,
    marginHorizontal: 5,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10
  },
  submitButton: {
    backgroundColor: "#00ADB5",
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: inputContainerSizing,
    height: inputContainerSizing,
  }
})

export default NewTodo