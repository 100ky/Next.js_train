import postgres from 'postgres';
import { NextResponse } from 'next/server';

// Zjednodušený kód pro připojení k databázi
let sql: postgres.Sql<any> | null;

try {
  // Jednodušší způsob nastavení připojení
  const connectionUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (connectionUrl) {
    console.log('Připojuji se k databázi...');
    
    sql = postgres(connectionUrl, {
      ssl: true,  // Zjednodušené nastavení SSL
      connect_timeout: 20,
    });
  } else {
    console.error('Chybí URL databáze v proměnných prostředí');
  }
} catch (error) {
  console.error('Chyba inicializace:', error);
}

// Funkce pro vyhledání faktur
async function findInvoices(amount = null) {
  if (!sql) {
    throw new Error('Databázové připojení není k dispozici');
  }
  
  try {
    // Nejprve zkontrolujeme existenci tabulek
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('Dostupné tabulky:', tables.map(t => t.table_name));
    
    // Máme tabulky invoices a customers?
    const hasInvoices = tables.some(t => t.table_name === 'invoices');
    const hasCustomers = tables.some(t => t.table_name === 'customers');
    
    if (!hasInvoices || !hasCustomers) {
      return {
        error: true,
        message: 'Chybějící tabulky v databázi',
        tip: 'Nejprve navštivte /simple-seed endpoint pro vytvoření tabulek',
        dostupneTabulky: tables.map(t => t.table_name)
      };
    }
    
    // Získáme všechny faktury, nebo filtrujeme podle částky
    let result;
    if (amount) {
      // Hledáme konkrétní částku
      result = await sql`
        SELECT i.id, i.amount, i.status, c.name as customer_name, c.email as customer_email
        FROM invoices i
        JOIN customers c ON i.customer_id = c.id
        WHERE i.amount = ${amount}
      `;
    } else {
      // Vrátíme všechny faktury
      result = await sql`
        SELECT i.id, i.amount, i.status, c.name as customer_name, c.email as customer_email
        FROM invoices i
        JOIN customers c ON i.customer_id = c.id
        LIMIT 10
      `;
    }
    
    if (result.length === 0 && amount) {
      // Pokud nebyla nalezena žádná faktura se zadanou částkou, zkusíme najít podobné částky
      const similarInvoices = await sql`
        SELECT DISTINCT amount FROM invoices
        ORDER BY ABS(amount - ${amount})
        LIMIT 5
      `;
      
      return {
        found: false,
        message: `Žádná faktura s částkou ${amount} nebyla nalezena`,
        podobneCastky: similarInvoices.map(i => i.amount),
        tip: "Pro zobrazení všech faktur navštivte /query?all=true"
      };
    }
    
    return { found: true, faktury: result };
  } catch (error) {
    console.error('Chyba při hledání faktur:', error);
    throw new Error(`Chyba při vyhledávání: ${error instanceof Error ? error.message : 'Neznámá chyba'}`);
  }
}

export async function GET(request: Request) {
  try {
    // Získáme parametry z URL
    const { searchParams } = new URL(request.url);
    const amount = searchParams.get('amount') ? parseInt(searchParams.get('amount')!, 10) : null;
    const showAll = searchParams.get('all') === 'true';
    
    if (!sql) {
      return NextResponse.json({ 
        error: 'Databázové připojení není k dispozici',
        tip: 'Zkontrolujte .env.local soubor a proměnné prostředí'
      }, { status: 500 });
    }
    
    // Vyhledáme faktury podle částky nebo všechny
    const invoiceResult = await findInvoices(showAll ? null : amount || 666);
    
    if (invoiceResult.error) {
      return NextResponse.json({
        error: invoiceResult.message,
        tip: invoiceResult.tip,
        dostupneTabulky: invoiceResult.dostupneTabulky,
        seedUrl: 'https://symmetrical-space-capybara-69rp9p5qjwvrh5qvj-3000.app.github.dev/simple-seed'
      }, { status: 404 });
    }
    
    return NextResponse.json(invoiceResult);
  } catch (error) {
    console.error('Chyba při zpracování požadavku:', error);
    return NextResponse.json({ 
      error: 'Nepodařilo se zpracovat požadavek', 
      detail: error instanceof Error ? error.message : 'Neznámá chyba' 
    }, { status: 500 });
  }
}
