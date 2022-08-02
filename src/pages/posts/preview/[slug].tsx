import { gql } from '@apollo/client';
import { client } from '../../../services/apollo';
import { RichText } from '@graphcms/rich-text-react-renderer';
import Head from 'next/head';
import { ElementNode } from '@graphcms/rich-text-types';
import styles from '../post.module.scss';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: ElementNode;
    publishedAt: string;
  };
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default function PostPreviewProps({ post }: PostPreviewProps) {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [data, post.slug, router]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={`${styles.post} ${styles.previewContent}`}>
          <h1>{post.title}</h1>
          <time>{post.publishedAt}</time>
          <RichText content={post.content.raw} />
        </article>
        <div className={styles.continueReading}>
          Wanna continue reading?{' '}
          <Link href="/">
            <a>Subscribe now 😎</a>
          </Link>
        </div>
      </main>
    </>
  );
}

const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String) {
    post(where: { slug: $slug }) {
      publishedAt
      slug
      title
      content {
        raw
      }
    }
  }
`;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const { data } = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { slug },
  });

  const post = {
    ...data.post,
    content: {
      ...data.post.content,
      raw: {
        ...data.post.content.raw,
        children: data.post.content.raw.children.slice(0, 4),
      },
    },
    publishedAt: new Date(data.post.publishedAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  };

  return {
    props: { post },
  };
};
