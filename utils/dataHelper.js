import { v4 as uuid } from 'uuid'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const getTodo = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (error) {
    console.log(error)
  }
}

export const createTodo = async (
  task,
  deadline
) => {
  try {
    const date = deadline.format('DDMMYY')
    const listTodo = await getTodo(date)
    const newTodo = {
      id: uuid(),
      task: task,
      deadline: deadline,
      finished: false,
    }

    if (listTodo) {
      await AsyncStorage.setItem(date, JSON.stringify([...listTodo, newTodo]))
    } else {
      await AsyncStorage.setItem(date, JSON.stringify([newTodo]))
    }
  } catch (error) {
    console.log(error)
  }
}
