-- Pokedex Table
BEGIN;

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
    type_name VARCHAR(50) NOT NULL
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
    method_name VARCHAR(100) NOT NULL
);
-- Items Table
CREATE TABLE IF NOT EXISTS ITEMS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    cost INT,
    is_consumable BOOLEAN,
    is_usable_in_battle BOOLEAN,
    is_holdable BOOLEAN
);
-- Poke Ball Table
CREATE TABLE IF NOT EXISTS POKEBALLS (
    item_id INT REFERENCES ITEMS(id) ON DELETE CASCADE,
    catch_rate_multiplier DECIMAL(1,2),
    PRIMARY KEY (item_id)
);
-- Medicine Table
CREATE TABLE IF NOT EXISTS MEDICINE (
    item_id INT REFERENCES ITEMS(id) ON DELETE CASCADE,
    hp_restored INT, -- e.g. super potion restores 50 HP
    status_cure BOOLEAN DEFAULT FALSE, -- if can cure status conditions
    PRIMARY KEY (item_id)
);
-- Stat Boosting Item Table
CREATE TABLE IF NOT EXISTS STAT_BOOSTING_ITEMS (
    item_id INT REFERENCES ITEMS(id) ON DELETE CASCADE,
    stat_name VARCHAR(50),
    multiplier DECIMAL(3,2),
    PRIMARY KEY (item_id)
);
-- PP Recovery Table
CREATE TABLE IF NOT EXISTS PP_RECOVERY_ITEMS (
    item_id INT REFERENCES ITEMS(id) ON DELETE CASCADE,
    pp_restored INT,
    PRIMARY KEY (item_id)
);
-- Status-Cure Items Table
CREATE TABLE IF NOT EXISTS STATUS_CURE_ITEMS (
    item_id INT REFERENCES ITEMS(id) ON DELETE CASCADE,
    ailment_cured VARCHAR(50),
    PRIMARY KEY (item_id)
);
-- Locations Table
CREATE TABLE IF NOT EXISTS LOCATIONS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region VARCHAR(50) NOT NULL
);
-- Location Areas Table
CREATE TABLE IF NOT EXISTS LOCATION_AREAS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location_ID INT REFERENCES LOCATIONS(id) ON DELETE CASCADE
);
-- Location Area Encounters Table
CREATE TABLE IF NOT EXISTS LOCATION_AREA_ENCOUNTERS (
    location_area_id INT REFERENCES LOCATION_AREAS(id) ON DELETE CASCADE,
    pokemon_id INT REFERENCES POKEDEX(id) ON DELETE CASCADE,
    encounter_method VARCHAR(50) NOT NULL,
    min_level INT NOT NULL, -- min level pokemon found at
    max_level INT NOT NULL, -- max level pokemon found at
    chance INT NOT NULL, -- percentage chance of encounter
    PRIMARY KEY (location_area_id, pokemon_id, encounter_method)
);
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
-- create indices for Learnsets and Location Area Encounters tables
-- these will both be quite large as they are many-to-many with a lot of keys
CREATE INDEX idx_learnsets_pokemon_id ON LEARNSETS(pokemon_id);
CREATE INDEX idx_learnsets_move_id ON LEARNSETS(move_id);
CREATE INDEX idx_learnsets_learn_method_id ON LEARNSETS(learn_method_id);

CREATE INDEX idx_location_area_encounters_location_area_id ON LOCATION_AREA_ENCOUNTERS(location_area_id);
CREATE INDEX idx_location_area_encounters_pokemon_id ON LOCATION_AREA_ENCOUNTERS(pokemon_id);
CREATE INDEX idx_location_area_encounters_encounter_method ON LOCATION_AREA_ENCOUNTERS(encounter_method);

COMMIT;