import Link from 'next/link';
import { HomeIcon, DocumentDuplicateIcon, UserGroupIcon, CogIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import AcmeLogo from '@/app/ui/acme-logo';

const links = [
  { name: 'Domů', href: '/dashboard', icon: HomeIcon },
  { name: 'Objednávky', href: '/dashboard/orders', icon: DocumentDuplicateIcon },
  { name: 'Zákazníci', href: '/dashboard/customers', icon: UserGroupIcon },
  { name: 'Nastavení', href: '/dashboard/settings', icon: CogIcon },
];

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-500 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        {links.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className="flex h-12 grow items-center justify-center rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            >
              <LinkIcon className="w-6" />
              <span className="hidden md:block md:ml-2">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
