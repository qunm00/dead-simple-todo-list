import NewTodo from './NewTodo'
import TodoItem from './TodoItem'
import { deleteTodo, markTodoCompleted } from '../utils/dataHelper';

import { 
  StyleSheet,
  ToastAndroid,
  View,
  FlatList
} from 'react-native';

const Body = ({
  todos,
  currentDate,
  isCurrent,
  setModalVisible,
  setId,
  fetchData
}) => {
  const cleanFromScreen = async (id) => {
    await deleteTodo(id, currentDate)
    await fetchData()
  }

  const markCompleted = async (id) => {
    await markTodoCompleted(id, currentDate)
    await fetchData()
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
      status={item.status}
      isCurrent={isCurrent}
      cleanFromScreen={(id) => cleanFromScreen(id)}
      markCompleted={(id) => markCompleted(id)}
      deleteButtonPressed={deleteButtonPressed}
      setModalVisible={setModalVisible}
      setId={setId}
    />
  )

  return (
    <View style={styles.body}>
      <NewTodo 
        currentDate={currentDate}
        fetchData={fetchData}
        isCurrent={isCurrent}
      />
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 10,
  },
})

export default Body