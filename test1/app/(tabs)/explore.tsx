import { ScrollView, View, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView className="flex-1 px-4 sm:px-6 md:px-8 pt-6 pb-4">
      <View className="mb-6 mt-2">
        <ThemedText type="title" className="text-3xl sm:text-4xl font-bold">
          About
        </ThemedText>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* App Info Card */}
        <View
          className={`p-6 mb-5 rounded-2xl items-center ${
            isDark
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-gray-50 border border-gray-200'
          }`}>
          <IconSymbol name="checkmark.circle.fill" size={56} color={colors.tint} />
          <ThemedText
            type="subtitle"
            className="mt-4 mb-3 text-xl sm:text-2xl font-bold text-center">
            Simple Todo App
          </ThemedText>
          <ThemedText className="text-base sm:text-lg text-center leading-6 text-gray-700 dark:text-gray-300">
            A clean and simple todo list application built with React Native and Expo.
          </ThemedText>
        </View>

        {/* Features Card */}
        <View
          className={`p-6 mb-5 rounded-2xl items-center ${
            isDark
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-gray-50 border border-gray-200'
          }`}>
          <IconSymbol name="star.fill" size={56} color={colors.tint} />
          <ThemedText
            type="subtitle"
            className="mt-4 mb-4 text-xl sm:text-2xl font-bold text-center">
            Features
          </ThemedText>
          <View className="w-full mt-3 gap-3">
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                <IconSymbol name="checkmark" size={18} color={colors.tint} />
              </View>
              <ThemedText className="flex-1 text-base sm:text-lg font-medium">
                Add new todos with priority levels
              </ThemedText>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                <IconSymbol name="checkmark" size={18} color={colors.tint} />
              </View>
              <ThemedText className="flex-1 text-base sm:text-lg font-medium">
                Edit and update todos
              </ThemedText>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                <IconSymbol name="checkmark" size={18} color={colors.tint} />
              </View>
              <ThemedText className="flex-1 text-base sm:text-lg font-medium">
                Filter todos (All, Active, Completed)
              </ThemedText>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                <IconSymbol name="checkmark" size={18} color={colors.tint} />
              </View>
              <ThemedText className="flex-1 text-base sm:text-lg font-medium">
                Search todos by text
              </ThemedText>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                <IconSymbol name="checkmark" size={18} color={colors.tint} />
              </View>
              <ThemedText className="flex-1 text-base sm:text-lg font-medium">
                Priority levels (High, Medium, Low)
              </ThemedText>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                <IconSymbol name="checkmark" size={18} color={colors.tint} />
              </View>
              <ThemedText className="flex-1 text-base sm:text-lg font-medium">
                Statistics and task tracking
              </ThemedText>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                <IconSymbol name="checkmark" size={18} color={colors.tint} />
              </View>
              <ThemedText className="flex-1 text-base sm:text-lg font-medium">
                Clear completed todos
              </ThemedText>
            </View>
            <View className="flex-row items-center gap-3">
              <View className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-full">
                <IconSymbol name="checkmark" size={18} color={colors.tint} />
              </View>
              <ThemedText className="flex-1 text-base sm:text-lg font-medium">
                Dark mode support
              </ThemedText>
            </View>
          </View>
        </View>

        {/* How to Use Card */}
        <View
          className={`p-6 mb-5 rounded-2xl items-center ${
            isDark
              ? 'bg-gray-800/50 border border-gray-700'
              : 'bg-gray-50 border border-gray-200'
          }`}>
          <IconSymbol name="info.circle.fill" size={56} color={colors.tint} />
          <ThemedText
            type="subtitle"
            className="mt-4 mb-4 text-xl sm:text-2xl font-bold text-center">
            How to Use
          </ThemedText>
          <View className="w-full">
            <Text
              className={`text-base sm:text-lg text-center leading-7 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
              1. Type a todo and select priority{'\n'}
              2. Tap the + button to add{'\n'}
              3. Use filters to view All/Active/Completed{'\n'}
              4. Search todos using the search bar{'\n'}
              5. Tap edit icon to modify a todo{'\n'}
              6. Tap flag icon to change priority{'\n'}
              7. Tap checkbox to mark complete{'\n'}
              8. Tap trash icon to delete{'\n'}
              9. Use "Clear Completed" to remove all done tasks
            </Text>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
