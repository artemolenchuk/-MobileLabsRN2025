import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useLocalSearchParams, Stack, useNavigation } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Feather } from '@expo/vector-icons';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    scrollContentContainer: {
        flexGrow: 1,
        padding: 15,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#e74c3c',
        textAlign: 'center',
        fontSize: 16,
    },
    headerButton: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    textInput: {
        flex: 1,
        minHeight: 300,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        textAlignVertical: 'top',
    },
    dirtyIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#f39c12',
        borderRadius: 8,
        paddingVertical: 5,
        paddingHorizontal: 8,
    },
    dirtyIndicatorText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default function EditorScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [fileContent, setFileContent] = useState('');
    const [originalContent, setOriginalContent] = useState('');
    const [isDirty, setIsDirty] = useState(false);
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
                setOriginalContent(content);
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

        if (!isDirty) {
            Alert.alert('Інформація', 'Немає змін для збереження.');
            navigation.goBack();
            return;
        }

        try {
            await FileSystem.writeAsStringAsync(fileUri, fileContent);
            setOriginalContent(fileContent);
            setIsDirty(false);
            navigation.goBack();
            Alert.alert('Успіх', 'Файл збережено!');
        } catch (err: any) {
            console.error('EditorScreen: Error saving file:', err);
            Alert.alert('Помилка', 'Не вдалося зберегти файл.');
        }
    }, [fileUri, fileContent, navigation, isDirty]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleSaveFile}
                    style={styles.headerButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Feather name="save" size={18} color="#fff" style={{ marginRight: 5 }} />
                    <Text style={styles.headerButtonText}>Зберегти</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation, handleSaveFile, isDirty]);

    const handleTextChange = (text: string) => {
        setFileContent(text);
        setIsDirty(text !== originalContent);
    };

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={{ marginTop: 10, color: '#777' }}>Завантаження файлу...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContentContainer}
        >
            <Stack.Screen options={{ title: fileName || 'Редактор' }} />
            {isDirty && (
                <View style={styles.dirtyIndicator}>
                    <Text style={styles.dirtyIndicatorText}>Змінено</Text>
                </View>
            )}
            <TextInput
                style={styles.textInput}
                value={fileContent}
                onChangeText={handleTextChange}
                multiline={true}
                textAlignVertical="top"
                scrollEnabled={false}
            />
        </ScrollView>
    );
}