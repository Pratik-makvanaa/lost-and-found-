import React, { useState } from "react";
import axios from "axios";
import config from "./config";
import Spinner from "./Spinner";
import { validateContactDetails } from "../utils/validation";

const Base_URL = config.baseURL;

const FoundItems = (props) => {
  const { item } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [userHostel, setUserHostel] = useState("");
  const [proofOfClaim, setProofOfClaim] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  if (!item || item.concerntype !== "found") {
    return null;
  }

  const boxStyle = {
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    margin: "10px",
    display: "flex",
    flexDirection: "column", 
  };

  const btnStyle = {
    backgroundColor: "#0074D9",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  };

  const btnStyleSubmit = {
    backgroundColor: "green",
    color: "white",
    padding: "8px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  };

  const inputStyle = {
    width: "90%",
    height: "15px",
    marginBottom: "5px",
  };

  const imageStyle = {
    width: "100%",
    maxHeight: "500px",
    margin: "5px",
  };

  const largerScreenMediaQuery = window.matchMedia("(min-width: 768px)");

  if (largerScreenMediaQuery.matches) {
    imageStyle.maxWidth = "40%";
  } else {
    imageStyle.maxWidth = "100%";
  }

  const closeButtonStyle = {
    cursor: "pointer",
  };

  const handleClaim = () => {
    setSubmitError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitClaim = async (_id) => {
    const validationError = validateContactDetails(userName, userMobile, userHostel);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }
    if (!proofOfClaim.trim()) {
      setSubmitError("Proof of claim is required.");
      return;
    }

    const data = {
      claimantname: userName,
      mobilenumber: userMobile,
      hostelname: userHostel,
      proofofclaim: proofOfClaim,
      itemdetails: `${item.itemname} - ${item.itemdescription}`,
    };

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await axios.post(`${Base_URL}/claimant`, data);
      await axios.delete(`${Base_URL}/item/${_id}`);
      closeModal();
      alert("Claim submitted successfully. The found item has been removed.");
    } catch (error) {
      console.error("Error submitting claim:", error);
      const validationErrors = error.response?.data?.errors;
      setSubmitError(
        validationErrors?.map(({ msg }) => msg).join(" ") ||
          error.response?.data?.message ||
          "Could not submit your claim. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={boxStyle}>
      <div>
        <h2>Name: {item.itemname}</h2>
        <p>Description: {item.itemdescription}</p>
        <p>
          This item has been <b>{item.concerntype}</b>
        </p>
        {item.images && item.images.length > 0 && (
          <div>
            <p>Images:</p>
            {item.images.map((image, index) => (
              <img key={index} src={image} alt="png" style={imageStyle} />
            ))}
          </div>
        )}
      </div>
      <button onClick={handleClaim} style={btnStyle}>
        Claim
      </button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              style={closeButtonStyle}
              onClick={closeModal}
            >
              &times;
            </span>
            <h3>Enter Your Information</h3>
            {submitError && (
              <p role="alert" style={{ color: "#b42318" }}>
                {submitError}
              </p>
            )}
            <input
              type="text"
              placeholder="Name"
              style={inputStyle}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Mobile Number"
              style={inputStyle}
              value={userMobile}
              onChange={(e) => setUserMobile(e.target.value)}
            />
            <input
              type="text"
              placeholder="Hostel name or place name"
              style={inputStyle}
              value={userHostel}
              onChange={(e) => setUserHostel(e.target.value)}
            />
            {item.concerntype === "found" && (
              <input
                type="text"
                placeholder="Proof of Claim"
                style={inputStyle}
                value={proofOfClaim}
                onChange={(e) => setProofOfClaim(e.target.value)}
              />
            )}
            {isSubmitting ? (
              <Spinner />
            ) : (
              <button
                onClick={() => handleSubmitClaim(item._id)}
                style={btnStyleSubmit}
              >
                Submit Claim
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoundItems;
