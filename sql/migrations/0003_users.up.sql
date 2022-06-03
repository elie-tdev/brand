CREATE TABLE users (
  user_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  firebase_uid text UNIQUE NOT NULL,
  name text NOT NULL,
  email text UNIQUE NOT NULL CHECK (char_length(email) > 0),
  avatar text,
  policies_agreed bool NOT NULL DEFAULT false,
  updated_at timestamp(6) NOT NULL DEFAULT now(),
  created_at timestamp(6) NOT NULL DEFAULT now(),
  archived_at timestamp(6),
  deleted_at timestamp(6)
);

-- Add grants to roles
GRANT SELECT, INSERT, UPDATE ON users TO onebrand_read_write_role;
GRANT SELECT ON users TO onebrand_read_only_role;

-- Add triggers
CREATE TRIGGER set_updated_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_timestamp();