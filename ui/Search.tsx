import useDidUpdate from '#/lib/hooks/use-did-update';
import useLanguage from '#/lib/hooks/use-language';
import { useNodes } from '#/lib/hooks/use-nodes';
import { usePosts } from '#/lib/hooks/use-posts';
import { labels } from '#/lib/i18n/settings';
import type { Translations } from '#/lib/i18n/types';
import type { Node } from '#/lib/nodes';
import type { Post } from '#/lib/posts';
import { IconArticle, IconSearch } from '@tabler/icons-react';
import { format } from 'date-fns';
import Image from 'next/image';
import { memo, useCallback, useState } from 'react';
import AppLink from './AppLink';
import Button from './Button';
import Dialog from './Dialog';
import Divider from './Divider';

export default function Search({
  translations,
}: {
  translations: Translations;
}) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const close = useCallback(() => setOpen(false), []);

  useDidUpdate(() => {
    const timeoutId = setTimeout(() => setSearch(value), 100);
    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button className="mx-2">
          <IconSearch size={20} /> {translations.quickSearch}
        </Button>
      }
      tooltip={translations.quickSearchTooltip}
      className="w-full max-w-2xl rounded overflow-hidden flex flex-col"
    >
      <label className="flex gap-2 p-2">
        <IconSearch className="stroke-gray-500" />{' '}
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="flex-1 outline-0 bg-transparent"
          autoFocus
          placeholder={translations.quickSearchTooltip}
        />
      </label>
      <Divider />
      <SearchResults search={search} onClick={close} />
    </Dialog>
  );
}

const SearchResults = memo(function SearchResults({
  search,
  onClick,
}: {
  search: string;
  onClick: () => void;
}) {
  const language = useLanguage();
  const { data: posts = [] } = usePosts({ language, published: true });
  const { data: nodes = [] } = useNodes({ language });
  const regExp = search ? new RegExp(search, 'i') : null;

  const filteredPosts = posts.filter((post, index) => {
    if (regExp) {
      if (
        !post.title!.match(regExp) &&
        !post.short!.match(regExp) &&
        !post.body!.match(regExp)
      ) {
        return false;
      }
    } else if (index > 3) {
      return false;
    }
    return true;
  });

  const filteredNodes = nodes.filter((node, index) => {
    if (regExp) {
      if (
        (!node.title || !node.title.match(regExp)) &&
        !node.nodeType.title.match(regExp)
      ) {
        return false;
      }
    } else if (index > 5) {
      return false;
    }
    return true;
  });
  return (
    <ul className="overflow-auto flex-1 ">
      {filteredPosts.map((post) => (
        <li key={post.id} onClick={onClick}>
          <PostResult post={post} />
        </li>
      ))}
      {filteredNodes.map((node) => {
        return (
          <li key={node.id} onClick={onClick}>
            <NodeResult node={node} />
          </li>
        );
      })}
      {filteredNodes.length === 0 && filteredPosts.length === 0 && (
        <li className="p-2">No results</li>
      )}
    </ul>
  );
});

function PostResult({ post }: { post: Post }) {
  return (
    <AppLink
      className="p-2 flex gap-4 items-center hover:bg-gray-600"
      href={`/blog/${post.slug}`}
    >
      <IconArticle width={50} height={50} className="shrink-0" />
      <div>
        <p className="font-semibold">{post.title}</p>
        <div className="flex gap-2 text-gray-400 text-sm">
          <p>{labels[post.language]}</p>|
          <p>
            <span className="font-semibold">{post.user.username}</span> {' - '}
            {post.published_at && (
              <time dateTime={post.published_at}>
                {format(new Date(post.published_at), 'MMMM dd, yyyy')}
              </time>
            )}
          </p>
        </div>
        <p
          dangerouslySetInnerHTML={{ __html: post.short! }}
          className="text-sm"
        />
      </div>
    </AppLink>
  );
}

function NodeResult({ node }: { node: Node }) {
  return (
    <AppLink
      className="p-2 flex gap-4 items-center hover:bg-gray-600"
      href={`/map/${node.world}`}
    >
      <Image
        src={node.nodeType.icon}
        alt=""
        width={50}
        height={50}
        className="object-contain shrink-0"
      />
      <div>
        <p className="font-semibold">{node.title || node.nodeType.title}</p>
        <p className="text-brand-400 text-sm">{node.nodeType.title}</p>
        <p className="capitalize text-gray-200 text-sm">
          {node.world}
          {node.level && ` Level ${node.level}`}
        </p>
      </div>
    </AppLink>
  );
}
