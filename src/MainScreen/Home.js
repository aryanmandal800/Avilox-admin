import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Skeleton } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// Keyframe animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const DashboardContainer = styled(Box)({
  minHeight: '100vh',
  background: `
    linear-gradient(135deg, #f0f8f0 0%, #e6f3ff 100%),
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
  `,
  padding: '20px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 25% 25%, rgba(76, 175, 80, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(33, 150, 243, 0.05) 0%, transparent 50%)
    `,
    animation: `${float} 6s ease-in-out infinite`,
  },
});

const HeaderContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  animation: `${fadeInUp} 0.8s ease-out`,
});

const HorizontalLine = styled(Box)({
  width: '100%',
  height: '3px',
  background: 'linear-gradient(90deg, transparent 0%, #4caf50 20%, #2196f3 50%, #4caf50 80%, transparent 100%)',
  marginBottom: '30px',
  borderRadius: '2px',
  position: 'relative',
  animation: `${fadeInUp} 1s ease-out 0.2s both`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '8px',
    height: '7px',
    background: '#4caf50',
    borderRadius: '50%',
    boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
  },
});

const DashboardTitle = styled(Typography)({
  fontSize: '26px',
  fontWeight: '800',
  background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 50%, #2196f3 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
  animation: `${fadeInLeft} 0.8s ease-out`,
});

const RefreshButton = styled(Button)({
  background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
  color: 'white',
  borderRadius: '12px',
  padding: '10px 14px',
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: '600',
  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeInRight} 0.8s ease-out`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover': {
    background: 'linear-gradient(135deg, #45a049 0%, #4caf50 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
    '&::before': {
      left: '100%',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
  },
});

const StatsCard = styled(Card)(({ index }) => ({
  borderRadius: '20px',
  background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)',
  backdropFilter: 'blur(15px)',
  border: '1px solid rgba(255,255,255,0.3)',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeInUp} 0.8s ease-out ${index * 0.1 + 0.4}s both`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #4caf50 0%, #2196f3 50%, #ff9800 100%)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent)',
    animation: `${rotate} 10s linear infinite`,
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  '&:hover': {
    transform: 'translateY(-12px) scale(1.03)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.1)',
    background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 100%)',
    '&::after': {
      opacity: 1,
    },
  },
}));

const StyledCardContent = styled(CardContent)({
  padding: '32px',
  textAlign: 'center',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

const IconContainer = styled(Box)(({ color }) => ({
  width: '90px',
  height: '90px',
  borderRadius: '50%',
  background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
  fontSize: '36px',
  boxShadow: `0 12px 30px ${color}40, 0 4px 12px ${color}20`,
  position: 'relative',
  animation: `${pulse} 2s ease-in-out infinite`,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '3px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)`,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: '-5px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${color}20, transparent)`,
    animation: `${pulse} 2s ease-in-out infinite`,
    zIndex: -1,
  },
}));

const StatNumber = styled(Typography)({
  fontSize: '42px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '12px',
});

const StatLabel = styled(Typography)({
  fontSize: '18px',
  color: '#666',
  fontWeight: '500',
});

const Home = () => {
  const [stats, setStats] = useState({
    registeredUsers: 0,
    courses: 0,
    jobs: 0,
    supportQueries: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    registeredUsers: 0,
    courses: 0,
    jobs: 0,
    supportQueries: 0,
  });

  const animateNumber = (start, end, duration, callback) => {
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      callback(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newStats = {
        registeredUsers: Math.floor(Math.random() * 100),
        courses: Math.floor(Math.random() * 50),
        jobs: Math.floor(Math.random() * 30),
        supportQueries: Math.floor(Math.random() * 20),
      };
      setStats(newStats);
      
      // Animate each number
      Object.keys(newStats).forEach((key, index) => {
        setTimeout(() => {
          animateNumber(animatedStats[key], newStats[key], 1000, (value) => {
            setAnimatedStats(prev => ({ ...prev, [key]: value }));
          });
        }, index * 200);
      });
      
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const dashboardCards = [
    {
      title: 'Registered Users',
      value: animatedStats.registeredUsers,
      icon: '👥',
      color: '#4caf50',
    },
    {
      title: 'Courses',
      value: animatedStats.courses,
      icon: '📚',
      color: '#ff9800',
    },
    {
      title: 'Jobs',
      value: animatedStats.jobs,
      icon: '💼',
      color: '#2196f3',
    },
    {
      title: 'Support Queries',
      value: animatedStats.supportQueries,
      icon: '❓',
      color: '#9c27b0',
    },
  ];

  return (
    <DashboardContainer>
      <HeaderContainer>
        <DashboardTitle variant="h2">Dashboard Overview</DashboardTitle>
        <RefreshButton onClick={handleRefresh}>
          🔄 Refresh
        </RefreshButton>
      </HeaderContainer>
      
      <HorizontalLine />

      <Grid container spacing={4}>
        {dashboardCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatsCard index={index}>
              <StyledCardContent>
                <IconContainer color={card.color}>
                  {card.icon}
                </IconContainer>
                {isLoading ? (
                  <Skeleton 
                    variant="text" 
                    width={80} 
                    height={60} 
                    animation="wave"
                    sx={{ 
                      margin: '0 auto 12px',
                      '&::after': {
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                      }
                    }} 
                  />
                ) : (
                  <StatNumber variant="h3">{card.value}</StatNumber>
                )}
                <StatLabel variant="body1">{card.title}</StatLabel>
              </StyledCardContent>
            </StatsCard>
          </Grid>
        ))}
      </Grid>
    </DashboardContainer>
  );
};

export default Home;