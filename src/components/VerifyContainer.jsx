import React, { useState } from "react";
import useAuthStore from "../stores/authStore";
import { toast } from "react-toastify";
import useVerifyStore from "../stores/verifyStore";

export default function VerifyContainer(props) {
  const { file, image, hdlFileChange, setFile, setImage } = props;
  const [isLoading, setIsLoading] = useState(false);
  const token = useAuthStore(state => state.token)
  const uploadVerify = useVerifyStore(state => state.uploadVerify)

  const hdlSubmit = async(e) => {
    try {
      setIsLoading(true);
      await uploadVerify(file);
      setFile(null);
      setImage(null);
      e.target.closest("dialog").close();
      toast.success("Verification submitted successfully");
    } catch (error) {
      toast.error("Failed to submit verification");
      console.log(error);
    } finally {
      setIsLoading(false);
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
          <button 
            className={`btn btn-primary flex-1 ${isLoading ? 'loading' : ''}`} 
            onClick={hdlSubmit}
            disabled={isLoading || !file}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
          <button className="btn flex-1">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
