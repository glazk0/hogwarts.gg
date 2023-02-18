'use client';

import type { Translations } from '#/lib/i18n/types';
import type { NavItem } from '#/lib/nav-items';
import { navItems } from '#/lib/nav-items';
import { cn } from '#/lib/utils';
import Icon from '#/public/assets/icon.png';
import { IconMenu2, IconX } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useSelectedLayoutSegment } from 'next/navigation';
import { useState } from 'react';
import AppLink from './AppLink';

const GlobalUser = dynamic(() => import('./GlobalUser'), {
  ssr: false,
});

export default function GlobalNav({
  translations,
}: {
  translations: Translations;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);
  return (
    <div className="fixed z-auto top-0 flex w-full border-b border-gray-800 bg-black">
      <LogoNavItem onClick={close} />
      <button
        type="button"
        className="group absolute right-0 top-0 flex h-14 items-center gap-x-2 px-4 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium text-gray-100 group-hover:text-gray-400">
          {translations.menu}
        </div>
        {isOpen ? (
          <IconX className="block w-6 text-gray-400" />
        ) : (
          <IconMenu2 className="block w-6 text-gray-400" />
        )}
      </button>

      <div
        className={cn(
          'text-center px-4 grow md:flex md:items-center md:justify-between py-4 md:py-0 space-y-3 md:space-y-0 md:h-14',
          {
            'fixed md:static inset-x-0 bottom-0 top-14 mt-px bg-black': isOpen,
            hidden: !isOpen,
          },
        )}
      >
        <div className="md:order-last flex gap-2">
          <GlobalUser onClick={close} translations={translations} />
        </div>
        <nav className="flex flex-col space-y-1 md:space-y-0 md:px-0 md:py-0 md:flex-row md:h-14 md:items-center">
          {navItems.map((navItem) => (
            <GlobalNavItem
              key={navItem.name}
              item={navItem}
              onClick={close}
              translations={translations}
            />
          ))}
        </nav>
      </div>
    </div>
  );
}

function LogoNavItem({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex h-14 items-center py-4 px-4">
      <AppLink
        href="/"
        className="flex w-full items-center gap-x-2"
        onClick={onClick}
      >
        <Image src={Icon} alt="Hogwarts.gg" height={48} />
        <p className="font-serif tracking-wide pt-1 text-brand">Hogwart$.gg</p>
      </AppLink>
    </div>
  );
}

function GlobalNavItem({
  item,
  onClick,
  translations,
}: {
  item: NavItem;
  onClick: () => void;
  translations: Translations;
}) {
  const segment = useSelectedLayoutSegment();
  const isActive = item.slug === segment;

  return (
    <AppLink
      onClick={onClick}
      href={`/${item.slug}`}
      className={cn(
        'block rounded-md px-3 py-2 text-sm font-medium hover:text-gray-300',
        {
          'text-gray-400 hover:bg-gray-800': !isActive,
          'text-white': isActive,
        },
      )}
    >
      {translations[item.name.toLowerCase()]}
    </AppLink>
  );
}
