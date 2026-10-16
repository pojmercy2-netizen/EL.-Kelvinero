import pg from 'pg'

async function check() {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Ebimene0812%3F%3F@localhost:5432/tzorah_emporium'
  })
  const { rows } = await pool.query('SELECT id, name, email, hashed_password, is_admin FROM users')
  console.log("Users and hashes:")
  console.log(rows)
  await pool.end()
}

check().catch(console.error)
