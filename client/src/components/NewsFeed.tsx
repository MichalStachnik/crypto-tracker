import { Box, Chip, Link, keyframes, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { Article } from '../types/Article';

const scroll = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-10000%);
  }
`;

const StyledNewsFeedWrapper = styled(Box)(({ theme }) => ({
  marginBottom: '20px',
  borderTop: `1px solid ${theme.palette.primary.dark}`,
  borderBottom: `1px solid ${theme.palette.primary.dark}`,
  width: '100dvw',
  overflow: 'hidden',
}));

const StyledNewsFeed = styled(Box)(() => ({
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  animation: `${scroll} 1200s infinite`,
  '&:hover': {
    animationPlayState: 'paused',
  },
}));

const StyledArticle = styled(Box)(() => ({
  minWidth: '60%',
}));

const NewsFeed = () => {
  const [articles, setArticles] = useState<Article[] | null>(null);
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    fetch('/api/news/bitcoin')
      .then((res) => res.json())
      .then((res) => setArticles(res.articles))
      .catch((err) => console.error('Error', err));
  };

  return (
    <StyledNewsFeedWrapper>
      <StyledNewsFeed>
        {articles?.map((article: Article) => (
          <StyledArticle key={article.url}>
            <Link target="_blank" href={article.url} underline="none" mr={2}>
              {article.title}
            </Link>
            <Chip label={article.source.name} color="primary" />
          </StyledArticle>
        ))}
      </StyledNewsFeed>
    </StyledNewsFeedWrapper>
  );
};

export default NewsFeed;
