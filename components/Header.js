import { useState } from "react"
import { 
  StyleSheet,
  View, 
  Text,
  Pressable,
} from "react-native"
import dayjs from 'dayjs';
import DateTimePicker from 'react-native-modal-datetime-picker'
import { Icon } from 'react-native-elements';

const Header = ({
  currentDate,
  setCurrentDate
}) => {
  const [datePickerVisibility, setDatePickerVisibility] = useState(false)
  const handleCancelDatePicker = () => {
    setDatePickerVisibility(false)
  }
  const handleConfirmDatePicker = (timestamp) => {
    setCurrentDate(dayjs(timestamp))
    handleCancelDatePicker()
  }

  return (
    <View style={styles.header}>
      <DateTimePicker
        isVisible={datePickerVisibility}
        mode='date'
        minimumDate={currentDate.toDate()}
        onConfirm={handleConfirmDatePicker}
        onCancel={handleCancelDatePicker}
      />
      <Pressable
        onPress={() => {
          setCurrentDate(currentDate.subtract(1, 'day'))
        }}
      >
        <Icon
          type="font-awesome-5"
          name="caret-square-left"
          size={50}
        />
      </Pressable>
      <Pressable
        onPress={() => setDatePickerVisibility(true)}
      >
        <Text
          style={styles.headerTextStyle}
        >
          {currentDate.format('DD MMMM, YYYY')}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          setCurrentDate(currentDate.add(1, 'day'))
        }}
      >
        <Icon
          type="font-awesome-5"
          name="caret-square-right"
          size={50}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTextStyle: {
    fontSize: 24,
    fontWeight: 'bold'
  }
})

export default Header