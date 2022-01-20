import 'react-native-get-random-values';
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useEffect, useState } from 'react';
import { 
  StyleSheet,
  View,
} from 'react-native';

import { getTodo, roundDownToDay } from './utils/dataHelper';
import Header from './components/Header';
import Body from './components/Body';

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
      <Header
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
      />
      <Body
        todos={todos}
        currentDate={currentDate}
        isCurrent={isCurrent}
        fetchData={fetchData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: 20,
  },
});

export default App
