import { gql } from '@apollo/client';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { client } from '../../services/apollo';

import styles from './styles.module.scss';

interface Post {
  id: string;
  title: string;
  firstParagraph: string;
  slug: string;
  publishedAt: string;
}

type PostProps = {
  posts: Post[];
};

export default function Posts({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.id}>
              <a>
                <time>{post.publishedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.firstParagraph}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

const GET_POSTS = gql`
  query GetPosts {
    posts(orderBy: publishedAt_ASC, stage: PUBLISHED) {
      publishedAt
      slug
      title
      firstParagraph
      id
    }
  }
`;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await client.query({ query: GET_POSTS });

  const posts = data.posts.map((post) => {
    return {
      ...post,
      publishedAt: new Date(post.publishedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return {
    props: { posts },
  };
};
