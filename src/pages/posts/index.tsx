import { gql } from '@apollo/client';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { client } from '../../services/apollo';

import styles from './styles.module.scss';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna</strong>
            <p>
              In this guide, you will learn how to create a Monorepo to multiple
              packages with a shared
            </p>
          </a>
          <a href="#">
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna</strong>
            <p>
              In this guide, you will learn how to create a Monorepo to multiple
              packages with a shared
            </p>
          </a>
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
      id
    }
  }
`;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await client.query({ query: GET_POSTS });

  return {
    props: data,
  };
};
