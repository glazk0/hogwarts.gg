import type { Comment as CommentType } from '#/lib/comments';
import { useMe } from '#/lib/hooks/use-me';
import type { Translations } from '#/lib/i18n/types';
import type { Node } from '#/lib/nodes';
import type { Post } from '#/lib/posts';
import supabase from '#/lib/supabase-browser';
import { IconTrash } from '@tabler/icons';
import { format, formatDistance } from 'date-fns';
import { useSWRConfig } from 'swr';
import AppLink from './AppLink';
import Avatar from './Avatar';
import PostHTML from './PostHTML';

export default function Comment({
  comment,
  translations,
  ...props
}: (
  | {
      post: Post;
    }
  | {
      node: Node;
    }
) & {
  comment: CommentType;
  translations: Translations;
}) {
  const { data: me, isLoading } = useMe();
  const { mutate } = useSWRConfig();

  async function onDelete() {
    const ok = confirm(translations.commentDeleteConfirmation);
    if (!ok) {
      return;
    }

    await supabase.from('comments').delete().eq('id', comment.id);

    if ('post' in props) {
      mutate(`comments/posts/${props.post.group_id || props.post.id}`);
    } else {
      // Not implemented
    }
  }

  // TODO: onEdit

  return (
    <article className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0">
          <Avatar name={comment.user.username} size={42} />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex item-center justify-between">
            <AppLink
              href={`/users/${comment.user_id}`}
              rel="author"
              className="text-sm font-medium"
            >
              {comment.user.username}
            </AppLink>
            {me?.id === comment.user_id && !isLoading && (
              <div className="flex space-x-2">
                <IconTrash
                  className="cursor-pointer"
                  size={20}
                  onClick={onDelete}
                />
              </div>
            )}
          </div>
          <div className="text-xs text-gray-400">
            <time dateTime={comment.created_at!}>
              {format(new Date(comment.created_at!), 'MMMM dd, yyyy')} (
              {formatDistance(new Date(comment.created_at!), new Date(), {
                addSuffix: true,
              })}
              )
            </time>
          </div>
        </div>
      </div>
      <div className="prose prose-sm max-w-none">
        <PostHTML html={comment.body} />
      </div>
    </article>
  );
}
