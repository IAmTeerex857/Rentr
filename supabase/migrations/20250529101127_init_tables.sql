DROP TABLE IF EXISTS profiles;
DROP TABLE IF EXISTS profile_settings;

CREATE TABLE IF NOT EXISTS profiles (
	id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
	email TEXT NOT NULL,
	first_name TEXT NOT NULL DEFAULT '',
	last_name TEXT NOT NULL DEFAULT '',
	phone TEXT NOT NULL DEFAULT '',
	user_type TEXT NOT NULL CHECK (user_type IN ('seeker', 'provider')) DEFAULT 'seeker',
	provider_type TEXT NOT NULL DEFAULT '',
	avatar_url TEXT,
	completed_onboarding BOOL NOT NULL DEFAULT FALSE,
	address TEXT NOT NULL DEFAULT '',
	city TEXT NOT NULL DEFAULT '',
	country TEXT NOT NULL DEFAULT '',
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE TABLE IF NOT EXISTS profile_settings (
	id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
	notifications_email BOOL NOT NULL DEFAULT TRUE,
	notifications_sms BOOL NOT NULL DEFAULT FALSE,
	notifications_app BOOL NOT NULL DEFAULT TRUE,
	newsletter BOOL NOT NULL DEFAULT TRUE,
	currency TEXT NOT NULL DEFAULT 'usd',
	language TEXT NOT NULL DEFAULT 'English',
	created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
	updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own settings" ON profile_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON profile_settings;

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view their own settings" ON profile_settings FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own settings" ON profile_settings FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
	INSERT INTO public.profiles (
		id,
		email
	)
	VALUES (
		new.id,
		new.email
	);
	INSERT INTO public.profile_settings (id) VALUES (new.id);
	RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
	AFTER INSERT ON auth.users
	FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
