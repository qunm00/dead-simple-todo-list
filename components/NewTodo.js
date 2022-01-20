import { useState } from 'react'
import { 
  View, 
  StyleSheet,
  Alert,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native'
import { Icon } from 'react-native-elements'
import DateTimePicker from 'react-native-modal-datetime-picker'
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
    const [datePickerVisibility, setDatePickerVisibility] = useState(false)
    const [inputFocus, setInputFocus] = useState(false)

    const handlePressNewTask = () => {
      if (task) {
        setDatePickerVisibility(true)
      }
    }

    const handleConfirmDatePicker = (timestamp) => {
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
      handleCancelDatePicker()
    }

    const handleCancelDatePicker = () => {
      setDatePickerVisibility(false)
      setTask('')
    }

    return (
      <View style={styles.inputContainer}>
        <DateTimePicker
          isVisible={datePickerVisibility}
          mode='date'
          minimumDate={new Date()}
          onCancel={handleCancelDatePicker}
          onConfirm={handleConfirmDatePicker}
        />

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