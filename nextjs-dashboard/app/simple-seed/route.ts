import postgres from 'postgres';
import { NextResponse } from 'next/server';
import { customers, invoices, revenue, users } from '@/app/lib/placeholder-data';

// Funkce pro kontrolu hodnot
function validateObject(obj: any, name: string) {
  const undefinedKeys = Object.entries(obj)
    .filter(([_, value]) => value === undefined)
    .map(([key]) => key);
  
  if (undefinedKeys.length > 0) {
    console.warn(`Varování: Objekt ${name} obsahuje undefined hodnoty pro klíče: ${undefinedKeys.join(', ')}`);
    return false;
  }
  return true;
}

export async function GET() {
  try {
    const connectionUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    if (!connectionUrl) {
      return NextResponse.json({ error: 'Chybí URL databáze' }, { status: 500 });
    }

    console.log('Inicializuji databázi...');
    const sql = postgres(connectionUrl, {
      ssl: { rejectUnauthorized: true },
      connect_timeout: 15,
    });

    // Vytvoření tabulek
    console.log('Vytvářím tabulky...');
    
    // Vytvoření users tabulky (bez bcrypt hashování hesel)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `;

    // Vytvoření customers tabulky
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL,
        image_url TEXT NOT NULL
      )
    `;

    // Vytvoření invoices tabulky
    await sql`
      CREATE TABLE IF NOT EXISTS invoices (
        id UUID PRIMARY KEY,
        customer_id UUID NOT NULL,
        amount INT NOT NULL,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL
      )
    `;

    // Vytvoření revenue tabulky
    await sql`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      )
    `;

    // Kontrola, zda už existují data
    const userCount = await sql`SELECT COUNT(*) FROM users`;
    const hasData = parseInt(userCount[0].count) > 0;

    if (!hasData) {
      // Vložení dat do tabulek
      console.log('Vkládám testovací data...');
      
      // Vkládání user dat (s obyčejnými hesly místo hashování)
      let usersInserted = 0;
      for (const user of users) {
        if (!validateObject(user, `user ${user.name}`)) continue;
        
        try {
          await sql`
            INSERT INTO users (id, name, email, password)
            VALUES (${user.id}, ${user.name}, ${user.email}, ${user.password || 'password123'})
            ON CONFLICT (id) DO NOTHING
          `;
          usersInserted++;
        } catch (error) {
          console.error(`Chyba při vkládání uživatele ${user.name}:`, error);
        }
      }

      // Vkládání customer dat
      let customersInserted = 0;
      for (const customer of customers) {
        if (!validateObject(customer, `customer ${customer.name}`)) continue;
        
        try {
          await sql`
            INSERT INTO customers (id, name, email, image_url)
            VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.image_url || '/placeholder.png'})
            ON CONFLICT (id) DO NOTHING
          `;
          customersInserted++;
        } catch (error) {
          console.error(`Chyba při vkládání zákazníka ${customer.name}:`, error);
        }
      }

      // Vkládání invoice dat
      let invoicesInserted = 0;
      for (const invoice of invoices) {
        if (!validateObject(invoice, `invoice ${invoice.id}`)) continue;
        
        try {
          await sql`
            INSERT INTO invoices (id, customer_id, amount, status, date)
            VALUES (${invoice.id}, ${invoice.customer_id}, ${invoice.amount}, ${invoice.status}, ${invoice.date})
            ON CONFLICT (id) DO NOTHING
          `;
          invoicesInserted++;
        } catch (error) {
          console.error(`Chyba při vkládání faktury ${invoice.id}:`, error);
        }
      }

      // Vkládání revenue dat
      let revenueInserted = 0;
      for (const rev of revenue) {
        if (!validateObject(rev, `revenue ${rev.month}`)) continue;
        
        try {
          await sql`
            INSERT INTO revenue (month, revenue)
            VALUES (${rev.month}, ${rev.revenue})
            ON CONFLICT (month) DO NOTHING
          `;
          revenueInserted++;
        } catch (error) {
          console.error(`Chyba při vkládání příjmu ${rev.month}:`, error);
        }
      }

      console.log(`Vloženo ${usersInserted} uživatelů, ${customersInserted} zákazníků, ${invoicesInserted} faktur, ${revenueInserted} příjmů`);
    }

    // Kontrola vložených dat
    const customersCount = await sql`SELECT COUNT(*) FROM customers`;
    const invoicesCount = await sql`SELECT COUNT(*) FROM invoices`;
    const revenueCount = await sql`SELECT COUNT(*) FROM revenue`;

    // Přidáme speciální záznam pro náš test s částkou 666, pokud neexistuje
    const test666Count = await sql`
      SELECT COUNT(*) FROM invoices WHERE amount = 666
    `;

    if (parseInt(test666Count[0].count) === 0) {
      // Přidáme alespoň jeden záznam s částkou 666 pro test
      const firstCustomer = await sql`SELECT id FROM customers LIMIT 1`;
      if (firstCustomer.length > 0) {
        try {
          await sql`
            INSERT INTO invoices (id, customer_id, amount, status, date)
            VALUES (gen_random_uuid(), ${firstCustomer[0].id}, 666, 'pending', CURRENT_DATE)
          `;
          console.log('Přidána testovací faktura s částkou 666');
        } catch (error) {
          console.error('Chyba při přidávání testovací faktury:', error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Databáze byla úspěšně inicializována',
      counts: {
        users: parseInt(userCount[0].count),
        customers: parseInt(customersCount[0].count),
        invoices: parseInt(invoicesCount[0].count),
        revenue: parseInt(revenueCount[0].count),
        testInvoice666: parseInt(test666Count[0].count)
      }
    });

  } catch (error) {
    console.error('Chyba při inicializaci databáze:', error);
    return NextResponse.json({
      error: 'Chyba při inicializaci databáze',
      detail: error instanceof Error ? error.message : 'Neznámá chyba',
      reseni: 'Zkontrolujte placeholder-data.ts a zajistěte, že žádné hodnoty nejsou undefined'
    }, { status: 500 });
  }
}
