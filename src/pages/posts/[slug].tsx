import { gql } from '@apollo/client';
import { client } from '../../services/apollo';
import { RichText } from '@graphcms/rich-text-react-renderer';
import Head from 'next/head';
import { ElementNode } from '@graphcms/rich-text-types';
import styles from './post.module.scss';
import { getSession } from 'next-auth/react';

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: ElementNode;
    publishedAt: string;
  };
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.publishedAt}</time>
          <RichText content={post.content.raw} />
        </article>
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

export const getServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const { slug } = params;

  if (!session.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { data } = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { slug },
  });

  const post = {
    ...data.post,
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
