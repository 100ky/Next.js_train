import postgres from 'postgres';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Funkce pro inicializaci připojení k databázi
function getDbConnection() {
  const connectionUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  
  if (!connectionUrl) {
    throw new Error('Databázové připojení není nakonfigurováno');
  }
  
  return postgres(connectionUrl, {
    ssl: { rejectUnauthorized: true },
    connect_timeout: 15,
  });
}

// Funkce pro získání komentářů
async function getComments() {
  const sql = getDbConnection();
  try {
    // Nejprve zkontrolujeme, zda tabulka existuje
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'comments'
      );
    `;
    
    // Pokud tabulka neexistuje, vytvoříme ji
    if (!tableExists[0].exists) {
      await sql`CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        comment TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )`;
      console.log('Tabulka comments byla vytvořena');
      return [];
    }
    
    // Načteme komentáře
    const comments = await sql`SELECT * FROM comments ORDER BY created_at DESC`;
    return comments;
  } catch (error) {
    console.error('Chyba při načítání komentářů:', error);
    return [];
  }
}

// Server Action pro vytvoření komentáře
async function create(formData: FormData) {
  'use server';
  
  // Získáme komentář z formuláře
  const comment = formData.get('comment');
  
  // Jednoduchá validace
  if (!comment || typeof comment !== 'string' || comment.length < 1) {
    throw new Error('Komentář je povinný');
  }
  
  try {
    // Připojení k databázi
    const sql = getDbConnection();
    
    // Vložíme komentář do databáze
    await sql`INSERT INTO comments (comment) VALUES (${comment})`;
    
    // Obnovíme data na stránce
    revalidatePath('/comments');
    
    // Přesměrujeme zpět na stránku s komentáři
    redirect('/comments');
  } catch (error) {
    console.error('Chyba při ukládání komentáře:', error);
    throw new Error('Nepodařilo se uložit komentář');
  }
}

export default async function CommentsPage() {
  // Získáme existující komentáře
  const comments = await getComments();
  
  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <Link href="/" className="self-start mb-4 text-blue-500 hover:text-blue-700">
        &larr; Zpět na hlavní stránku
      </Link>
      
      <h1 className={`${lusitana.className} mb-8 text-2xl md:text-3xl`}>
        Komentáře
      </h1>
      
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mb-8">
        <form action={create} className="space-y-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
              Nový komentář
            </label>
            <textarea
              id="comment"
              name="comment"
              placeholder="Napište komentář..."
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Přidat komentář
          </button>
        </form>
      </div>
      
      <div className="w-full max-w-md mx-auto">
        <h2 className={`${lusitana.className} mb-4 text-xl`}>
          Existující komentáře
        </h2>
        
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Zatím nejsou žádné komentáře.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((comment: any) => (
              <li key={comment.id} className="bg-gray-50 p-4 rounded-lg shadow">
                <p className="text-gray-800">{comment.comment}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
