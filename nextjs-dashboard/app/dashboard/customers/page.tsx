import { lusitana } from '@/app/ui/fonts';

export default function CustomersPage() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Zákazníci
      </h1>
      
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">Seznam zákazníků</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jméno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datum registrace
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Počet objednávek
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Zde by byly vykresleny jednotlivé řádky získané z databáze */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Jan Novák</td>
                <td className="px-6 py-4 whitespace-nowrap">jan@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap">10.5.2023</td>
                <td className="px-6 py-4 whitespace-nowrap">3</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Eva Svobodová</td>
                <td className="px-6 py-4 whitespace-nowrap">eva@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap">15.7.2023</td>
                <td className="px-6 py-4 whitespace-nowrap">7</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">Petr Černý</td>
                <td className="px-6 py-4 whitespace-nowrap">petr@example.com</td>
                <td className="px-6 py-4 whitespace-nowrap">22.8.2023</td>
                <td className="px-6 py-4 whitespace-nowrap">2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
