import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

type FileSystemItem = {
  name: string;
  uri: string;
  isDirectory: boolean;
};

type FileDetails = {
  name: string;
  type: string;
  size: string;
  lastModified: string;
} | null;

const APP_DATA_DIR_NAME = 'AppData';
const appDataDirUri = FileSystem.documentDirectory + APP_DATA_DIR_NAME + '/';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  actionButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  icon: {
    marginRight: 15,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#777',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
    flex: 1,
    borderRadius: 5,
    paddingVertical: 10,
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
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  goUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  goUpText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
  pathText: {
    fontSize: 14,
    color: '#777',
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  detailsModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  detailsModalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailsLabel: {
    fontWeight: 'bold',
    marginRight: 10,
    flex: 1,
  },
  detailsValue: {
    flex: 2,
  },
  detailsCloseButton: {
    marginTop: 20,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  detailsCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  detailsButton: {
    padding: 8,
  },
});

export default function FileManagerScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(appDataDirUri);
  const [directoryContent, setDirectoryContent] = useState<FileSystemItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(true);
  const [selectedFileDetails, setSelectedFileDetails] = useState<FileDetails>(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const loadDirectoryContent = useCallback(async (path: string) => {
    setIsLoading(true);
    try {
      const items = await FileSystem.readDirectoryAsync(path);
      const detailedItems: FileSystemItem[] = [];
      for (const item of items) {
        const itemUri = path + item;
        try {
          const info = await FileSystem.getInfoAsync(itemUri);
          if (info.exists) {
            detailedItems.push({
              name: item,
              uri: info.uri,
              isDirectory: info.isDirectory,
            });
          }
        } catch (itemError) {
          console.warn(`Could not get info for item ${itemUri}:`, itemError);
        }
      }
      detailedItems.sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) {
          return a.isDirectory ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      setDirectoryContent(detailedItems);
      setCurrentPath(path);
    } catch (error) {
      setDirectoryContent([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const setupDirectory = async () => {
      try {
        const dirInfo = await FileSystem.getInfoAsync(appDataDirUri);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(appDataDirUri, {
            intermediates: true,
          });
        }
      } catch (error) {
        console.error('Error setting up directory:', error);
        setIsLoading(false);
        return;
      }
      await loadDirectoryContent(appDataDirUri);
    };
    setupDirectory();
  }, [loadDirectoryContent]);

  const getFileDetails = useCallback(async (uri: string, name: string) => {
    try {
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) {
        const type = name.lastIndexOf('.') > 0 ? name.substring(name.lastIndexOf('.') + 1) : 'файл';
        const size = info.size ? `${(info.size / 1024).toFixed(2)} KB` : '0 KB';
        const lastModified = info.modificationTime ? new Date(info.modificationTime * 1000).toLocaleString() : 'невідомо';
        setSelectedFileDetails({ name, type, size, lastModified });
        setIsDetailsModalVisible(true);
      } else {
        Alert.alert('Помилка', 'Інформацію про файл не знайдено.');
      }
    } catch (error: any) {
      console.error('Error getting file details:', error);
      Alert.alert('Помилка', 'Не вдалося отримати інформацію про файл.');
    }
  }, []);

  const handleItemPress = (item: FileSystemItem) => {
    if (item.isDirectory) {
      loadDirectoryContent(item.uri + '/');
    } else if (item.name.endsWith('.txt')) {
      router.push({
        pathname: '/editor',
        params: { fileUri: item.uri, fileName: item.name },
      });
    }
  };

  const openDetailsModal = useCallback((item: FileSystemItem) => {
    if (!item.isDirectory) {
      getFileDetails(item.uri, item.name);
    }
  }, [getFileDetails]);

  const openCreateModal = (creatingFolder: boolean) => {
    setIsCreatingFolder(creatingFolder);
    setNewItemName('');
    setIsModalVisible(true);
  };

  const handleCreateItem = async () => {
    if (!newItemName.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введіть назву.');
      return;
    }

    const newItemUri =
      currentPath + newItemName.trim() + (isCreatingFolder ? '/' : '.txt');

    try {
      const existingInfo = await FileSystem.getInfoAsync(newItemUri);
      if (existingInfo.exists) {
        Alert.alert(
          'Помилка',
          `Елемент з назвою "${newItemName.trim()}" вже існує.`
        );
        return;
      }

      if (isCreatingFolder) {
        await FileSystem.makeDirectoryAsync(newItemUri);
        Alert.alert('Успіх', `Папку "${newItemName.trim()}" створено.`);
      } else {
        await FileSystem.writeAsStringAsync(newItemUri, '');
        Alert.alert('Успіх', `Файл "${newItemName.trim()}.txt" створено.`);
      }

      setIsModalVisible(false);
      await loadDirectoryContent(currentPath);
    } catch (error: any) {
      console.error('Error creating item:', error);
      Alert.alert(
        'Помилка створення',
        error.message || 'Не вдалося створити елемент.'
      );
    }
  };

  const handleGoUp = () => {
    if (currentPath !== appDataDirUri && currentPath.length > appDataDirUri.length) {
      const parentPath = currentPath
        .substring(0, currentPath.length - 1)
        .substring(
          0,
          currentPath.substring(0, currentPath.length - 1).lastIndexOf('/') + 1
        );
      loadDirectoryContent(parentPath);
    } else {
      console.log('Вже в кореневій папці AppData');
    }
  };

  const renderListItem = ({ item }: ListRenderItemInfo<FileSystemItem>) => (
    <View style={styles.listItem}>
      <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} onPress={() => handleItemPress(item)}>
        <Feather
          name={item.isDirectory ? 'folder' : 'file-text'}
          size={20}
          color={item.isDirectory ? '#f1c40f' : '#3498db'}
          style={styles.icon}
        />
        <Text style={styles.itemName}>{item.name}</Text>
      </TouchableOpacity>
      {!item.isDirectory && (
        <TouchableOpacity onPress={() => openDetailsModal(item)} style={styles.detailsButton}>
          <Feather name="info" size={20} color="#777" />
        </TouchableOpacity>
      )}
    </View>
  );

  const displayPath = currentPath.replace(FileSystem.documentDirectory || '', '');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Файли</Text>
      </View>

      <Text style={styles.pathText}>Шлях: {displayPath === '/AppData/' ? 'Домашня папка' : displayPath}</Text>

      {currentPath !== appDataDirUri && (
        <TouchableOpacity onPress={handleGoUp} style={styles.goUpButton}>
          <Feather name="arrow-up" size={20} color="#555" />
          <Text style={styles.goUpText}>На рівень вище</Text>
        </TouchableOpacity>
      )}

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      ) : (
        <FlatList
          data={directoryContent}
          renderItem={renderListItem}
          keyExtractor={(item) => item.uri}
          ListEmptyComponent={<Text style={styles.emptyText}>Папка порожня</Text>}
          style={{ flex: 1 }}
        />
      )}

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity onPress={() => openCreateModal(true)} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>
            <Feather name="folder-plus" size={18} color="#fff" style={{ marginRight: 5 }} />
            Створити папку
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openCreateModal(false)} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>
            <Feather name="file-plus" size={18} color="#fff" style={{ marginRight: 5 }} />
            Створити файл
          </Text>
        </TouchableOpacity>
      </View>

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
              placeholder={
                isCreatingFolder ? 'Назва папки' : 'Назва файлу (без .txt)'
              }
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
                onPress={handleCreateItem}
              >
                <Text style={styles.modalButtonText}>Створити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDetailsModalVisible}
        onRequestClose={() => setIsDetailsModalVisible(false)}
      >
        <View style={styles.detailsModalOverlay}>
          <View style={styles.detailsModalContent}>
            <Text style={styles.detailsTitle}>Деталі файлу</Text>
            {selectedFileDetails && (
              <>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Назва:</Text>
                  <Text style={styles.detailsValue}>{selectedFileDetails.name}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Тип:</Text>
                  <Text style={styles.detailsValue}>{selectedFileDetails.type}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Розмір:</Text>
                  <Text style={styles.detailsValue}>{selectedFileDetails.size}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailsLabel}>Остання зміна:</Text>
                  <Text style={styles.detailsValue}>{selectedFileDetails.lastModified}</Text>
                </View>
              </>
            )}
            <TouchableOpacity
              style={styles.detailsCloseButton}
              onPress={() => setIsDetailsModalVisible(false)}
            >
              <Text style={styles.detailsCloseButtonText}>Закрити</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}