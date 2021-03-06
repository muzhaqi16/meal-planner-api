DROP TYPE IF EXISTS meal_times;

CREATE TYPE meal_times AS ENUM (
    'breakfast',
    'lunch',
    'dinner'
);
CREATE TABLE IF NOT EXISTS meals (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES users(id),
    name TEXT NOT NULL,
    time meal_times NOT NULL,
    date date NOT NULL,
    details TEXT,
    calories INTEGER DEFAULT 0
);
