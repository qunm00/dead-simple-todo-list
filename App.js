import 'react-native-get-random-values';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useEffect, useState } from 'react';
import { 
  StyleSheet,
  StatusBar, 
  View,
  Modal,
} from 'react-native';

import { getTodo } from './utils/dataHelper';
import Header from './components/Header';
import Body from './components/Body';
import EditTodo from './components/EditTodo';

// (async () => {
//   const asyncStorageKeys = await AsyncStorage.getAllKeys()
//   if (asyncStorageKeys.length > 0) {
//     if (Platform.OS === 'android') {
//       await AsyncStorage.clear()
//     }
//     if (Platform.OS === 'ios') {
//       await AsyncStorage.multiRemove(asyncStorageKeys)
//     }
//   }
// })()

const  App = () => {
  const [todos, setTodos] = useState(null)
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [modalVisible, setModalVisible] = useState(false)
  const [todoId, setTodoId] = useState(null)

  const roundDownToDay = (time) => {
    const roundedTime = time - (time % 86400000)
    return roundedTime
  }

  const isCurrent = !dayjs(roundDownToDay(currentDate)).isBefore(dayjs(roundDownToDay(dayjs())))

  const fetchData = async () => {
    const todos = await getTodo(currentDate.format('DDMMYY'))
    setTodos(todos)
  }

  useEffect(() => {
    fetchData()
  }, [currentDate])

  return (
    <View
      style={styles.container}
    >
      <Modal
        animationType='slide'
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent={true}
      >
        <EditTodo 
          id={todoId}
          currentDate={currentDate}
          setModalVisible={setModalVisible}
          fetchData={fetchData}
        />
      </Modal>
      <Header
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <Body
        todos={todos}
        currentDate={currentDate}
        isCurrent={isCurrent}
        fetchData={fetchData}
        setModalVisible={setModalVisible}
        setId={setTodoId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginTop: StatusBar.currentHeight,
  },

});

export default App
