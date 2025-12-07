# 🐑 SPACESHEEP ADVENTURE 🚀
## 🕹️ Game Description
Spacesheep Adventure is a fun browser-based game where you control a sheep in space! Your mission: dodge as many asteroids as possible and survive for as long as you can.

## 🎮 Game Rules
- Controls:
  1. Arrow Up – Move sheep upward
  2. Arrow Down – Move sheep downward
  3. Arrow Left – Move sheep left
  4. Arrow Right – Move sheep right
- Game Over: The game ends when your sheep crashes into an asteroid.
- Score: Score increase along with time

## 🛠 How to Play
1. Open the game in your browser. 
2. You can login/register/play as guest. Note that for guest player no data will be stored inclusing highest score.
2. Click Start Game to begin.
3. Use arrow keys to dodge incoming asteroids.
4. Try to survive as long as possible and achieve the highest score!

## 🚀 Getting Started
### Backend Setup
> It is ok if you don't setup backend, just leaderboard, inventory, shop, login/register feature cannot be used, but you still can play as usual
1. Navigate to [backend repository](https://github.com/lemonmel-2/bpwebapi).
2. Follow instruction in configuration section for required setup.
3. Start the backend server:
  ```
  dotnet run
  ```
  The backend will run on `http://localhost:5242` by default.

### Frontend Setup
1. Open the `frontend` folder in your code editor.
2. Right-click `index.html` and select **Open with Live Server** (using VS Code with the Live Server extension).
3. The game will open in your browser at `http://localhost:5500/bptraining/frontend/` (or your configured port).

## ✨ Features
- **Leaderboard:** Compete with other players and see your high scores on the global leaderboard.
- **Inventory:** Your collection of items.
- **Shop:** Spend your earned points to generate a random item to store in your collection. (you have unlimited points for now 🎉)
- **Login/Register:** Create an account or log in to save your progress and scores. 
