import React from "react";

const GroupInfo = () => {
  const groupInfoStyle = {
    backgroundColor: "#f0f0f0",
    padding: "20px",
    borderRadius: "5px",
    maxWidth: "96%",
    marginTop: "auto",
  };

  const groupTitleStyle = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  };

  return (
    <div style={groupInfoStyle}>
      <h2 style={groupTitleStyle}>Lost and Found Tracker</h2>
      <p>
        Report lost or found belongings, browse community reports, and help
        reunite people with their items.
      </p>
    </div>
  );
};

export default GroupInfo;
