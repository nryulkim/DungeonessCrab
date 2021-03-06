# Dungeoness Crab

[Live](http://www.namryulkim.com/DungeonessCrab)

## Background

Dungeoness Crab is a rogue-like hack and slash game built using JavaScript, HTML, and CSS. The idea is to have a character that fights crabs. As the character goes deeper in the dungeon, the monsters would get exponentially more difficult. Characters will gain experience and grow in strength linearly depending on the number of monsters and the difficulty of the monster they kill. Characters can augment their strength with the items they find while playing. Players are able to save up to 3 items on death.

<p align="center"><img src="./docs/screenshots/game.png" width="300px"></img></p>


## How to Play

### Movement
- Move around with W A S D.

### Attacking
- Left click in the direction you would like to attack.
- You do not need to click on the crabs directly

<p align="center"><img src="./docs/screenshots/attack.gif" width="300px"></img></p>


### Items
- Enemies have a chance to drop items after death.
<p align="center"><img src="./docs/screenshots/items.png" width="300px"></img></p>

- You are allowed to hold 6 items and equip up to 3 items.
  - If you pick up an item when you are full, the item will be destroyed.

<p align="center"><img src="./docs/screenshots/inventory.png" width="300px"></img></p>
<p align="center"><img src="./docs/screenshots/itemstats.png" width="300px"></img></p>

- You can equip an item by clicking on the item
- You can remove the item by clicking on the red X.
- Items that you have equipped is saved upon death. To load your character, use the same name.



### Prestige
- Killing crabs give you 1 token per crab.
- After death you can buy persistent power ups for your character that will increase your base stats by a multiplier (does not boost equipment).

<p align="center"><img src="./docs/screenshots/prestige.png" width="300px"></img></p>

### Leaderboard
- After you die, your character will be on the leaderboard.
- This is a list of local characters and their highest level.

<p align="center"><img src="./docs/screenshots/leaderboard.png" width="300px"></img></p>

## Future Improvements

### Map generation
- I would like to create a map per level and have interlocking rooms.
- This would allow for a more exploration feel to the game.

### Multiple enemy types
- There should be more enemy variety.
- Boss types would be interesting to implement as well.

### Skills
- I would like to add skills into the game for the player.
- They can either be gained via levels or items.

### Item variety
- There should be different items that do different things.
- Item rarity would be interesting to implement as well.
