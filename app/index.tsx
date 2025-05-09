import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pathText: {
    fontSize: 16,
    color: '#555',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
    fontSize: 24,
    color: '#777',
  },
  itemName: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#777',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#3498db',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabIcon: {
    fontSize: 24,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'stretch',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#bdc3c7',
    marginRight: 5,
  },
  modalButtonCreate: {
    backgroundColor: '#27ae60',
    marginLeft: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

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
        isDirectory: (item.endsWith('/')), // Просте визначення папки
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
    <TouchableOpacity onPress={() => handleItemPress(item)} style={styles.listItem}>
      <View style={styles.itemInfo}>
        <Feather
          name={item.isDirectory ? 'folder' : 'file-text'}
          size={24}
          color={item.isDirectory ? '#f1c40f' : '#3498db'}
          style={styles.icon}
        />
        <Text style={styles.itemName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.pathText}>Розташування: {currentPath.replace(FileSystem.documentDirectory || '', '')}</Text>
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
          ListEmptyComponent={<Text style={styles.emptyText}>Ця папка порожня</Text>}
          style={{ flex: 1 }}
        />
      )}

      <TouchableOpacity onPress={() => openCreateModal(false)} style={[styles.fab, { marginLeft: 0 }]}>
        <Feather name="file-plus" style={styles.fabIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openCreateModal(true)} style={styles.fab}>
        <Feather name="folder-plus" style={styles.fabIcon} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isCreatingFolder ? 'Створити нову папку' : 'Створити новий файл'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={isCreatingFolder ? 'Назва папки' : 'Назва файлу (без .txt)'}
              value={newItemName}
              onChangeText={setNewItemName}
              autoCapitalize="none"
              autoFocus={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCreate]}
                onPress={handleCreate}
              >
                <Text style={styles.modalButtonText}>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}