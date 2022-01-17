import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import DropDownPicker from 'react-native-dropdown-picker'
import Constants from 'expo-constants'
import dayjs from 'dayjs'

import { STATUS } from '../Global'
import { updateTodo } from '../utils/dataHelper'
import { Dimensions } from 'react-native'

const EditTodo = ({
  editTodo,
  currentDate,
  setModalVisible,
  fetchData
}) => {
  const [todo, setTodo] = useState(editTodo)

  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(todo.status)
  const [items, setItems] = useState([
    { label: 'urgent', value: STATUS.urgent },
    { label: 'neutral', value: STATUS.neutral },
    { label: 'completed', value: STATUS.completed },
  ])

  const handleChangeTask = (task) => {
    setTodo({
      ...todo,
      task: task
    })
  }
  const handleDateTimePicker = ({ nativeEvent: { timestamp }, type}) => {
    if (type === 'set') {
      setTodo({
        ...todo,
        deadline: dayjs(timestamp)
      })
    }
    setDatePickerVisible(false)
  }
  const handleChangeStatus = (status) => {
    setTodo({
      ...todo,
      status: status
    })
  }

  const handlePressCancel = () => {
    setModalVisible(false)
  }

  const handlePressUpdate = async () => {
    await updateTodo(todo, currentDate)
    setModalVisible(false)
    await fetchData()
  }

  return (
    <View style={styles.container}>
      <View style={styles.textInputContainer}>
        <Text
          style={styles.textInputLabel}
        >Task</Text>
        <TextInput
          style={styles.textInput}
          value={todo.task}
          onChangeText={handleChangeTask}
        />
      </View>

      <View style={styles.textInputContainer}>
        {
          datePickerVisible &&
            <DateTimePicker
              value={new Date(todo.deadline)}
              mode='date'
              minimumDate={new Date()}
              display='default'
              onChange={handleDateTimePicker}
            />
        }
        <Text
          style={styles.textInputLabel}
        >Deadline</Text>
        <TextInput
          style={styles.textInput}
          value={dayjs(todo.deadline).format('DD MMMM, YYYY')}
          onPressIn={() => setDatePickerVisible(true)}
        />
      </View>

      <View style={styles.textInputContainer}>
        <Text
          style={styles.textInputLabel}
        >Status</Text>
        <DropDownPicker
          style={[styles.dropDownPickerStyle, {
            backgroundColor: STATUS.colorDisplay[todo.status],
            height: '100%' 
          }]}
          containerStyle={{
            width: Dimensions.get('window').width * 3/4,
          }}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onChangeValue={handleChangeStatus}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[,
            styles.button,
          ]}
          onPress={handlePressCancel}
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[,
            styles.button,
          ]}
          onPress={handlePressUpdate}
        >
          <Text>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: Constants.statusBarHeight + 100
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 50,
    marginVertical: 5
  },
  textInputLabel: {
    flex: 1,
    paddingLeft: 5,
    textAlign: 'left',
    textAlignVertical: 'center',
    backgroundColor: 'honeydew'
  },
  textInput: {
    flex: 3,
    padding: 10,
    backgroundColor: 'linen'
  },
  buttonContainer: {
    flex: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  dropDownPickerStyle: {
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: 'lightgrey',
    borderRadius: 0,
  }
})

export default EditTodo