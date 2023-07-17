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
  animation: `${scroll} linear 3000s infinite`,
  '&:hover': {
    animationPlayState: 'paused',
  },
}));

const StyledArticle = styled(Box)(({ theme }) => ({
  minWidth: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    minWidth: '70%',
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: '100%',
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  fontSize: '0.8rem',
  '&:hover': {
    color: theme.palette.primary.light,
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '0.6rem',
  },
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
            <StyledLink
              target="_blank"
              href={article.url}
              underline="none"
              mr={2}
            >
              {article.title}
            </StyledLink>
            <Chip label={article.source.name} color="primary" size="small" />
          </StyledArticle>
        ))}
      </StyledNewsFeed>
    </StyledNewsFeedWrapper>
  );
};

export default NewsFeed;
