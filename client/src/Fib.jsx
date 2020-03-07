import React, { useEffect, useReducer } from 'react';
import axios from 'axios';

const reducer = (state, action) => {
  const { type, payload } = action
  switch(type) {
    case 'enterIndex':
      return { ...state, index: payload };
    case 'fetchValues':
      return { ...state, values: payload };
    case 'fetchIndexes':
      return { ...state, seenIndexes: payload };
    default:
      return { ...state };
  }
}

const initialState = {
  seenIndexes: [],
  values: {},
  index: ''
};

export const Fib = () => {

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    fetchValues()
    fetchIndexes()
  }, [])
  
  const fetchValues = async () => {
    const values = await axios.get('/api/values/current');
    dispatch({
      type: 'fetchValues',
      payload: values.data
    })
  }

  const fetchIndexes = async () => {
    const seenIndexes = await axios.get('/api/values/all');
    dispatch({
      type: "fetchIndexes",
      payload: seenIndexes.data
    });
  }

  const renderSeenIndexes = () => {
    return state.seenIndexes.length > 0 ? state.seenIndexes.map(({ number }) => number).join(', ') : null;
  }
  
  const renderValues = () => {
    const entries = [];
    for (let key in state.values) {
      entries.push(
        <div key={key}>
          For index {key}, I calculated {state.values[key]}
        </div>
      )
    }
    return entries
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/values', {
      index: state.index
    })
    dispatch({
      type: 'enterIndex',
      payload: ''
    })
  }

  const onChange = (e) => {
    dispatch({
      type: 'enterIndex',
      payload: e.currentTarget.value
    })
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="thing">Enter your index</label>
        <input
          id="thing"
          type="text"
          value={state.index}
          onChange={onChange}
        />
        <button type="submit">Submit</button>
      </form>
      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}
      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  )

}
