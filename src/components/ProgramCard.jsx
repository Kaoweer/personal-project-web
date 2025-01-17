import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProgramCard(props) {
  const {
    id,
    name,
    author,
    image,
    tags,
    authorId,
    hdlClickProgram,
    className,
  } = props;
  const navigate = useNavigate();

  return (
    <div className={className}>
      <div
        className="shadow-md cursor-pointer overflow-hidden bg-black border rounded-xl max-w-[250px]"
        onClick={() => hdlClickProgram(id)}
        style={{ aspectRatio: "1 / 1" }}
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
              <h1 className="text-center text-xl transition-all text-white font-bold">
                {name}
              </h1>
              <div className="flex w-full justify-center hover:scale-110 hover:font-bold hover:text-primary transition-all">
                <Link
                  to={`/profile/${authorId}`}
                  className="mx-auto text-center font-extralight text-white text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  By {author}
                </Link>
              </div>

              {Array.isArray(tags) && tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="text-center bg-primary p-1 w-fit mx-auto text-[10px] font-bold text-white rounded-full"
                    >
                      {typeof tag === "object" ? tag.name : tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
