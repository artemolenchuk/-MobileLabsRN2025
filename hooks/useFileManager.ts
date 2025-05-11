import { useState, useCallback, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

export type FileSystemItem = {
  name: string;
  uri: string;
  isDirectory: boolean;
  size?: number;
};

export type FileDetails = {
  name: string;
  type: string;
  size: string;
  lastModified: string;
} | null;

const APP_DATA_DIR_NAME = 'AppData';
const appDataDirUri = FileSystem.documentDirectory + APP_DATA_DIR_NAME + '/';
const INITIAL_TOTAL_STORAGE = 128 * 1024 * 1024 * 1024; 

const useFileManager = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(appDataDirUri);
  const [directoryContent, setDirectoryContent] = useState<FileSystemItem[]>([]);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [selectedFileDetails, setSelectedFileDetails] = useState<FileDetails>(null);
  const [itemToDeleteUri, setItemToDeleteUri] = useState<string | null>(null);
  const [itemToDeleteName, setItemToDeleteName] = useState<string | null>(null);
  const [totalStorage, setTotalStorage] = useState(INITIAL_TOTAL_STORAGE);
  const [usedStorage, setUsedStorage] = useState(0);

  const loadDirectoryContent = useCallback(async (path: string) => {
    setIsLoading(true);
    try {
      const items = await FileSystem.readDirectoryAsync(path);
      const detailedItems: FileSystemItem[] = [];
      let currentUsedStorage = 0;
      for (const item of items) {
        const itemUri = path + item;
        try {
          const info = await FileSystem.getInfoAsync(itemUri);
          if (info.exists && !info.isDirectory && typeof info.size === 'number') {
            detailedItems.push({
              name: item,
              uri: info.uri,
              isDirectory: info.isDirectory,
              size: info.size,
            });
            currentUsedStorage += info.size;
          } else if (info.exists && info.isDirectory) {
            detailedItems.push({
              name: item,
              uri: info.uri,
              isDirectory: info.isDirectory,
              size: 0,
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
      setUsedStorage(currentUsedStorage);
    } catch (error) {
      setDirectoryContent([]);
      setUsedStorage(0);
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
      } else {
        Alert.alert('Помилка', 'Інформацію про файл не знайдено.');
      }
    } catch (error: any) {
      console.error('Error getting file details:', error);
      Alert.alert('Помилка', 'Не вдалося отримати інформацію про файл.');
    }
  }, []);

  const handleDeleteItem = useCallback(async () => {
    if (!itemToDeleteUri) {
      return;
    }

    setIsLoading(true);
    try {
      const info = await FileSystem.getInfoAsync(itemToDeleteUri);
      if (info.exists) {
        let deletedItemSize = 0;
        if (typeof info.size === 'number') {
          deletedItemSize = info.size;
        }
        await FileSystem.deleteAsync(itemToDeleteUri, { idempotent: true });
        setUsedStorage((prevUsedStorage) => prevUsedStorage - deletedItemSize);
        Alert.alert('Успіх', `"${itemToDeleteName}" видалено.`);
        await loadDirectoryContent(currentPath);
      } else {
        Alert.alert('Помилка', `"${itemToDeleteName}" не знайдено.`);
      }
    } catch (error: any) {
      console.error('Error deleting item:', error);
      Alert.alert('Помилка видалення', error.message || 'Не вдалося видалити елемент.');
    } finally {
      setIsLoading(false);
      setItemToDeleteUri(null);
      setItemToDeleteName(null);
    }
  }, [itemToDeleteUri, currentPath, loadDirectoryContent, itemToDeleteName]);

  const handleCreateItem = useCallback(async (newItemName: string, isCreatingFolder: boolean) => {
    if (!newItemName.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введіть назву.');
      return;
    }

    const newItemUri =
      currentPath + newItemName.trim() + (isCreatingFolder ? '/' : '.txt');
    const newItemSize = isCreatingFolder ? 0 : 1024;

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
        await loadDirectoryContent(currentPath);
      } else {
        await FileSystem.writeAsStringAsync(newItemUri, '');
        setUsedStorage((prevUsedStorage) => prevUsedStorage + newItemSize);
        Alert.alert('Успіх', `Файл "${newItemName.trim()}.txt" створено.`);
        await loadDirectoryContent(currentPath);
      }
    } catch (error: any) {
      console.error('Error creating item:', error);
      Alert.alert(
        'Помилка створення',
        error.message || 'Не вдалося створити елемент.'
      );
    }
  }, [currentPath, loadDirectoryContent]);

  const handleGoUp = useCallback(() => {
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
  }, [currentPath, loadDirectoryContent, appDataDirUri]);

  const handleRefreshStorageInfo = useCallback(() => {
    loadDirectoryContent(currentPath);
  }, [currentPath, loadDirectoryContent]);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const freeStorage = totalStorage - usedStorage;
  const displayPath = currentPath.replace(FileSystem.documentDirectory || '', '');

  return {
    isLoading,
    currentPath,
    directoryContent,
    selectedFileDetails,
    itemToDeleteUri,
    itemToDeleteName,
    totalStorage,
    usedStorage,
    loadDirectoryContent,
    getFileDetails,
    handleDeleteItem,
    handleCreateItem,
    handleGoUp,
    handleRefreshStorageInfo,
    formatBytes,
    freeStorage,
    displayPath,
    setCurrentPath,
    setIsDetailsModalVisible,
    setItemToDeleteUri,
    setItemToDeleteName,
  };
};

export default useFileManager;