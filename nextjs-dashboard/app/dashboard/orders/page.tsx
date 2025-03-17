import { lusitana } from '@/app/ui/fonts';

export default function OrdersPage() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Objednávky
      </h1>
      
      <div className="rounded-xl bg-white p-6 shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Seznam objednávek</h2>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Nová objednávka
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Číslo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zákazník
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Datum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hodnota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stav
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Zde by byly vykresleny jednotlivé řádky získané z databáze */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">#1234</td>
                <td className="px-6 py-4 whitespace-nowrap">Jan Novák</td>
                <td className="px-6 py-4 whitespace-nowrap">12.11.2023</td>
                <td className="px-6 py-4 whitespace-nowrap">3 500 Kč</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Dokončeno
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">#1233</td>
                <td className="px-6 py-4 whitespace-nowrap">Eva Svobodová</td>
                <td className="px-6 py-4 whitespace-nowrap">10.11.2023</td>
                <td className="px-6 py-4 whitespace-nowrap">1 200 Kč</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    K odeslání
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">#1232</td>
                <td className="px-6 py-4 whitespace-nowrap">Petr Černý</td>
                <td className="px-6 py-4 whitespace-nowrap">9.11.2023</td>
                <td className="px-6 py-4 whitespace-nowrap">4 700 Kč</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Odesláno
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
