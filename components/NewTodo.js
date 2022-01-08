import { useEffect, useState } from 'react'
import { StyleSheet, Modal, Platform, View, Alert } from 'react-native'
import { Div, Button, Input, Icon, Text } from 'react-native-magnus'
import DateTimePicker from '@react-native-community/datetimepicker'

import Global from '../Global'
import createTodo from '../utils/createTodo'

import dayjs from 'dayjs'
import toObject from 'dayjs/plugin/toObject'
import objectSupport from 'dayjs/plugin/objectSupport'
dayjs.extend(toObject)
dayjs.extend(objectSupport)

const inputContainerSizing = Global.INPUT_CONTAINER_SIZING

const NewTodo = ({ 
    todos,
    setTodos
  }) => {
    const [task, setTask] = useState('')
    const [date, setDate] = useState({})
    const [mode, setMode] = useState('date')
    const [datePickerVisible, setDatePickerVisible] = useState(false)

    const handlePressNewTask = () => {
      setDatePickerVisible(true)
    }

    const handleDateTimePicker = ({ nativeEvent: { timestamp }, type }) => {
      if (mode === 'date' && type === 'set') {
        const { years, months, date } = dayjs(timestamp).toObject()
        setDate({
          years,
          months,
          date
        })
        setMode('time')
        return
      } 

      if (mode === 'time' && type === 'set') {
        const { hours, minutes, seconds } = dayjs(timestamp).toObject()
        const deadline = dayjs({
          ...date,
          hours,
          minutes,
          seconds
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
              onPress: () => {
                const newTodo = createTodo(task, deadline.toDate())
                setTodos([...todos, newTodo])
              }
            }
          ]
        )
      }
      setDatePickerVisible(false)
      setTask('')
      setMode('date')
    }

    return (
      <Div style={styles.inputContainer}>
        {
          datePickerVisible &&
            <DateTimePicker
              value={new Date()}
              mode={mode}
              minimumDate={new Date()}
              display='default'
              onChange={handleDateTimePicker}
            />
        }

        <Input
          style={{flexGrow: 1}}
          value={task}
          placeholder="what's to be done?"
          borderColor='white'
          onChangeText={(text) => setTask(text)}
        />
        <Button
          bg="gray200"
          borderColor="black"
          w={inputContainerSizing}
          h={inputContainerSizing}
          onPress={handlePressNewTask}
          suffix={
            <Icon 
              name='sign-in-alt'
              fontFamily="FontAwesome5"
              fontSize='xl'
            />
          }
        />
      </Div>
    )
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    height: inputContainerSizing
  },
})

export default NewTodo