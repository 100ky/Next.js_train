import { Card } from '@/app/ui/dashboard/cards';
import { lusitana } from '@/app/ui/fonts';

export default function Dashboard() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Celkové příjmy"
          value="120,500 Kč"
          type="income"
        />
        <Card
          title="Nevyřízené objednávky"
          value="25"
          type="orders"
        />
        <Card
          title="Noví zákazníci"
          value="12"
          type="customers"
        />
        <Card
          title="Zůstatek"
          value="70,345 Kč"
          type="balance"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <div className="md:col-span-4 lg:col-span-5">
          <h2 className={`${lusitana.className} mb-4 text-xl`}>Přehled</h2>
          <div className="rounded-xl bg-gray-50 p-4">
            {/* Graf by přišel sem */}
            <div className="h-80 w-full rounded-lg bg-white p-4">
              Graf s daty (příklad)
            </div>
          </div>
        </div>
        <div className="md:col-span-4 lg:col-span-3">
          <h2 className={`${lusitana.className} mb-4 text-xl`}>Poslední aktivity</h2>
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="h-80 w-full rounded-lg bg-white p-4">
              <ul className="space-y-4">
                <li className="flex items-center justify-between border-b pb-2">
                  <div>Objednávka #1234</div>
                  <div className="text-sm text-gray-500">10 minut</div>
                </li>
                <li className="flex items-center justify-between border-b pb-2">
                  <div>Nová registrace</div>
                  <div className="text-sm text-gray-500">30 minut</div>
                </li>
                <li className="flex items-center justify-between border-b pb-2">
                  <div>Objednávka #1233</div>
                  <div className="text-sm text-gray-500">45 minut</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}