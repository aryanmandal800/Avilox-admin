import React from 'react';
import { MdRedeem } from "react-icons/md";

const redemptionData = [
  { code: 'SUMMER20', date: 'July 15, 2024', emailId: 'user1@example.com' },
  { code: 'BACKTOSCHOOL', date: 'August 20, 2024', emailId: 'user2@example.com' },
  { code: 'HOLIDAY10', date: 'December 10, 2024', emailId: 'user3@example.com' },
  { code: 'SPRING25', date: 'April 5, 2024', emailId: 'user4@example.com' },
  { code: 'WINTER15', date: 'January 20, 2024', emailId: 'user5@example.com' },
  
];

const containerStyle = {
  padding: '16px',
  background: '#f3fbf3',
};

const headerRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
};

const titleStyle = {
  color: "green",
  fontWeight: 700,
  fontSize: "2rem",
  margin: 0,
  letterSpacing: "-1px",
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  marginTop: '16px',
  background: '#f3fbf3',
  boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  borderRadius: '8px',
  overflow: 'hidden',
};

const thStyle = {
  padding: '18px 8px',
  background: '#b7e3bc',
  color: '#111',
  fontWeight: 700,
  fontSize: '18px',
  border: 'none',
  textAlign: 'center',
};

const tdStyle = {
  padding: '16px 8px',
  background: '#f3fbf3',
  color: '#111',
  fontWeight: 400,
  fontSize: '16px',
  border: 'none',
  borderBottom: '1px solid #b7e3bc',
  textAlign: 'center',
};

const emptyContainerStyle = {
  height: '50vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '48px 16px',
  gap: '12px',
  textAlign: 'center',
};

const emptyIconStyle={
  animation : 'bounce 2s infinite',
  fontSize: '4rem',
  marginBottom: '12px',
  
}
const bounceKeyframes = `
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-12px); }
  60% { transform: translateY(-6px); }
}
`;

const emptyTitleStyle = {
  margin: 0,
  fontSize: '20px',
  fontWeight: 600,
  color: '#2c662d',
};

const emptyTextStyle = {
  margin: 0,
  fontSize: '14px',
  color: 'grey',
};

const RedemptionHistory = () => {
  // No search or status, so no state needed
  return (
    <div style={containerStyle}>
      <div style={headerRowStyle}>
        <h3 style={titleStyle}>Redemption History</h3>
        {/* Optionally, add a search bar or filter here for consistency */}
      </div>
      <hr />
      {redemptionData.length === 0 ? (
        <div style={emptyContainerStyle}>
          <style>{bounceKeyframes}</style>
          <MdRedeem style={emptyIconStyle} />
          <h4 style={emptyTitleStyle}>No redemptions yet</h4>
          <p style={emptyTextStyle}>When you redeem a coupon, it will appear here.</p>
        </div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Coupon Code</th>
              <th style={thStyle}>Redemption Date</th>
              <th style={thStyle}>Email ID</th>
            </tr>
          </thead>
          <tbody>
            {redemptionData.map((item) => (
              <tr key={item.code}>
                <td style={tdStyle}>{item.code}</td>
                <td style={tdStyle}>{item.date}</td>
                <td style={tdStyle}>{item.emailId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default RedemptionHistory;