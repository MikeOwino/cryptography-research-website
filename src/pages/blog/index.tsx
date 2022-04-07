import fs from 'fs';
import matter from 'gray-matter';
import { Heading, Stack } from '@chakra-ui/react';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
// import TweetEmbed from 'react-tweet-embed';

import { ExternalPost, InternalPost, PageMetadata } from '../../components/UI';

import { getParsedDate, sortByDate } from '../../utils';

import { MarkdownPost } from '../../types';

export const getStaticProps: GetStaticProps = async context => {
  // get list of files from the posts folder
  const files = fs.readdirSync('src/posts');

  // get frontmatter & slug from each post
  const posts = files.map(fileName => {
    const slug = fileName.replace('.md', '');
    const readFile = fs.readFileSync(`src/posts/${fileName}`, 'utf-8');
    const { data: frontmatter } = matter(readFile);

    return {
      slug,
      frontmatter
    };
  });

  // return the pages static props
  return {
    props: {
      posts
    }
  };
};

interface Props {
  posts: MarkdownPost[];
}

// add here the list of external blog posts, with title, date and link
const externalLinks = [
  {
    title: 'Ethereum Merge: Run the majority client at your own peril!',
    date: '2022-03-24',
    link: 'https://dankradfeist.de/ethereum/2022/03/24/run-the-majority-client-at-your-own-peril.html'
  }
];

const Blog: NextPage<Props> = ({ posts }) => {
  const internalPosts = posts.map(post => {
    //extract slug and frontmatter
    const { slug, frontmatter } = post;
    //extract frontmatter properties
    const { title, date } = frontmatter;
    const parsedDate = getParsedDate(date);

    //JSX for individual blog listing
    return <InternalPost key={slug} date={date} slug={slug} title={title} />;
  });

  const externalPosts = externalLinks.map(({ date, link, title }) => (
    <ExternalPost key={link} date={date} link={link} title={title} />
  ));

  return (
    <>
      {/* TODO: add description */}
      <PageMetadata title='Blog' description='' />

      <main>
        <Heading as='h1' mb={10}>
          Blog
        </Heading>

        <Stack spacing={2}>{internalPosts.concat(externalPosts).sort(sortByDate)}</Stack>

        {/* <HStack spacing={8} alignItems='flex-start' wrap='wrap'>
          <TweetEmbed tweetId='1506958509195374598' />

          <TweetEmbed tweetId='1508538717660663809' />

          <TweetEmbed tweetId='1508474058748403716' />
        </HStack> */}
      </main>
    </>
  );
};

export default Blog;
