import React, { useState } from "react";

const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
};

const modalContentStyle = {
    background: "linear-gradient(135deg, #f3fbf3 0%, #e3f0ff 100%)",
    padding: "48px 40px 40px 40px",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(25, 118, 210, 0.12)",
    minWidth: "550px", // Increased from 540px
    minHeight: "440px",
    width: "800px",    // Increased from 600px
    maxWidth: "99vw",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "2.5px solid #b7e3bc",
    position: "relative",
};

const profileImageStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #6AB320",
    marginBottom: "18px",
    background: "#f5f5f5",
    boxShadow: "0 2px 12px rgba(106, 179, 32, 0.10)",
};

const dividerStyle = {
    width: "60%",
    height: "2px",
    background: "black",
    margin: "18px auto 24px auto",
    border: "none",
    borderRadius: "2px",
};

const detailLabelStyle = {
    fontWeight: "bold",
    color: "black",
    fontSize: "16px",
    minWidth: "80px",
    letterSpacing: "0.5px",
};

const detailValueStyle = {
    fontWeight: 400,
    color: "#222",
    fontSize: "17px",
    marginBottom: "18px",
    flex: 1,
    wordBreak: "break-word",
};

const closeButtonStyle = {
    marginTop: "28px",
    padding: "10px 32px",
    border: "none",
    borderRadius: "8px",
    background: " #6AB320",
    color: "white",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    boxShadow: "0 2px 8px rgba(25, 118, 210, 0.10)",
    transition: "background 0.2s, box-shadow 0.2s, transform 0.2s",
};

const closeButtonHoverStyle = {
    background: " #6AB320 ",
    boxShadow: "0 4px 16px rgba(25, 118, 210, 0.18)",
    transform: "translateY(-2px) scale(1.04)",
};

const UserDetailsModal = ({ user, open, onClose }) => {
    const [isHover, setIsHover] = useState(false);
    if (!open || !user) return null;
    const defaultAvatar =
        "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg";
    return (
        <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
                <img
                    src={user.image || defaultAvatar}
                    alt="Profile"
                    style={profileImageStyle}
                />
                <hr style={dividerStyle} />
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center", 
                    width:"100%",                
                    marginTop: 18,
                }}>
                    {/* Left column: Name, Gender, Address */}
                    <div style={{ flex: 3, display: "flex", flexDirection: "column", gap: 18 }}>
                        <div style={{ display: "flex"}}>
                            <div style={detailLabelStyle}>Name :</div>
                            <div style={detailValueStyle}>{user.name}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div style={detailLabelStyle}>Gender :</div>
                            <div style={detailValueStyle}>{user.gender}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div style={detailLabelStyle}>Address :</div>
                            <div style={detailValueStyle}>{user.address}</div>
                        </div>
                    </div>
                    {/* Right column: Contact, Email */}
                    <div style={{ flex: 2, display: "flex", flexDirection: "column", gap: 18 }}>
                        <div style={{ display: "flex" }}>
                            <div style={detailLabelStyle}>Contact :</div>
                            <div style={detailValueStyle}>{user.contact}</div>
                        </div>
                        <div style={{ display: "flex" }}>
                            <div style={detailLabelStyle}>Email :</div>
                            <div style={detailValueStyle}>{user.email}</div>
                        </div>
                    </div>
                </div>
                <button
                    style={isHover ? { ...closeButtonStyle, ...closeButtonHoverStyle } : closeButtonStyle}
                    onClick={onClose}
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default UserDetailsModal; 