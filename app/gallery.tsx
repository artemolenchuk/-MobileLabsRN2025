import React from 'react';
import { ScrollView, Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  gallery: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', padding: 5 },
  galleryImage: { width: '48%', height: 150, marginBottom: 10, borderRadius: 5 },
  imageShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
});

const photos = [
  'https://surli.cc/semolu',
  'https://surl.gd/vreqcr',
  'https://surl.lu/hlcwet',
  'https://surli.cc/xcyhpu',
  'https://surl.lu/bheuru',
  'https://surl.lu/exvpqw',
];

export default function GalleryScreen() {
  return (
    <ScrollView contentContainerStyle={styles.gallery}>
      {photos.map((uri, index) => (
        <Image
          key={index}
          source={{ uri }}
          style={[styles.galleryImage, styles.imageShadow]}
          resizeMode="cover"
        />
      ))}
    </ScrollView>
  );
}
