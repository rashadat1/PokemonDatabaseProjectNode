-- Pokedex Table
CREATE TABLE IF NOT EXISTS POKEDEX (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(150) NOT NULL,
    stat_total INT NOT NULL,
    hp INT NOT NULL,
    atk INT NOT NULL,
    def INT NOT NULL,
    spatk INT NOT NULL,
    spdef INT NOT NULL,
    spd INT NOT NULL,
    catch_rate INT,
    base_exp INT,
    base_happiness INT,
    entry TEXT,
    height DECIMAL,
    weight DECIMAL
);
-- Abiities Table
CREATE TABLE IF NOT EXISTS ABILITIES (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);
-- Moves Table
CREATE TABLE IF NOT EXISTS MOVES (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    power INT,
    accuracy INT,
    pp INT,
    damage_class VARCHAR(20),
    priority INT DEFAULT 0,
    healing INT DEFAULT 0, -- healing done by healing move 
    crit_rate INT DEFAULT 0,
    drain INT DEFAULT 0, -- healing or recoil damage to user
    flinch_chance INT DEFAULT 0,
    max_hits INT, -- max num hits for multi hit move
    min_hits INT, -- min num hits for multi hit move
    max_turns INT, -- max num turns of multi turn effect
    min_turns INT, -- min num turns of multi turn effect
    target VARCHAR(50) -- user, selected target, all enemies, all other pokemon
);
-- Ailment Table
CREATE TABLE IF NOT EXISTS AILMENTS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    damage INT,
    stat_effected VARCHAR(50),
    stat_change INT
);
-- Move Stat Change Table
CREATE TABLE IF NOT EXISTS MOVE_STAT_CHANGE (
    move_id  INT REFERENCES MOVES(id) ON DELETE CASCADE, -- foreign key to moves table
    stat_name VARCHAR(50),
    change INT,
    chance INT,
    PRIMARY KEY (move_id, stat_name) -- composite primary key
);
-- Move Ailments Table
CREATE TABLE IF NOT EXISTS MOVE_AILMENTS (
    move_id INT REFERENCES MOVES(id) ON DELETE CASCADE,
    ailment_id INT REFERENCES AILMENTS(id) ON DELETE CASCADE, -- foreign key to ailments table
    ailment_chance INT,
    PRIMARY KEY (move_id, ailment_id) -- composite primary key
);
-- EV Yield Table
CREATE TABLE IF NOT EXISTS EV_YIELD (
    pokemon_id INT REFERENCES POKEDEX(id) ON DELETE CASCADE,
    stat_name VARCHAR(50),
    ev_yield INT,
    PRIMARY KEY (pokemon_id, stat_name)
);
-- Types Table
CREATE TABLE IF NOT EXISTS TYPES (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
);
-- Type Interactions Table
CREATE TABLE IF NOT EXISTS TYPE_INTERACTIONS (
    attacker_type_id INT REFERENCES TYPES(id) ON DELETE CASCADE,
    defender_type_id INT REFERENCES TYPES(id) ON DELETE CASCADE,
    multiplier DECIMAL DEFAULT 1.0,
    PRIMARY KEY (attacker_type_id, defender_type_id)
);
-- Pokemon Type Table
CREATE TABLE IF NOT EXISTS POKEMON_TYPES (
    pokemon_id INT REFERENCES POKEDEX(id) ON DELETE CASCADE,
    type_id INT REFERENCES TYPES(id) ON DELETE CASCADE,
    PRIMARY KEY (pokemon_id, type_id)
);
-- Move Type Table
CREATE TABLE IF NOT EXISTS MOVE_TYPES (
    move_id INT REFERENCES MOVES(id) ON DELETE CASCADE,
    type_id INT REFERENCES TYPES(id) ON DELETE CASCADE,
    PRIMARY KEY (move_id)
);
-- Pokemon Abilities Table
CREATE TABLE IF NOT EXISTS POKEMON_ABILITIES (
    pokemon_id INT REFERENCES POKEDEX(id) ON DELETE CASCADE,
    ability_id INT REFERENCES ABILITIES(id) ON DELETE CASCADE,
    is_hidden BOOLEAN,
    PRIMARY KEY (pokemon_id, ability_id)
);
-- Pokemon Move Learn Methods Table
CREATE TABLE IF NOT EXISTS LEARN_METHODS (
    id SERIAL PRIMARY KEY,
    method_name VARCHAR(100) NOT NULL,
);
-- Items Table
CREATE TABLE IF NOT EXISTS ITEMS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cost INT,
    fling_power INT,
    healing
    ailment_heal
    is_consumable BOOLEAN,
    is_usable_in_battle BOOLEAN,
    is_holdable BOOLEAN


)
-- Locations Table


-- Learnsets Table
CREATE TABLE IF NOT EXISTS LEARNSETS (
    pokemon_id INT REFERENCES POKEDEX(id) ON DELETE CASCADE,
    move_id INT REFERENCES MOVES(id) ON DELETE CASCADE,
    learn_method_id INT REFERENCES LEARN_METHODS(id),
    level_learned INT,
    PRIMARY KEY (pokemon_id, move_id, learn_method_id)
);
-- Evolutions Table
CREATE TABLE IF NOT EXISTS EVOLUTIONS (
    pokemon_id_from INT REFERENCES POKEDEX(id) ON DELETE CASCADE,
    pokemon_id_to INT REFERENCES POKEDEX(id) ON DELETE CASCADE,
    trigger VARCHAR(100) NOT NULL,
    min_level INT,
    held_item_id INT REFERENCES ITEMS(id),
    use_item_id INT REFERENCES ITEMS(id),
    location_id INT REFERENCES LOCATIONS(id),
    min_happiness INT,
    min_beauty INT,
    min_affection INT,
    known_move VARCHAR(100),
    known_move_type VARCHAR(100),
    time_of_day VARCHAR(50),
    gender VARCHAR(100),
    needs_overworld_rain BOOLEAN,
    trade_species INT REFERENCES POKEDEX(id),
    turn_upside_down BOOLEAN,
    PRIMARY KEY (pokemon_id_from, pokemon_id_to)
);