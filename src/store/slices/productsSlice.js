import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: '1',
      name: 'Електрогітара Jackson',
      description: 'Класична електрогітара для важкого звучання.',
      price: 699.99,
      image: 'https://surl.lu/rkbocb', // додай посилання
    },
    {
      id: '2',
      name: 'Акустична гітара Yamaha',
      description: 'Чудовий вибір для початківців та професіоналів.',
      price: 449.5,
      image: 'https://surli.cc/aissoj', // додай посилання
    },
    {
      id: '3',
      name: 'Комплект струн Elixir Nanoweb',
      description: 'Довговічні струни з покриттям.',
      price: 15.0,
      image: 'https://surl.li/jrlwws', // додай посилання
    },
    {
      id: '4',
      name: 'Гітарний комбопідсилювач Marshall',
      description: 'Легендарний звук для репетицій та концертів.',
      price: 299.0,
      image: 'https://surl.li/bfterp', // додай посилання
    },
    {
      id: '5',
      name: 'Медіатори Dunlop Tortex (12 шт.)',
      description: 'Різні товщини для комфортної гри.',
      price: 7.5,
      image: 'https://surl.li/lvgxrf', // додай посилання
    },
    {
      id: '6',
      name: 'Гітарний ремінь Levy\'s',
      description: 'Надійний та зручний ремінь для гри стоячи.',
      price: 25.99,
      image: 'https://surl.li/rghsms', // додай посилання
    },
  ],
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
});

export default productsSlice.reducer;
