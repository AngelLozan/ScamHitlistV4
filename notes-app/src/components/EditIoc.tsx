import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'

enum Status {
  added = 0,
  reported,
  resolved,
  official_url,
  watchlist
}

// type Ioc = {
//   id: number;
//   url: string;
//   created_at: Date;
//   updated_at: Date;
//   removed_date: Date;
//   status: Status;
//   report_method_one: string;
//   report_method_two: string;
//   form: string;
//   host: string;
//   follow_up_date: Date;
//   follow_up_count: number;
//   comments: string;
// }

interface EditIocProps {
  id: number;
}

const EditIoc: React.FC<EditIocProps> = ({ id }) => {
  const [url, setUrl] = useState("");
  const [removed_date, setRemoved] = useState<Date | null>(null);
  const [status, setStatus] = useState("added");
  const [report_method_one, setMethodOne] = useState("");
  const [report_method_two, setMethodTwo] = useState("");
  const [form, setForm] = useState("");
  const [host, setHost] = useState("");
  const [follow_up_date, setFollowUp] = useState<Date | null>(null);
  const [follow_up_count, setCount] = useState(0);
  const [comments, setComment] = useState("");

  const handleCancel = () => {
    setUrl("");
    setRemoved(null);
    setStatus("added");
    setMethodOne("");
    setMethodTwo("");
    setForm("");
    setHost("");
    setFollowUp(null);
    setCount(0)
    setComment("");
  };

  const deleteIoc = async (event: React.MouseEvent, id: number) => {
    event.stopPropagation();
    const res = await fetch(`http://localhost:5000/api/iocs/${id}`, {
      method: "DELETE"
    })
    if (res.status === 204) {
      window.location.href = "http://localhost:3000/all";
    }
    // const updated = notes.filter((note) => note.id !== noteId);
    // setNotes(updatedNotes);
  };


  const handleUpdateIoc = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await fetch(`http://localhost:5000/api/iocs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          url,
          removed_date,
          status: Status,
          report_method_one,
          report_method_two,
          form,
          host,
          follow_up_date,
          follow_up_count,
          comments,
        }),
      })
      // const updatedIoc = await res.json();
      // const updatedNotesList = notes.map((note: Note) => (note.id === selectedNote.id ? updatedNote : note));

      setUrl(url);
      setRemoved(removed_date);
      setStatus(status);
      setMethodOne(report_method_one);
      setMethodTwo(report_method_two);
      setForm(form);
      setHost(host);
      setFollowUp(follow_up_date);
      setCount(follow_up_count)
      setComment(comments);
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <div className='m-3'>
        <form
          className="ioc-form"
          onSubmit={(event) => handleUpdateIoc(event)}
        >
          <div className='mb-3'>
            <label htmlFor="url" className='form-label m-1'>Url</label>
            <input
              className='form-control'
              id="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
            ></input>
          </div>

          <div className='mb-3'>
            <label htmlFor="DatePicker" className="m-1">Resolved date</label>
            <DatePicker selected={removed_date} onChange={(date) => setRemoved(date)} />
          </div>

          <div className='mb-3'>
            <label htmlFor="status" className='form-label m-1'>Status</label>
            <input
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className='form-control'
              required
            ></input>
          </div>

          <div className='mb-3'>
            <label htmlFor="method1" className='form-label m-1'>Report Method 1</label>
            <input
              id="method1"
              value={report_method_one}
              onChange={(event) => setMethodOne(event.target.value)}
              className='form-control'
              required
            ></input>
          </div>

          <div className='mb-3'>
            <label htmlFor="method2" className='form-label m-1'>Report Method 2</label>
            <input
              id="method2"
              value={report_method_two}
              onChange={(event) => setMethodTwo(event.target.value)}
              className='form-control'
            ></input>
          </div>

          <div className='mb-3'>
            <label htmlFor="form" className='form-label m-1'>Form used</label>
            <input
              id='form'
              value={form}
              onChange={(event) => setForm(event.target.value)}
              className='form-control'
            ></input>
          </div>

          <div className='mb-3'>
            <label htmlFor="host" className='form-label m-1'>Domain Host/Registrar</label>
            <input
              id="host"
              value={host}
              onChange={(event) => setHost(event.target.value)}
              className='form-control'
            ></input>
          </div>

          <div className='mb-3'>
            <label htmlFor="DatePicker" className='m-1'>Follow up date</label>
            <DatePicker selected={follow_up_date} onChange={(d) => setFollowUp(d)} />
          </div>

          <div className='mb-3'>
            <label htmlFor="count" className='form-label m-1'>Follow up count</label>
            <input
              id="count"
              value={follow_up_count}
              onChange={(event) => setCount(parseInt(event.target.value))}
              className='form-control'
            ></input>
          </div>

          <div className='mb-3'>
            <label htmlFor="comments" className='form-label m-1'>Comments</label>
            <input
              id="comments"
              value={comments}
              onChange={(event) => setComment(event.target.value)}
              className='form-control'
            ></input>
          </div>


          <div className="d-flex justify-content-center">
            <button type="submit" className='btn btn-primary m-1'>Save</button>
            <button onClick={handleCancel} className='btn btn-info m-1'>Clear Form</button>
          </div>

        </form>
        <div className="d-flex justify-content-center">
          <button onClick={(event) => { if (window.confirm('Are you sure you wish to delete this item?')) deleteIoc(event, id) }} className="btn btn-danger m-1">Delete</button>
        </div>
      </div>
    </>
  )
}

export default EditIoc;
