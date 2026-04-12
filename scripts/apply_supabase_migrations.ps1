# Apply Supabase SQL migration using supabase CLI
# Requirements: supabase CLI installed and you've run `supabase login`.

$migrationFile = "supabase/migrations/001_init.sql"
if (-Not (Test-Path $migrationFile)) {
  Write-Error "Migration file not found: $migrationFile"
  exit 1
}

# Option A: apply using supabase sql (runs the SQL directly against the remote DB)
Write-Output "Applying migration via supabase sql ..."
supabase sql --file $migrationFile

# Option B: push migrations (if you're using supabase migrations directory + cli workflow)
# supabase migration new "init" --sql-file $migrationFile
# supabase db push

Write-Output "Done. Check Supabase dashboard or logs for any errors."