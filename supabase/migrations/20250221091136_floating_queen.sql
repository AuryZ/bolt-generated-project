/*
  # Add numeric ID and random selection function

  1. Changes
    - Add numeric ID column to steam_metadata table
    - Create index on numeric ID column
    - Add function for random game selection
    
  2. Notes
    - The numeric ID will be used for efficient random selection
    - Index improves performance of ORDER BY queries
    - Random selection function uses window functions for better performance
*/

-- Add numeric ID if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'steam_metadata' AND column_name = 'numeric_id'
  ) THEN
    ALTER TABLE steam_metadata ADD COLUMN numeric_id BIGINT GENERATED ALWAYS AS IDENTITY;
  END IF;
END $$;

-- Create index if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'steam_metadata' AND indexname = 'steam_metadata_numeric_id_idx'
  ) THEN
    CREATE INDEX steam_metadata_numeric_id_idx ON steam_metadata(numeric_id);
  END IF;
END $$;

-- Create or replace function for random game selection
CREATE OR REPLACE FUNCTION get_random_games(num_games INTEGER)
RETURNS SETOF steam_metadata AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (random()) *
  FROM steam_metadata
  WHERE screenshots IS NOT NULL
  ORDER BY random()
  LIMIT num_games;
END;
$$ LANGUAGE plpgsql;
