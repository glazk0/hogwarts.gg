-- CUSTOM TYPES
alter type public.app_permission
add
  value if not exists 'comments.edit';


alter type public.app_permission
add
  value if not exists 'comments.delete';