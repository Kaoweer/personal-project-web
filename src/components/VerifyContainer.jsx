import React, { useState } from "react";
import useAuthStore from "../stores/authStore";
import { toast } from "react-toastify";
import useVerifyStore from "../stores/verifyStore";

export default function VerifyContainer(props) {
  const { file, image, hdlFileChange, setFile, setImage } = props;
  const token = useAuthStore(state => state.token)
  const uploadVerify = useVerifyStore(state => state.uploadVerify)

  const hdlSubmit = async(e) => {
    try {
      e.target.closest("dialog").close();
      setFile(null);
      setImage(null);
      uploadVerify(file)
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold">
          Insert your trainer certification
        </h1>
        <input
          type="file"
          onChange={hdlFileChange}
          className="file-input file-input-bordered w-full"
        />
        {file && <img src={URL.createObjectURL(file)} alt="" />}
        <div className="flex gap-2">
          <button className="btn btn-primary flex-1" onClick={hdlSubmit}>Submit</button>
          <button
            className="btn flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
