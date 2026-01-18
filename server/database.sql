-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    reputation_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UseCase 1: UNFINISHED (Thoughts)
CREATE TABLE thoughts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'incomplete',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE continuations (
    id SERIAL PRIMARY KEY,
    thought_id INT REFERENCES thoughts(id),
    user_id INT REFERENCES users(id),
    content TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('extend', 'question', 'contrast')),
    is_chosen_best BOOLEAN DEFAULT FALSE
);

-- UseCase 2: ECHOSWAP (Live Sessions)
CREATE TABLE swap_sessions (
    id SERIAL PRIMARY KEY,
    user_a_id INT REFERENCES users(id),
    user_b_id INT REFERENCES users(id),
    topic TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    transcript JSONB, -- Storing the chat history
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UseCase 3: MIDDLE GROUND (Conflict Rooms)
CREATE TABLE conflict_rooms (
    id SERIAL PRIMARY KEY,
    user_a_id INT REFERENCES users(id),
    user_b_id INT REFERENCES users(id),
    initial_topic TEXT NOT NULL,
    agreement_score INT DEFAULT 0, -- 0 to 100
    current_distance INT DEFAULT 100,
    status VARCHAR(20) DEFAULT 'negotiating'
);

ALTER TABLE thoughts ADD COLUMN mood VARCHAR(50) DEFAULT 'Neutral';