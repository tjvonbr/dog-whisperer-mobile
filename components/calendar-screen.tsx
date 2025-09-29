import { useThemeColor } from '@/hooks/use-theme-color'
import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icons } from './icons'

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  const tintColor = useThemeColor({}, 'tint')
  const textColor = useThemeColor({}, 'text')

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const days = getDaysInMonth(currentDate)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'white',
    },
    menuButton: {
      padding: 8,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    monthHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    navButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    navButtonText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'black',
    },
    monthTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: textColor,
    },
    dayNamesRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    dayName: {
      flex: 1,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '600',
      color: 'black',
      paddingVertical: 8,
    },
    calendarGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCell: {
      width: '14.28%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    todayCell: {
      backgroundColor: tintColor,
      borderRadius: 20,
    },
    selectedCell: {
      backgroundColor: '#e3f2fd',
      borderRadius: 20,
      borderWidth: 2,
      borderColor: tintColor,
    },
    dayText: {
      fontSize: 16,
      color: textColor,
    },
    todayText: {
      color: 'white',
      fontWeight: 'bold',
    },
    selectedText: {
      color: tintColor,
      fontWeight: 'bold',
    },
    selectedDateInfo: {
      backgroundColor: '#f8f9fa',
      padding: 16,
      borderRadius: 8,
      marginBottom: 20,
    },
    selectedDateText: {
      fontSize: 16,
      color: textColor,
      fontWeight: '500',
    },
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => console.log('menu open')}
        >
          <Icons.menu size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.navigate('/')}
        >
          <Icons.chat size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Month Navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth('prev')}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth('next')}
          >
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Day Names Header */}
        <View style={styles.dayNamesRow}>
          {dayNames.map((dayName) => (
            <Text key={dayName} style={styles.dayName}>
              {dayName}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {days.map((date, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                date && isToday(date) && styles.todayCell,
                date && isSelected(date) && styles.selectedCell,
              ]}
              onPress={() => date && handleDateSelect(date)}
              disabled={!date}
            >
              {date && (
                <Text
                  style={[
                    styles.dayText,
                    isToday(date) && styles.todayText,
                    isSelected(date) && styles.selectedText,
                  ]}
                >
                  {date.getDate()}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View>
          <Text className='text-xl font-bold'>
            Training for {selectedDate?.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric'
            })}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}