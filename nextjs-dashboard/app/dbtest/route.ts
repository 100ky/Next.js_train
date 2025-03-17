import postgres from 'postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Připojení k databázi
    const connectionUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!connectionUrl) {
      return NextResponse.json({ error: 'Chybí URL databáze' }, { status: 500 });
    }
    
    console.log('Pokus o připojení k databázi...');
    const sql = postgres(connectionUrl, {
      ssl: { rejectUnauthorized: true },
      connect_timeout: 15,
    });
    
    // Základní test připojení
    const result = await sql`SELECT current_database(), current_user, version()`;
    
    // Získání seznamu tabulek
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    
    // Pokud nejsou žádné tabulky, vytvoříme testovací tabulku
    if (tables.length === 0) {
      await sql`CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name TEXT)`;
      await sql`INSERT INTO test_table (name) VALUES ('Test záznam')`;
      console.log('Vytvořena testovací tabulka');
    }
    
    // Vrátíme úspěšnou odpověď
    return NextResponse.json({
      success: true,
      dbInfo: result[0],
      tables: tables.map(t => t.table_name),
      testConnection: "OK"
    });
  } catch (error) {
    console.error('Test selhal:', error);
    return NextResponse.json({
      error: 'Chyba připojení k databázi',
      detail: error instanceof Error ? error.message : 'Neznámá chyba'
    }, { status: 500 });
  }
}
