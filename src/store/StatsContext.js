import React, { createContext, useContext, useMemo, useState } from 'react';

const StatsContext = createContext(null);

export const StatsProvider = ({ children }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);

  const value = useMemo(() => ({
    totalUsers,
    setTotalUsers,
    totalJobs,
    setTotalJobs,
  }), [totalUsers, totalJobs]);

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error('useStats must be used within StatsProvider');
  return ctx;
};
