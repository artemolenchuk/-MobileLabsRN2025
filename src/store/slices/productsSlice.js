import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    { id: '1', name: 'Смартфон X1', description: 'Потужний смартфон з чудовою камерою.', price: 999, image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Смартфон' },
    { id: '2', name: 'Ноутбук Pro', description: 'Легкий та швидкий ноутбук для роботи.', price: 1499, image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Ноутбук' },
    { id: '3', name: 'Навушники Sound', description: 'Бездротові навушники з глибоким басом.', price: 129, image: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=Навушники' },
    { id: '4', name: 'Планшет View', description: 'Великий екран для розваг та навчання.', price: 499, image: 'https://via.placeholder.com/150/FFFF00/000000?text=Планшет' },
    { id: '5', name: 'Смарт-годинник Fit', description: 'Відстежує активність та сон.', price: 199, image: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=Годинник' },
  ],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
});

export default productsSlice.reducer;