CREATE TABLE IF NOT EXISTS profiles (
	id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
	first_name TEXT NOT NULL,
	last_name TEXT NOT NULL,
	email TEXT NOT NULL,
	phone TEXT NOT NULL,
	user_type TEXT NOT NULL CHECK (user_type IN ('seeker', 'provider')) DEFAULT 'seeker',
	provider_type TEXT NOT NULL DEFAULT '',
	avatar_url TEXT,
	completed_onboarding BOOL DEFAULT FALSE,
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
		email,
		first_name,
		last_name
	)
	VALUES (
		new.id,
		new.email,
		COALESCE(new.raw_user_meta_data->>'firstName', ''),
		COALESCE(new.raw_user_meta_data->>'lastName', '')
	);
	INSERT INTO public.profile_settings (id) VALUES (new.id);
	RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
	AFTER INSERT ON auth.users
	FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
