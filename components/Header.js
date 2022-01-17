import { useState } from "react"
import { 
  StyleSheet,
  View, 
  Text,
  Pressable,
} from "react-native"
import dayjs from 'dayjs';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Icon } from 'react-native-elements';

const Header = ({
  currentDate,
  setCurrentDate
}) => {
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  return (
    <View style={styles.header}>
      {datePickerVisible &&
        <DateTimePicker
          value={currentDate.toDate()}
          mode='date'
          minimumDate={new Date()}
          display='default'
          onChange={({ nativeEvent: { timestamp }, type}) => {
            if (type === "set") {
              const currentDate = dayjs(timestamp)
              setDatePickerVisible(false)
              setCurrentDate(currentDate)
            }
            setDatePickerVisible(false)
          }}
        />
      }
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
        onPress={() => setDatePickerVisible(true)}
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