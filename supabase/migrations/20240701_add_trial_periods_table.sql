-- Create trial_periods table to track freemium trial periods
CREATE TABLE IF NOT EXISTS trial_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_trial_periods_user_id ON trial_periods(user_id);

-- Add index for faster lookups by status
CREATE INDEX IF NOT EXISTS idx_trial_periods_status ON trial_periods(status);

-- Enable realtime for this table
alter publication supabase_realtime add table trial_periods;
