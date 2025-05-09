import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import * as FileSystem from 'expo-file-system';

export default function EditorScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [fileContent, setFileContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { fileUri, fileName } = useLocalSearchParams<{
    fileUri: string;
    fileName: string;
  }>();
  const navigation = useNavigation();

  useEffect(() => {
    const loadFileContent = async () => {
      if (!fileUri) {
        setError('Не вдалося отримати шлях до файлу.');
        setIsLoading(false);
        return;
      }
      try {
        const content = await FileSystem.readAsStringAsync(fileUri);
        setFileContent(content);
        setError(null);
      } catch (err: any) {
        setError('Не вдалося прочитати файл: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadFileContent();
  }, [fileUri]);

  const handleSaveFile = useCallback(async () => {
    if (!fileUri) {
      Alert.alert('Помилка', 'Немає шляху для збереження файлу.');
      return;
    }
    try {
      await FileSystem.writeAsStringAsync(fileUri, fileContent);
      navigation.goBack();
      Alert.alert('Успіх', 'Файл збережено!');
    } catch (err: any) {
      Alert.alert('Помилка', 'Не вдалося зберегти файл.');
    }
  }, [fileUri, fileContent, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleSaveFile}>
          <Text>Зберегти</Text>
        </TouchableOpacity>
      ),
      headerStyle: { backgroundColor: 'gray' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
      title: fileName || 'Редактор',
    });
  }, [navigation, handleSaveFile, fileName]);

  const handleTextChange = (text: string) => {
    setFileContent(text);
  };

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Завантаження файлу...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <TextInput
        value={fileContent}
        onChangeText={handleTextChange}
        multiline={true}
        textAlignVertical="top"
        scrollEnabled={false}
      />
    </ScrollView>
  );
}