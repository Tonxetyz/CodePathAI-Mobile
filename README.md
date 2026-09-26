# CodePath AI Mobile

Главный экран Expo-приложения для микро-обучения программированию и AI-промптингу.

## Запуск

```bash
npm.cmd install
npm.cmd start
```

`lucide-react-native` пока формально ограничивает peer dependency React 18, хотя экран совместим с React 19 из Expo. Файл `.npmrc` снимает только эту проверку при установке.

Нажмите `a`, `i` или `w` в Expo CLI, чтобы открыть Android, iOS или web.

## Структура

```text
CodePathAI-Mobile/
├── App.tsx                         # точка входа и Safe Area
├── components/PromptLabScreen.tsx  # интерактивный главный экран
├── global.css                      # директивы Tailwind
├── tailwind.config.js              # токены NativeWind
├── metro.config.js                 # связка Metro + NativeWind
├── babel.config.js                 # Babel-конфигурация NativeWind
└── app.json                        # Expo-конфигурация
```
