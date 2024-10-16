import React from 'react'

export default function ProgramCard(props) {
  const {id, name,author,tags,hdlClickProgram} = props
  return (
    <div>
      <div className="shadow-md cursor-pointer w-fit overflow-hidden bg-black h-fit border rounded-lg" onClick={() => hdlClickProgram(id)}>
        <div className='relative'>
          <img className='w-[300px] h-[300px] transition-all opacity-70 hover:opacity-40 hover:scale-105' src="https://workoutlabs.com/fit/wp-content/uploads/2017/05/engage-intermediate-full-body-crafting-plan.jpg" alt="" />
          <div className='absolute w-full top-0 left-auto p-4'>
            <h1 className='text-center text-xl text-white font-bold'>{name}</h1>
            <p className='text-center text-white text-sm'>By {author}</p>
            <p className='text-white text-sm'>
              Tags : 
              {tags ? Object.entries(tags).map(([key,value],index) => {
                  console.log(key)
                  return (
                    <div key={index}>
                      {key} : {value.map((item,index)=>{
                        return (
                          <span key={index}>{item},</span>
                        )
                      })}
                    </div>
                  )
                }) : <></>}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
