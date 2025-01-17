import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgramCard from "../../components/ProgramCard";
import useProgramStore from "../../stores/programStore";
import CreateProgram from "../../components/CreateProgram";
import useAuthStore from "../../stores/authStore";

export default function AllProgram() {
  const [programs, setPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const getAllProgram = useProgramStore((state) => state.getAllProgram);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchProgram = async () => {
      setIsLoading(true);
      try {
        const result = await getAllProgram(currentPage, itemsPerPage);
        setPrograms(result.data.data);
        setTotalPages(result.data.pagination.totalPages);
        setTotalItems(result.data.pagination.totalItems);
        setItemsPerPage(result.data.pagination.itemsPerPage);
      } catch (err) {
        console.log("Error fetching programs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgram();
  }, [currentPage, itemsPerPage]);

  const hdlClickProgram = (programId) => {
    navigate(`${programId}`);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`btn btn-circle ${
            currentPage === i ? "btn-primary" : "btn-ghost"
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="bg-base-100">
      <div className="max-w-[1000px] mx-auto">
        <div className="my-4">
          <div className="flex py-4 items-center justify-between">
            <div className="flex">
              <h1 className="text-5xl font-bold text-primary">
                Public programs {totalItems}
              </h1>
            </div>
            {token && (
              <button
                className="text-lg btn btn-primary rounded-full bg-transparent border-2"
                onClick={() =>
                  document.getElementById("create-modal").showModal()
                }
              >
                + Add your program
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-x-1 gap-y-2 w-full min-h-[400px]">
              {Array.isArray(programs) &&
                programs.map((item) => (
                  <ProgramCard
                    key={item.id}
                    className={"h-[250px] w-full"}
                    id={item.id}
                    hdlClickProgram={hdlClickProgram}
                    name={item.name}
                    author={item.author.username}
                    authorId={item.authorId}
                    image={item.image}
                    tags={JSON.parse(item.tags)}
                  />
                ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 my-8">
                <button
                  className="btn btn-circle btn-ghost"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {renderPaginationButtons()}
                <button
                  className="btn btn-circle btn-ghost"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            )}
          </>
        )}

        <dialog id="create-modal" className="modal">
          <div className="modal-box max-w-[700px]">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={(e) => {
                e.target.closest("dialog").close();
              }}
            >
              ✕
            </button>
            <CreateProgram setPrograms={setPrograms} />
          </div>
        </dialog>
      </div>
    </div>
  );
}
