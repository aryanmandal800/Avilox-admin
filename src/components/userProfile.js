import { useContext, useEffect, useState } from "react";
import NavTemplate from "./NavTemplate.js";
import PageBody from "./PageBody.js";
import { Divider } from "@mui/material";
import { FaCamera, FaEdit } from "react-icons/fa";
import { UserContext, useUser } from "./store/index.js";
import userService from "../services/user.service";
import NotificationModal from "./NotificationModal";

const UserProfile = () => {
  const { updateUser } = useContext(UserContext);
  const { userInfo } = useUser(); 
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [image, setImage] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [editableFields, setEditableFields] = useState({
    Name: false,
    email: false,
    phoneNumber: false,
  });

  // Fetch admin profile from API
  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getAdminProfile();
      console.log("Admin profile data:", response);
      
      if (response.admin) {
        setName(response.admin.name || "");
        setEmail(response.admin.email || "");
        setPhoneNumber(response.admin.phone || "");
        setRole(response.admin.role || "");
      }
    } catch (err) {
      console.error("Failed to fetch admin profile:", err);
      setError(err.message || "Failed to load profile");
      // Fallback to localStorage data if API fails
      const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
      if (adminData.name) {
        setName(adminData.name || "");
        setEmail(adminData.email || "");
        setPhoneNumber(adminData.phone || "");
      }
    } finally {
      setLoading(false);
    }
  };

  // Keep the old useEffect as fallback
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.Name || userInfo.name || "");
      setEmail(userInfo.email || "");
      setPhoneNumber(userInfo.phoneNumber || userInfo.phone || "");
      setImage(userInfo.photo || null);
      setRole(userInfo.role || "");
    }
  }, [userInfo]);

  const toggleEdit = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleOnUploadImage = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(`${reader.result}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOnClickSave = async () => {
    try {
      setSaving(true);
      setError("");
      
      const adminData = {
        name: Name,
        email: email,
        phone: phoneNumber,
      };
      
      console.log("Updating admin profile:", adminData);
      const response = await userService.updateAdminProfile(adminData);
      console.log("Profile updated successfully:", response);
      
      // Update localStorage with new data
      if (response.admin) {
        localStorage.setItem('adminData', JSON.stringify(response.admin));
      }
      
      // Disable all edit fields
      setEditableFields({
        Name: false,
        email: false,
        phoneNumber: false,
      });
      
      // Show success notification
      showNotification('success', 'Success', 'Profile updated successfully!');
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const showNotification = (type, title, message) => {
    setNotification({
      open: true,
      type,
      title,
      message,
    });
  };

  const hideNotification = () => {
    setNotification({
      open: false,
      type: 'success',
      title: '',
      message: '',
    });
  };

  const handleOnClickCancel = async () => {
    // Fetch fresh data from API
    fetchAdminProfile();
    // Disable all edit fields
    setEditableFields({
      Name: false,
      email: false,
      phoneNumber: false,
    });
  }
  
  if (loading) {
    return (
      <NavTemplate tab={"Profile"}>
        <PageBody>
          <div style={{ paddingTop: 20, backgroundColor: "#f3fbf3", width: "100%" }}>
            <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>
          </div>
        </PageBody>
      </NavTemplate>
    );
  }

  return (
    <>
    <NavTemplate tab={"Profile"}>
    <PageBody>
        <div style={{ paddingTop: 20 , backgroundColor: "#f3fbf3" , width: "100%"}}>
          <h4 style={{ paddingLeft: 20 }}>Profile</h4>
          <Divider sx={{ borderWidth: "1px", marginTop: "10px" }} />
          
          {error && (
            <div style={{
              margin: "20px",
              padding: "10px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              borderRadius: "5px",
              border: "1px solid #f5c2c7"
            }}>
              {error}
            </div>
          )}

          <div className="profile-container">
            <div className="image-wrapper">
              <img
                src={
                 image ||
                  "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg"
                }
                alt="Profile"
                className="profile-image"
              />
              <label htmlFor="imageUpload" className="camera-icon">
                <FaCamera size={18} color="blue" />
              </label>
              <input onChange={handleOnUploadImage} type="file" accept="image/*" id="imageUpload" style={{ display: "none" }} />
            </div>
          </div>

          <div className="input-container">
            {[
              { label: "Name", value: Name, setValue: setName, field: "Name", disabled: false },
              { label: "Email", value: email, setValue: setEmail, field: "email", disabled: false },
              { label: "Phone Number", value: phoneNumber, setValue: setPhoneNumber, field: "phoneNumber", disabled: false },
              { label: "Role", value: role, setValue: setRole, field: "role", disabled: true },
            ].map(({ label, value, setValue, field, disabled = false }) => (
              <div key={field} className="input-wrapper">
                <label className="input-label">{label}</label>
                <div className="input-edit-container">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={label}
                    className="input-field"
                    disabled={disabled || !editableFields[field]}
                  />
                  {!disabled && <FaEdit className="edit-icon" onClick={() => toggleEdit(field)} />}
                </div>
              </div>
            ))}
          </div>

          <div className="button-container">
            <button 
              className="save-button" 
              onClick={handleOnClickSave}
              disabled={saving}
              style={{ opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
            >
              {saving ? "Saving..." : "Save & Update"}
            </button>
            <button className="cancel-button" onClick={handleOnClickCancel} disabled={saving}>
              Cancel
            </button>
          </div>
        </div>
      </PageBody>
    </NavTemplate>

      {/* Notification Modal */}
      <NotificationModal
        open={notification.open}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      <style>
        {`
          .profile-container {
            display: flex;
            align-items: center;
            padding: 30px;
            background-color: #f3fbf3;
          }
          .image-wrapper {
            position: relative;
            display: inline-block;
          }
          .profile-image {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #f5f107;
          }
          .camera-icon {
            position: absolute;
            bottom: 5px;
            right: 5px;
            background-color: white;
            border-radius: 50%;
            padding: 6px;
            cursor: pointer;
            box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
          }
          .camera-icon:hover {
            background-color: #f0f0f0;
          }
          .input-container {
            display: flex;
            flex-direction: column;
            padding: 30px;
          }
          .input-field {
            height: 40px;
            width: 40%;
            margin-bottom: 20px;
            border-radius: 7px;
            padding-left: 10px;
            border: 1px solid #ccc;
          }
          .button-container {
            display: flex;
            justify-content: flex-start;
            gap: 15px;
            padding: 30px;
          }
          .save-button, .cancel-button {
            height: 40px;
            width: 200px;
            border-radius: 7px;
            border: none;
            cursor: pointer;
            font-size: 16px;
          }
          .save-button {
            background-color: #6AB320;
            color: white;
          }
          .cancel-button {
            background-color: #ccc;
            color: black;
          }
          .save-button:hover {
            background-color: green;
          }
          .cancel-button:hover {
            background-color: #b0b0b0;
          }
           .input-wrapper {
            display: flex;
            flex-direction: column;
            margin-bottom: 20px;
          }
          .input-label {
            font-size: 14px;
            margin-bottom: 5px;
            color: #333;
          }
          .input-field-container {
            display: flex;
            align-items: center;
            position: relative;
          }
          .input-field {
            height: 40px;
            width: 40%;
            border-radius: 7px;
            padding-left: 10px;
            padding-right: 40px;
            border: 1px solid #ccc;
          }
          .input-field:disabled {
            background-color: #f5f5f5;
            color: #999;
            cursor: not-allowed;
          }
          .edit-icon {
        
            right: 10px;
            cursor: pointer;
            color: #007bff;
          }
          .edit-icon:hover {
            color: #0056b3;
          }
          .button-container {
            display: flex;
            justify-content: flex-start;
            gap: 15px;
            padding: 30px;
          }
        `}
      </style>
    </>
  );
};

export default UserProfile;
