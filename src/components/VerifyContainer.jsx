import React, { useState } from "react";

export default function VerifyContainer(props) {
  const { file, image, hdlFileChange, setFile, setImage } = props;

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
          <button className="btn btn-primary flex-1">Submit</button>
          <button
            onClick={(e) => {
              e.target.closest("dialog").close();
              setFile(null);
              setImage(null);
            }}
            className="btn flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
