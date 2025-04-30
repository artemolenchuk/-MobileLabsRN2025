import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  title: { fontSize: 22, textAlign: 'center', marginBottom: 10 },
  item: { flexDirection: 'row', marginBottom: 15, backgroundColor: '#f9f9f9', padding: 10, borderRadius: 5 },
  image: { width: 80, height: 80, marginRight: 10, borderRadius: 5 },
  newsTitle: { fontSize: 16, fontWeight: 'bold' },
  newsDate: { fontSize: 12, color: 'gray', marginBottom: 5 },
  imageShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});

const newsData = [
  {
    title: 'Студентка університету взяла участь у Міжнародній школі',
    date: '2025-04-21',
    shortText: 'У Міжнародній школі «Liberal Art and Sciences» 10–13 квітня (м. Паронін, Польща) взяли участь здобувачі освіти з різних країн світу',
    imageUri: 'https://surl.li/tfkkgy',
  },
  {
    title: 'День довкілля в Житомирській політехніці',
    date: '2025-04-20',
    shortText: 'У межах святкування Дня довкілля студенти факультету гірничої справи, природокористування та будівництва виготовляли українські ляльки-мотанки',
    imageUri: 'https://surl.li/jrlina',
  },
  {
    title: 'Студенти університету долучилися до фахової дискусії ',
    date: '2025-04-19',
    shortText: '16 квітня 2025 року в Домі української культури м. Житомир відбулася відкрита фахова зустріч, присвячена ролі культурної спадщини у формуванні ідентичності міста ',
    imageUri: 'https://surl.li/vxnppb',
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={{ padding: 10 }}>
      <Text style={styles.title}>Новини</Text>
      {newsData.map((news, index) => (
        <View key={index} style={styles.item}>
          <Image
            source={{ uri: news.imageUri }}
            style={[styles.image, styles.imageShadow]}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.newsTitle}>{news.title}</Text>
            <Text style={styles.newsDate}>{news.date}</Text>
            <Text>{news.shortText}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
