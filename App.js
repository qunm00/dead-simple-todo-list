import 'react-native-get-random-values';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useEffect, useState } from 'react';
import { 
  SafeAreaView, 
  StyleSheet,
  FlatList, 
  StatusBar, 
  ToastAndroid,
  Text,
  View
} from 'react-native';

import NewTodo from './components/NewTodo'
import TodoItem from './components/TodoItem'

const now = dayjs();

(async () => {
  await AsyncStorage.clear()
})()



const  App = () => {
  const [todos, setTodos] = useState(null)

  const cleanFromScreen = (id) => {
    const data = todos.filter(item => {
      return item.id !== id
    })
    setTodos(data)
  }

  const markCompleted = (id) => {
    const data = todos.map(item => (
      item.id === id
      ? {...item, finished: true}
      : item
    ))
    setTodos(data)
  }

  const deleteButtonPressed = (task) => {
    ToastAndroid.show(
      `${task} deleted`,
      ToastAndroid.SHORT
    )
  }

  const keyExtractor = item => item.id
  const renderItem = ({ item }) => (
    <TodoItem
      key={item.id}
      id={item.id}
      task={item.task}
      finished={item.finished}
      cleanFromScreen={(id) => cleanFromScreen(id)}
      markCompleted={(id) => markCompleted(id)}
      deleteButtonPressed={deleteButtonPressed}
    />
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text
          style={styles.headerTextStyle}
        >
          {now.format('DD MMMM, YYYY')}
        </Text>
      </View>
      <NewTodo 
        setTodos={setTodos}
      />
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginTop: StatusBar.currentHeight
  },
  headerTextStyle: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});

export default App
