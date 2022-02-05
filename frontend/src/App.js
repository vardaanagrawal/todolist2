import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [list, setList] = useState([]);
  const [isupdating, setIsUpdating] = useState(false);
  const [updateid, setUpdateId] = useState("");

  useEffect(async () => {
    getList();
  }, []);

  async function getList() {
    const res = await axios.get("/getItem");
    setList(res.data.list);
  }

  const addItem = async (e) => {
    e.preventDefault();
    await axios
      .post("/addItem", {
        title: title,
        description: description,
      })
      .then((res) => {
        alert(res.data.message);
        getList();
        setTitle("");
        setDescription("");
      });
  };

  async function deleteItem(item) {
    await axios
      .delete("/deleteItem/" + item.id)
      .then((res) => {
        alert(res.data.message);
        getList();
      });
  }

  async function updateItem(e) {
    e.preventDefault();
    await axios
      .put("/updateItem", {
        id: updateid,
        title: title,
        description: description,
      })
      .then((res) => {
        alert(res.data.message);
        getList();
        setIsUpdating(false);
        setTitle("");
        setDescription("");
      });
  }

  return (
    <div className="App">
      <div style={{fontSize: '50px',fontWeight: 'bold',margin: '30px'}}>TO-DO LIST</div>
      {!isupdating ? (
        <form onSubmit={addItem}>
          <input
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <input
            type="text"
            placeholder="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></input>
          <input id="form_btn" type="submit" value="ADD"></input>
        </form>
      ) : (
        <form onSubmit={updateItem}>
          <input
            type="text"
            placeholder="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{borderColor: 'red'}}
          ></input>
          <input
            type="text"
            placeholder="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{borderColor: 'red'}}
          ></input>
          <input id="form_btn" type="submit" value="UPDATE" style={{backgroundColor: 'red'}}></input>
        </form>
      )}

      <div className="output">
        <table>
          <thead>
            <tr>
              <th style={{width: '150px'}}>Title</th>
              <th style={{width: '300px'}}>Description</th>
              <th style={{width: '50px'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    className="actionbtn"
                    onClick={async () => {
                      setIsUpdating(true);
                      setUpdateId(item.id);
                      setTitle(item.title);
                      setDescription(item.description);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="black"
                      class="bi bi-pencil-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                    </svg>
                  </button>
                  <button
                    className="actionbtn"
                    onClick={() => deleteItem(item)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="black"
                      className="bi bi-trash-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
