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
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
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
    <form
      className="ioc-form"
      onSubmit={(event) => handleUpdateNote(event)}
    >
      <input
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="Url"
        required
      ></input>
      <div>
        <label htmlFor="DatePicker">Resolved date</label>
        <DatePicker selected={removed_date} onChange={(date) => setRemoved(date)} />
      </div>
      <input
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        placeholder="Status"
        required
      ></input>
      <input
        value={report_method_one}
        onChange={(event) => setMethodOne(event.target.value)}
        placeholder="Report method one"
        required
      ></input>
      <input
        value={report_method_two}
        onChange={(event) => setMethodTwo(event.target.value)}
        placeholder="Report method two"
      ></input>
      <input
        value={form}
        onChange={(event) => setForm(event.target.value)}
        placeholder="Form used"
      ></input>
      <input
        value={host}
        onChange={(event) => setHost(event.target.value)}
        placeholder="Host"
      ></input>
      <div>
        <label htmlFor="DatePicker">Follow up date</label>
        <DatePicker selected={follow_up_date} onChange={(d) => setFollowUp(d)} />
      </div>
      <input
        value={follow_up_count}
        onChange={(event) => setCount(parseInt(event.target.value))}
        placeholder="Follow up attempts"
      ></input>
      <input
        value={comments}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Comments"
      ></input>


      <div className="edit-buttons">
        <button type="submit" className='btn btn-primary'>Save</button>
        <button onClick={handleCancel} className='btn btn-info'>Clear Form</button>
      </div>

    </form>
  )
}

export default EditIoc;
