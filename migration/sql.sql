CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT chk_role CHECK (role IN ('user', 'admin')),
  CONSTRAINT uq_email UNIQUE (email)
);


CREATE TABLE IF NOT EXISTS tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(512) NOT NULL,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  expires DATETIME NOT NULL,
  blacklisted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);