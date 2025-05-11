import React, { useState, useCallback } from 'react';
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
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useFileManager, { FileSystemItem } from '../hooks/useFileManager';
import * as FileSystem from 'expo-file-system';

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
  memoryInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  memoryInfoText: {
    fontSize: 14,
    color: '#777',
  },
  goUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  goUpText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
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
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    flexDirection: 'row',
  },
  fab: {
    backgroundColor: '#3498db',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginLeft: 10,
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
    flex: 1,
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
  detailsButton: {
    marginLeft: 10,
  },
  deleteButton: {
    marginLeft: 10,
    color: '#e74c3c',
  },
  memoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  memoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2ecc71',
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function FileManagerScreen() {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(true);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const {
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
    setIsDetailsModalVisible: setDetailsModalVisible,
    setItemToDeleteUri: setDeleteUri,
    setItemToDeleteName: setDeleteName,
  } = useFileManager();

  const handleItemPress = (item: FileSystemItem) => {
    if (item.isDirectory) {
      loadDirectoryContent(item.uri + '/');
    } else if (item.name.endsWith('.txt')) {
      router.push({
        pathname: '/TextEditorScreen',
        params: { fileUri: item.uri, fileName: item.name },
      });
    }
  };

  const openDetailsModal = useCallback((item: FileSystemItem) => {
    if (!item.isDirectory) {
      getFileDetails(item.uri, item.name);
    }
  }, [getFileDetails]);

  const openDeleteConfirmationModal = useCallback((item: FileSystemItem) => {
    setDeleteUri(item.uri);
    setDeleteName(item.name);
    setIsDeleteModalVisible(true);
  }, []);

  const closeDeleteConfirmationModal = useCallback(() => {
    setDeleteUri(null);
    setDeleteName(null);
    setIsDeleteModalVisible(false);
  }, []);

  const openCreateModal = (creatingFolder: boolean) => {
    setIsCreatingFolder(creatingFolder);
    setNewItemName('');
    setIsModalVisible(true);
  };

  const handleCreate = useCallback(() => {
    handleCreateItem(newItemName, isCreatingFolder);
    setNewItemName('');
  }, [newItemName, isCreatingFolder, handleCreateItem]);

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
      <View style={{ flexDirection: 'row' }}>
        {!item.isDirectory && (
          <TouchableOpacity onPress={() => openDetailsModal(item)} style={styles.detailsButton}>
            <Feather name="info" size={20} color="#777" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => openDeleteConfirmationModal(item)} style={styles.deleteButton}>
          <Feather name="trash-2" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <TouchableOpacity
            onPress={handleGoUp}
            disabled={currentPath === FileSystem.documentDirectory + '/AppData/'}
            style={styles.goUpButton}
          >
            <Feather name="arrow-up" size={20} color="#555" />
            <Text style={styles.goUpText}>Назад</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefreshStorageInfo} style={styles.refreshButton}>
            <Text style={styles.refreshButtonText}>Оновити</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.pathText}>Розташування: {displayPath === '/AppData/' ? 'Внутрішня пам\'ять' : displayPath}</Text>
        <View style={{ marginTop: 10 }}>
          <View style={styles.memoryRow}>
            <Text style={styles.memoryLabel}>Зайнято:</Text>
            <Text style={styles.memoryInfoText}>{formatBytes(usedStorage)}</Text>
          </View>
          <View style={styles.memoryRow}>
            <Text style={styles.memoryLabel}>Вільно:</Text>
            <Text style={styles.memoryInfoText}>{formatBytes(freeStorage)}</Text>
          </View>
          <View style={styles.memoryRow}>
            <Text style={styles.memoryLabel}>Всього:</Text>
            <Text style={styles.memoryInfoText}>{formatBytes(totalStorage)}</Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
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

      <View style={[styles.fabContainer, { bottom: insets.bottom + 20 }]}>
        <TouchableOpacity onPress={() => openCreateModal(false)} style={[styles.fab, { marginLeft: 0 }]}>
          <Feather name="file-plus" style={styles.fabIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openCreateModal(true)} style={styles.fab}>
          <Feather name="folder-plus" style={styles.fabIcon} />
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
                onPress={handleCreate}
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
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Деталі файлу</Text>
            {selectedFileDetails && (
              <>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold', marginRight: 10, flex: 1 }}>Назва:</Text>
                  <Text style={{ flex: 2 }}>{selectedFileDetails.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold', marginRight: 10, flex: 1 }}>Тип:</Text>
                  <Text style={{ flex: 2 }}>{selectedFileDetails.type}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold', marginRight: 10, flex: 1 }}>Розмір:</Text>
                  <Text style={{ flex: 2 }}>{selectedFileDetails.size}</Text>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold', marginRight: 10, flex: 1 }}>Остання зміна:</Text>
                  <Text style={{ flex: 2 }}>{selectedFileDetails.lastModified}</Text>
                </View>
              </>
            )}
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#e74c3c', marginTop: 20 }]}
              onPress={() => setDetailsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Закрити</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={closeDeleteConfirmationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Підтвердження видалення</Text>
            <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center' }}>Ви впевнені, що хочете видалити "{itemToDeleteName}"?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={closeDeleteConfirmationModal}
              >
                <Text style={styles.modalButtonText}>Скасувати</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCreate, { backgroundColor: '#e74c3c' }]}
                onPress={handleDeleteItem}
              >
                <Text style={styles.modalButtonText}>Видалити</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}