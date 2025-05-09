import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';

const APP_DATA_DIR_NAME = 'AppData';
const appDataDirUri = FileSystem.documentDirectory + APP_DATA_DIR_NAME + '/';

type FileSystemItem = {
  name: string;
  uri: string;
  isDirectory: boolean;
};

export default function FileManagerScreen() {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(appDataDirUri);
  const [directoryContent, setDirectoryContent] = useState<FileSystemItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(true);

  const loadDirectoryContent = useCallback(async (path: string) => {
    setIsLoading(true);
    try {
      const items = await FileSystem.readDirectoryAsync(path);
      const detailedItems: FileSystemItem[] = items.map(item => ({
        name: item,
        uri: path + item,
        isDirectory: (item.endsWith('/')),
      }));
      setDirectoryContent(detailedItems);
      setCurrentPath(path);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося завантажити вміст папки.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const setupDirectory = async () => {
      const dirInfo = await FileSystem.getInfoAsync(appDataDirUri);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(appDataDirUri, { intermediates: true });
      }
      loadDirectoryContent(appDataDirUri);
    };
    setupDirectory();
  }, [loadDirectoryContent]);

  const handleItemPress = (item: FileSystemItem) => {
    if (item.isDirectory) {
      loadDirectoryContent(item.uri + '/');
    } else if (item.name.endsWith('.txt')) {
      router.push({ pathname: '/editor', params: { fileUri: item.uri, fileName: item.name } });
    }
  };

  const openCreateModal = (creatingFolder: boolean) => {
    setIsCreatingFolder(creatingFolder);
    setNewItemName('');
    setIsModalVisible(true);
  };

  const handleCreate = useCallback(async () => {
    if (!newItemName.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введіть назву.');
      return;
    }
    const newItemUri = currentPath + newItemName.trim() + (isCreatingFolder ? '/' : '.txt');
    try {
      if (isCreatingFolder) {
        await FileSystem.makeDirectoryAsync(newItemUri);
        Alert.alert('Успіх', `Папку "${newItemName.trim()}" створено.`);
      } else {
        await FileSystem.writeAsStringAsync(newItemUri, '');
        Alert.alert('Успіх', `Файл "${newItemName.trim()}.txt" створено.`);
      }
      loadDirectoryContent(currentPath);
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося створити елемент.');
    } finally {
      setIsModalVisible(false);
      setNewItemName('');
    }
  }, [currentPath, isCreatingFolder, newItemName, loadDirectoryContent]);

  const renderListItem = ({ item }: ListRenderItemInfo<FileSystemItem>) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View>
        <Text>{item.isDirectory ? '[ПАПКА]' : '[ФАЙЛ]'}</Text>
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <View>
        <Text>Розташування: {currentPath.replace(FileSystem.documentDirectory || '', '')}</Text>
        <View>
          <TouchableOpacity onPress={() => openCreateModal(false)}>
            <Text>[+ФАЙЛ]</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openCreateModal(true)}>
            <Text>[+ПАПКА]</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <FlatList
          data={directoryContent}
          renderItem={renderListItem}
          keyExtractor={(item) => item.uri}
          ListEmptyComponent={<Text>Ця папка порожня</Text>}
          style={{ flex: 1 }}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View>
            <Text>
              {isCreatingFolder ? 'Створити нову папку' : 'Створити новий файл'}
            </Text>
            <TextInput
              placeholder={isCreatingFolder ? 'Назва папки' : 'Назва файлу (без .txt)'}
              value={newItemName}
              onChangeText={setNewItemName}
              autoCapitalize="none"
              autoFocus={true}
            />
            <View>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreate}>
                <Text>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}