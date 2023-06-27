
import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

export default function App() {
  const [listTodo, setListTodo] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [listDone, setListDone] = useState([])
  const [checkedState, setCheckedState] = useState(
    new Array(listDone.length).fill(false)
  );
  const handleOnChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  }
  function getData() {
    axios.get(' http://localhost:5000/items').then((res) => {
      // console.log(res.data);
      // const listItems = res.data;
      setListTodo(res.data)
    })
  }
  useEffect(() => {
    getData();

  }, []);
  function addData() {
    axios.post('http://localhost:5000/items', {
      name: newTodo,
      isDone: false
    }).then((res) => {
      // console.log(res.data);
    })
  }
  function changeStatus(item) {
    axios.put('http://localhost:5000/items/' + item.id, {
      ...item,
      isDone: true
    }).then((res) => {
      getData();
      // console.log(res.data);
    })
  }
  function removeItem(item) {
    axios.delete('http://localhost:5000/items/' + item.id).then((res) => {
      getData();
    })
  }
  function addList(newListDone) {
    console.log("addList");
    setListDone([])
    setListDone([...listDone, newListDone])
    // console.log(listDone);
  }
  useEffect(() => {
    console.log(listDone);
  }, [listDone])
  function changeListStatus(listDone) {
    for (let i = 0; i < listDone.length; i++) {
      axios.put('http://localhost:5000/items/' + listDone[i].id, {
        ...listDone[i],
        isDone: true
      }).then((res) => {
        getData();
        // console.log(res.data);
      }
      )
    }
  }
  return (
    <div>
      <div className='space-y-5 m-5 flex flex-col justify-center'>
        {/* head */}
        <form onSubmit={addData} className='flex justify-center gap-x-2'>
          <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder='Fill your TODO ' className='border-2 w-56 px-5' />
          <input type="submit" value="ADD" className='border-2 px-5' />
        </form>
        {/* Todo List */}
        <div>
          <h2 className='text-center py-5 text-xl'>Todo List</h2>
          <div className='flex justify-end px-4 py-2'>
            <button onClick={() => changeListStatus(listDone)} className='underline'> Done All</button>
          </div>
          <div className='space-y-3'>
            {listTodo.filter((item) => !item.isDone).map((item) => (
              <div className='bg-slate-200 rounded-md flex justify-between items-center p-3 '>
                <div className='flex items-center'>
                  <input type="checkbox" className='mr-3' checked={checkedState[item]} onChange={() => {
                    addList(item);
                    handleOnChange(item);
                  }} />
                  <p >{item.name}</p>
                </div>
                <div className='space-x-5'>
                  <button onClick={() => changeStatus(item)} className='bg-green-400 p-2 rounded-md '>Done</button>
                  <button onClick={() => removeItem(item)} className='bg-red-400 p-2 rounded-md'>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Done */}
        <div>
          <h2 className='text-center py-5 text-xl'>Done</h2>
          <div className='space-y-3'>
            {listTodo.filter((item) => item.isDone).map((item) => (
              <div className='bg-slate-200 rounded-md flex justify-between items-center p-3 '>
                <p >{item.name}</p>
                <div className='space-x-5'>
                  <button onClick={() => removeItem(item)} className='bg-red-400 p-2 rounded-md'>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


