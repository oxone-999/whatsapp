import React from 'react';
import PropTypes from "prop-types";
import Styles from "../../styles/AddGroup.module.css";
import { MultiSelect } from "react-multi-select-component";

function AddGroup({options, selected, setSelected, closeAddGroupPopup}) {
  return (
    <div className={Styles.addPopup}>
      <h3>Create a New Group</h3>
      <input type="text" placeholder="Group Name" />
      <input type="text" placeholder="Group Description" />
      <h3>Select Group Members</h3>
      <pre>{JSON.stringify(selected.label)}</pre>
      <MultiSelect
        className={Styles.selectGroup}
        options={options}
        value={selected}
        onChange={setSelected}
        labelledBy="Select"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "15rem",
        }}
      >
        <button style={{ color: "black" }}>Create</button>
        <button style={{ backgroundColor: "red" }} onClick={closeAddGroupPopup}>
          Close
        </button>
      </div>
    </div>
  );
}

AddGroup.propTypes = {
  options: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  setSelected: PropTypes.func.isRequired,
  closeAddGroupPopup: PropTypes.func.isRequired,
};

export default AddGroup