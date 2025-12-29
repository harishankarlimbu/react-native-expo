import { useState } from 'react';
import { TextInput, TouchableOpacity, ScrollView, Alert, View, Text, Modal } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type FilterType = 'all' | 'active' | 'completed';
type PriorityType = 'high' | 'medium' | 'low';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: PriorityType;
  createdAt: number;
}

export default function HomeScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchText, setSearchText] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<PriorityType>('medium');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editText, setEditText] = useState('');
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const addTodo = () => {
    if (inputText.trim() === '') {
      return;
    }
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText.trim(),
      completed: false,
      priority: selectedPriority,
      createdAt: Date.now(),
    };
    setTodos([...todos, newTodo]);
    setInputText('');
    setSelectedPriority('medium');
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    Alert.alert(
      'Delete Todo',
      'Are you sure you want to delete this todo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setTodos(todos.filter((todo) => todo.id !== id)),
        },
      ]
    );
  };

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (editText.trim() === '') {
      Alert.alert('Error', 'Todo text cannot be empty');
      return;
    }
    setTodos(
      todos.map((todo) =>
        todo.id === editingTodo?.id ? { ...todo, text: editText.trim() } : todo
      )
    );
    setEditingTodo(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditText('');
  };

  const updatePriority = (id: string, priority: PriorityType) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, priority } : todo
      )
    );
  };

  const clearCompleted = () => {
    const completedCount = todos.filter((t) => t.completed).length;
    if (completedCount === 0) {
      Alert.alert('Info', 'No completed todos to clear');
      return;
    }
    Alert.alert(
      'Clear Completed',
      `Are you sure you want to delete ${completedCount} completed ${completedCount === 1 ? 'todo' : 'todos'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => setTodos(todos.filter((todo) => !todo.completed)),
        },
      ]
    );
  };

  // Filter and search todos
  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed);
    const matchesSearch = todo.text.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort todos: high priority first, then by creation date
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.createdAt - a.createdAt;
  });

  const remainingTasks = todos.filter((t) => !t.completed).length;
  const completedTasks = todos.filter((t) => t.completed).length;
  const totalTasks = todos.length;
  const highPriorityTasks = todos.filter((t) => !t.completed && t.priority === 'high').length;

  const getPriorityColor = (priority: PriorityType) => {
    switch (priority) {
      case 'high':
        return '#EF4444'; // red
      case 'medium':
        return '#F59E0B'; // amber
      case 'low':
        return '#10B981'; // green
      default:
        return colors.icon;
    }
  };

  const getPriorityLabel = (priority: PriorityType) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
    }
  };

  return (
    <ThemedView className="flex-1 px-4 sm:px-6 md:px-8 pt-6 pb-4">
      {/* Header with Statistics */}
      <View className="mb-4 mt-2">
        <ThemedText type="title" className="text-3xl sm:text-4xl font-bold mb-3">
          My Todo List
        </ThemedText>
        <View className="flex-row flex-wrap gap-2 mb-4">
          <View className={`px-3 py-1.5 rounded-lg ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
            <Text className={`text-xs font-semibold ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
              Total: {totalTasks}
            </Text>
          </View>
          <View className={`px-3 py-1.5 rounded-lg ${isDark ? 'bg-green-900/30' : 'bg-green-100'}`}>
            <Text className={`text-xs font-semibold ${isDark ? 'text-green-300' : 'text-green-700'}`}>
              Active: {remainingTasks}
            </Text>
          </View>
          <View className={`px-3 py-1.5 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <Text className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Done: {completedTasks}
            </Text>
          </View>
          {highPriorityTasks > 0 && (
            <View className={`px-3 py-1.5 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
              <Text className={`text-xs font-semibold ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                High: {highPriorityTasks}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <View className="mb-4">
        <View className="flex-row items-center bg-white dark:bg-gray-800 border-2 rounded-xl px-4 h-12">
          <IconSymbol name="magnifyingglass" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            className={`flex-1 ml-2 text-base ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
            placeholder="Search todos..."
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} className="ml-2">
              <IconSymbol name="xmark.circle.fill" size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Buttons */}
      <View className="flex-row gap-2 mb-4">
        {(['all', 'active', 'completed'] as FilterType[]).map((filterType) => (
          <TouchableOpacity
            key={filterType}
            onPress={() => setFilter(filterType)}
            className={`flex-1 py-2.5 px-4 rounded-xl ${
              filter === filterType
                ? 'bg-blue-600 dark:bg-blue-500'
                : isDark
                ? 'bg-gray-800 border border-gray-700'
                : 'bg-gray-100 border border-gray-300'
            }`}
            activeOpacity={0.7}>
            <Text
              className={`text-center text-sm font-semibold ${
                filter === filterType
                  ? 'text-white'
                  : isDark
                  ? 'text-gray-300'
                  : 'text-gray-700'
              }`}>
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input Container with Priority */}
      <View className="mb-4">
        <View className="flex-row gap-3 mb-2">
          <TextInput
            className={`flex-1 h-14 px-4 text-base sm:text-lg border-2 rounded-xl bg-white dark:bg-gray-800 ${
              isDark
                ? 'border-gray-600 text-white placeholder-gray-400'
                : 'border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            placeholder="Add a new todo..."
            placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={addTodo}
          />
          <TouchableOpacity
            onPress={() => setShowPriorityModal(true)}
            className={`w-14 h-14 border-2 rounded-xl justify-center items-center ${
              isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
            }`}
            activeOpacity={0.7}>
            <View
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getPriorityColor(selectedPriority) }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-14 h-14 bg-blue-600 dark:bg-blue-500 rounded-xl justify-center items-center shadow-lg active:opacity-80"
            onPress={addTodo}
            activeOpacity={0.8}>
            <IconSymbol name="plus" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>
        {completedTasks > 0 && (
          <TouchableOpacity
            onPress={clearCompleted}
            className="self-end py-2 px-4 bg-red-100 dark:bg-red-900/30 rounded-lg"
            activeOpacity={0.7}>
            <Text className="text-red-600 dark:text-red-400 text-sm font-semibold">
              Clear Completed ({completedTasks})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Todo List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {sortedTodos.length === 0 ? (
          <View className="items-center justify-center py-16 sm:py-20">
            <IconSymbol
              name="checkmark.circle"
              size={80}
              color={isDark ? '#6B7280' : '#9CA3AF'}
            />
            <ThemedText className="mt-6 text-xl sm:text-2xl font-semibold">
              {searchText ? 'No matching todos' : todos.length === 0 ? 'No todos yet!' : 'No todos in this filter'}
            </ThemedText>
            <ThemedText className="mt-3 text-base sm:text-lg text-gray-500 dark:text-gray-400 text-center px-4">
              {searchText
                ? 'Try a different search term'
                : todos.length === 0
                ? 'Add a todo above to get started'
                : 'All todos are in a different category'}
            </ThemedText>
          </View>
        ) : (
          sortedTodos.map((todo) => (
            <View
              key={todo.id}
              className={`flex-row items-center p-4 mb-3 rounded-xl ${
                isDark
                  ? 'bg-gray-800/50 border border-gray-700'
                  : 'bg-gray-50 border border-gray-200'
              } ${todo.completed ? 'opacity-60' : ''}`}>
              <TouchableOpacity
                className="flex-1 flex-row items-center gap-3"
                onPress={() => toggleTodo(todo.id)}
                activeOpacity={0.7}>
                <IconSymbol
                  name={todo.completed ? 'checkmark.circle.fill' : 'circle'}
                  size={28}
                  color={todo.completed ? colors.tint : colors.icon}
                />
                <View className="flex-1">
                  <Text
                    className={`text-base sm:text-lg ${
                      todo.completed
                        ? 'line-through text-gray-500 dark:text-gray-500'
                        : isDark
                        ? 'text-white'
                        : 'text-gray-900'
                    }`}>
                    {todo.text}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <View
                      className="px-2 py-0.5 rounded"
                      style={{ backgroundColor: getPriorityColor(todo.priority) + '30' }}>
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: getPriorityColor(todo.priority) }}>
                        {getPriorityLabel(todo.priority)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => startEdit(todo)}
                  className="p-2 active:opacity-70"
                  activeOpacity={0.7}>
                  <View className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                    <IconSymbol name="pencil" size={18} color="#3B82F6" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const priorities: PriorityType[] = ['high', 'medium', 'low'];
                    const currentIndex = priorities.indexOf(todo.priority);
                    const nextPriority = priorities[(currentIndex + 1) % priorities.length];
                    updatePriority(todo.id, nextPriority);
                  }}
                  className="p-2 active:opacity-70"
                  activeOpacity={0.7}>
                  <View className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                    <IconSymbol name="flag.fill" size={18} color="#A855F7" />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteTodo(todo.id)}
                  className="p-2 active:opacity-70"
                  activeOpacity={0.7}>
                  <View className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                    <IconSymbol name="trash" size={18} color="#EF4444" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editingTodo !== null}
        transparent
        animationType="slide"
        onRequestClose={cancelEdit}>
        <View className="flex-1 justify-end bg-black/50">
          <View
            className={`rounded-t-3xl p-6 ${
              isDark ? 'bg-gray-900' : 'bg-white'
            }`}>
            <ThemedText className="text-2xl font-bold mb-4">Edit Todo</ThemedText>
            <TextInput
              className={`h-14 px-4 text-base border-2 rounded-xl mb-4 ${
                isDark
                  ? 'border-gray-600 text-white bg-gray-800'
                  : 'border-gray-300 text-gray-900 bg-gray-50'
              }`}
              placeholder="Todo text..."
              placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
              value={editText}
              onChangeText={setEditText}
              autoFocus
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={cancelEdit}
                className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl"
                activeOpacity={0.7}>
                <Text className="text-center font-semibold text-gray-700 dark:text-gray-300">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={saveEdit}
                className="flex-1 py-3 bg-blue-600 dark:bg-blue-500 rounded-xl"
                activeOpacity={0.7}>
                <Text className="text-center font-semibold text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Priority Selection Modal */}
      <Modal
        visible={showPriorityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPriorityModal(false)}>
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/50"
          activeOpacity={1}
          onPress={() => setShowPriorityModal(false)}>
          <View
            className={`w-11/12 rounded-2xl p-6 ${
              isDark ? 'bg-gray-900' : 'bg-white'
            }`}
            onStartShouldSetResponder={() => true}>
            <ThemedText className="text-2xl font-bold mb-4">Select Priority</ThemedText>
            {(['high', 'medium', 'low'] as PriorityType[]).map((priority) => (
              <TouchableOpacity
                key={priority}
                onPress={() => {
                  setSelectedPriority(priority);
                  setShowPriorityModal(false);
                }}
                className={`flex-row items-center p-4 mb-2 rounded-xl ${
                  selectedPriority === priority
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : isDark
                    ? 'bg-gray-800'
                    : 'bg-gray-50'
                }`}
                activeOpacity={0.7}>
                <View
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: getPriorityColor(priority) }}
                />
                <Text
                  className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  {getPriorityLabel(priority)} Priority
                </Text>
                {selectedPriority === priority && (
                  <View className="ml-auto">
                    <IconSymbol
                      name="checkmark"
                      size={20}
                      color={colors.tint}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ThemedView>
  );
}
