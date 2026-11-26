require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Підключено до MongoDB!'))
  .catch(err => console.error(err));

// --- ПЕРСОНАЖІ ---
const Character = mongoose.model('Character', {
  name: String,        // Ім'я (напр. Тоні Сопрано)
  tree_type: {         // До якого дерева належить: ['family'], ['crime'] або обидва
    type: [String], 
    default: ['family'] 
  },
  role: String,        // Роль у родинному дереві (напр. Голова сім'ї)
  generation: Number,  // Покоління в сім'ї: 1, 2, 3...
  crime_role: String,  // Посада в кримінальній сім'ї (напр. Бос, Капо, Солдат)
  crime_rank: Number,  // Рівень ієрархії в мафії: 1 (Бос), 2 (Капо/Андербос), 3 (Солдат), 4 (Співучасник)
  photo: String,       // Посилання на фото або шлях /images/...
  description: String  // Короткий опис
});

app.get('/api/characters', async (req, res) => {
  const characters = await Character.find().sort({ generation: 1, crime_rank: 1 });
  res.json(characters);
});

app.post('/api/characters', async (req, res) => {
  const newChar = new Character(req.body);
  await newChar.save();
  res.json(newChar);
});


app.get('/api/characters', async (req, res) => {
  const characters = await Character.find().sort({ generation: 1 });
  res.json(characters);
});

app.post('/api/characters', async (req, res) => {
  const newChar = new Character(req.body);
  await newChar.save();
  res.json(newChar);
});

// --- СЕЗОНИ ---
const Season = mongoose.model('Season', {
  number: Number,          // Номер сезону (1, 2, 3...)
  year: Number,            // Рік виходу (1999, 2000...)
  episodes: Number,        // Кількість серій (13, 21)
  episode_list: [String],  // Масив назв серій
  poster: String,          // Посилання на постер
  description: String,     // Короткий опис сезону
  watch_url: String        // Посилання на перегляд сезону
});



// Отримати всі сезони (відсортовані від 1 до 6)
app.get('/api/seasons', async (req, res) => {
  const seasons = await Season.find().sort({ number: 1 });
  res.json(seasons);
});

// Додати новий сезон (на майбутнє)
app.post('/api/seasons', async (req, res) => {
  const newSeason = new Season(req.body);
  await newSeason.save();
  res.json(newSeason);
});

// --- ЛОКАЦІЇ ---
const Location = mongoose.model('Location', {
  name: String,        // Назва в серіалі (напр. Bada Bing!)
  real_name: String,   // Реальне місце зйомок / адреса
  category: String,    // Категорія: 'business' (Бізнес), 'food' (Заклади), 'home' (Житло/Інше)
  photo: String,       // Фото локації
  description: String, // Опис подій, пов'язаних із місцем
  map_url: String      // Посилання на Google Maps (за бажанням)
});

app.get('/api/locations', async (req, res) => {
  const locations = await Location.find();
  res.json(locations);
});

app.post('/api/locations', async (req, res) => {
  const newLocation = new Location(req.body);
  await newLocation.save();
  res.json(newLocation);
});

// --- АВТОМОБІЛІ ---
const Car = mongoose.model('Car', {
  model: String,       // Марка та модель авто (напр. 1999 Chevrolet Suburban)
  owner: String,       // Власник у серіалі (напр. Тоні Сопрано)
  seasons: String,     // В яких сезонах з'являється (напр. Сезони 1–4)
  category: String,    // Категорія для фільтра: 'tony' (Тоні), 'crew' (Команда ДіМео), 'family' (Сім'я та інші)
  photo: String,       // Посилання на фото автомобіля
  description: String  // Історія авто та знакові сцени з ним
});

app.get('/api/cars', async (req, res) => {
  const cars = await Car.find();
  res.json(cars);
});

app.post('/api/cars', async (req, res) => {
  const newCar = new Car(req.body);
  await newCar.save();
  res.json(newCar);
});

// --- САУНДТРЕК ---
const Track = mongoose.model('Track', {
  title: String,       // Назва пісні (напр. Woke Up This Morning)
  artist: String,      // Виконавець (напр. Alabama 3)
  episode: String,     // Сезон та серія (напр. Усі сезони — Заставка)
  category: String,    // Категорія: 'theme' (Заставка та фінали), 'scenes' (Культові сцени), 'italian' (Італійська класика)
  cover: String,       // Обкладинка альбому або кадр зі сцени
  description: String, // Контекст сцени, де звучить трек
  listen_url: String   // Посилання на YouTube або Spotify / Apple Music
});

app.get('/api/soundtrack', async (req, res) => {
  const tracks = await Track.find();
  res.json(tracks);
});

app.post('/api/soundtrack', async (req, res) => {
  const newTrack = new Track(req.body);
  await newTrack.save();
  res.json(newTrack);
});

// --- ГАРДЕРОБ (ГОДИННИКИ) ---
const Watch = mongoose.model('Watch', {
  title: String,          // Назва моделі (напр. Rolex Day-Date 36 «President»)
  character: String,      // Персонаж (напр. Тоні Сопрано)
  price: String,          // Орієнтовна ціна (напр. $35,000–$45,000)
  description: String,    // Опис моделі та контекст у серіалі
  characterPhoto: String, // Фото персонажа з годинником
  itemPhoto: String       // Окреме фото самого годинника
});

app.get('/api/watches', async (req, res) => {
  const watches = await Watch.find();
  res.json(watches);
});

app.post('/api/watches', async (req, res) => {
  const newWatch = new Watch(req.body);
  await newWatch.save();
  res.json(newWatch);
});


app.listen(3000, () => console.log('Сайт працює на http://localhost:3000'));
