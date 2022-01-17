import { v4 as uuid } from 'uuid'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { STATUS } from '../Global'
import dayjs from 'dayjs'

export const sortTodoList = (todoList) => {
  return todoList.sort((a, b) => {
    return a.status - b.status
  })
}

export const getTodo = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? sortTodoList(JSON.parse(jsonValue)) : null
  } catch (error) {
    console.log(error)
  }
}

export const getSingleTodo = async (key, id) => {
  try {
    const date = key.format('DDMMYY')
    const jsonValue = await AsyncStorage.getItem(date)
    const todoList = JSON.parse(jsonValue)
    const todo = todoList.find(item => item.id === id)
    return todo
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
      status: STATUS.neutral
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

export const updateTodo = async (
  todo,
  currentDate
) => {
  try {
    const data = await getTodo(dayjs(currentDate).format('DDMMYY'))
    const filteredData = data.filter(item => item.id !== todo.id)
    await AsyncStorage.setItem(dayjs(currentDate).format('DDMMYY'), JSON.stringify(filteredData))

    const updatedData = await getTodo(dayjs(todo.deadline).format('DDMMYY'))
    if (updatedData) {
      await AsyncStorage.setItem(dayjs(todo.deadline).format('DDMMYY'), JSON.stringify([...updatedData, todo]))
    } else {
      await AsyncStorage.setItem(dayjs(todo.deadline).format('DDMMYY'), JSON.stringify([todo]))
    }
  } catch (error) {
    console.log(error)
  }
}

export const deleteTodo = async (id, currentDate) => {
  const date = currentDate.format('DDMMYY')
  const data = await getTodo(date)
  const newData = data.filter(item => item.id !== id)
  await AsyncStorage.setItem(date, JSON.stringify(newData))
}

export const markTodoCompleted = async (id, currentDate) => {
  const date = currentDate.format('DDMMYY')
  const data = await getTodo(date)
  const newData = data.map(item => (
    item.id === id
    ? {...item, status: STATUS.completed}
    : item
  ))
  await AsyncStorage.setItem(date, JSON.stringify(newData))
}
