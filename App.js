import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import dayjs from 'dayjs';

import { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  StyleSheet,
  FlatList, 
  StatusBar, 
  UIManager, 
  LayoutAnimation 
} from 'react-native';
import { ThemeProvider, Div, Text } from 'react-native-magnus';

import GLOBAL from './Global'
import NewTodo from './components/NewTodo'
import TodoItem from './components/TodoItem'

const initialData = [
  {
    id: uuid(),
    task: 'Do laundry',
    deadline: new Date(2022, 1, 5, 12, 0, 0)
  },
  {
    id: uuid(),
    task: 'Clean room',
    deadline: new Date(2022, 1, 5, 18, 0, 0)
  },
  {
    id: uuid(),
    task: 'Groceries',
    deadline: new Date(2022, 1, 7, 9, 0, 0)
  },
  {
    id: uuid(),
    task: 'Shower',
    deadline: new Date(2022, 1, 10, 9, 0, 0)
  },
  {
    id: uuid(),
    task: 'Breakfast',
    deadline: new Date(2022, 1, 11, 9, 0, 0)
  },
  {
    id: uuid(),
    task: 'Walk',
    deadline: new Date(2022, 1, 5, 9, 0, 0)
  },
  {
    id: uuid(),
    task: 'Programming',
    deadline: new Date(2022, 1, 1, 9, 0, 0)
  },
  {
    id: uuid(),
    task: 'Haircut',
    deadline: new Date(2022, 1, 1, 9, 0, 0)
  },
]

const now = dayjs()

const  App = () => {
  const [todos, setTodos] = useState(initialData)

  useEffect(() => {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    LayoutAnimation.spring()
  }, [])

  const cleanFromScreen = (id) => {
    const data = todos.filter(item => {
      return item.id !== id
    })
    setTodos(data)
  }

  const keyExtractor = item => item.id
  const renderItem = ({ item }) => (
    <TodoItem
      key={item.id}
      id={item.id}
      task={item.task}
      cleanFromScreen={(id) => cleanFromScreen(id) }
      leftButtonPressed={() => console.log('left button pressed')}
      deleteButtonPressed={() => console.log('delete button pressed')}
      editButtonPressed={() => console.log('edit button pressed')}
    />
  )

  return (
    <ThemeProvider>
      <SafeAreaView style={styles.container}>
        <Div style={styles.header}>
          <Text
            fontSize={24}
            fontWeight='bold'
          >
            {now.format('DD MMMM, YYYY')}
          </Text>
        </Div>
        <NewTodo 
          todos={todos}
          setTodos={setTodos}
        />
        <FlatList
          data={todos}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      </SafeAreaView>
    </ThemeProvider>
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
  }
});

export default App
