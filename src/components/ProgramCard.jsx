import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProgramCard(props) {
  const { id, name, author, image, tags, hdlClickProgram, className } = props;
  const navigate = useNavigate();

  return (
    <div className={className}>
      <div
        className="shadow-md cursor-pointer overflow-hidden bg-black border rounded-xl"
        onClick={() => hdlClickProgram(id)}
        style={{ aspectRatio: "1 / 1" }} // Ensures the card is square
      >
        <div className="relative flex items-center h-full w-full">
          <img
            className="h-full w-full object-cover transition-all mix-blend-screen opacity-70 hover:opacity-40 hover:scale-105"
            src={
              image ||
              "https://workoutlabs.com/fit/wp-content/uploads/2017/03/bodyweight-buff-no-equipment-muscle-builder-workout.jpg"
            }
            alt=""
          />
          <div className="absolute inset-0 flex flex-col justify-center p-4">
            <div>
              <h1 className="text-center text-3xl transition-all text-white font-bold">
                {name}
              </h1>
              <div className="flex w-full justify-center hover:scale-110 hover:font-bold hover:text-primary transition-all">
                <Link
                  to={`/profile/`}
                  className="mx-auto text-center font-extralight text-white text-lg"
                >
                  By {author}
                </Link>
              </div>

              {Array.isArray(tags) && tags.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {tags.map((el, index) => (
                    <div
                      key={index}
                      className="text-center bg-primary p-2 w-fit mx-auto text-xs font-bold py-1 text-white rounded-full"
                    >
                      {el}
                    </div>
                  ))}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
