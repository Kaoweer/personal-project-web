import React, { useEffect, useState } from 'react'
import useExerciseStore from '../stores/exerciseStore'

export default function ExerciseDetailContainer(props) {
  const {id,exerciseDetail} = props
  const [exerciseData,setExerciseData] = useState()
  const getExercise = useExerciseStore(state => state.getExercise)

  console.log(exerciseData)
  return (
    <div>
      <h1>{exerciseData?.name}</h1>
    </div>
  )
}
