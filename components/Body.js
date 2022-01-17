import { useState } from 'react'
import { 
  StyleSheet,
  ToastAndroid,
  View,
  FlatList,
  Modal
} from 'react-native';

import NewTodo from './NewTodo'
import TodoItem from './TodoItem'
import EditTodo from './EditTodo';
import { deleteTodo, markTodoCompleted } from '../utils/dataHelper';

const Body = ({
  todos,
  currentDate,
  isCurrent,
  fetchData
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [editTodo, setEditTodo] = useState(null)

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
      todo={item}
      isCurrent={isCurrent}
      cleanFromScreen={(id) => cleanFromScreen(id)}
      markCompleted={(id) => markCompleted(id)}
      deleteButtonPressed={deleteButtonPressed}
      setModalVisible={setModalVisible}
      setTodo={setEditTodo}
    />
  )

  return (
    <View style={styles.body}>
      <NewTodo 
        currentDate={currentDate}
        fetchData={fetchData}
        isCurrent={isCurrent}
      />
      <Modal
        animationType='slide'
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent={true}
      >
        <EditTodo 
          editTodo={editTodo}
          currentDate={currentDate}
          setModalVisible={setModalVisible}
          fetchData={fetchData}
        />
      </Modal>
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