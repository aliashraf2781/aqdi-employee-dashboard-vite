import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { createBlog, fetchBlog, fetchBlogs, updateBlog } from '@/features/settings/api/blogs-api';
import { buildBlogFormData } from '@/features/settings/lib/blog';

const BLOGS_QUERY_KEY = 'blogs';
const BLOG_QUERY_KEY = 'blog';
const BLOGS_LIST_PATH = '/home/settings/blogs';

export function useBlogs(page) {
  return useQuery({
    queryKey: [BLOGS_QUERY_KEY, page],
    queryFn: () => fetchBlogs({ page }),
    placeholderData: keepPreviousData,
  });
}

export function useBlog(id) {
  return useQuery({ queryKey: [BLOG_QUERY_KEY, id], queryFn: () => fetchBlog(id), enabled: Boolean(id) });
}

/** Create (no `blogId`) or update (with `blogId`), then go back to the list / the blog page. */
export function useSaveBlog(blogId) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isEdit = Boolean(blogId);

  return useMutation({
    mutationFn: (values) => {
      const formData = buildBlogFormData(values);
      return isEdit ? updateBlog({ id: blogId, formData }) : createBlog(formData);
    },
    onSuccess: (body) => {
      toast.success(body?.message || (isEdit ? 'تم تحديث المقال بنجاح' : 'تم إنشاء المقال بنجاح'));
      queryClient.invalidateQueries({ queryKey: [BLOGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BLOG_QUERY_KEY, blogId] });
      navigate(isEdit ? `${BLOGS_LIST_PATH}/${blogId}` : BLOGS_LIST_PATH);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, isEdit ? 'حدث خطأ أثناء تحديث المقال' : 'حدث خطأ أثناء إنشاء المقال'));
    },
  });
}
