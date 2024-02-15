import { debug } from 'console';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'

// enum Status {
//   added = 0,
//   reported,
//   resolved,
//   official_url,
//   watchlist
// }

type Ioc = {
  id: number;
  url: string;
  created_at: Date;
  updated_at: Date;
  removed_date: Date;
  status: string;
  report_method_one: string;
  report_method_two: string;
  form: string;
  host: string;
  follow_up_date: Date;
  follow_up_count: number;
  comments: string;
}

type Form = {
  id: number;
  name: string;
  url: string;
}

type Host = {
  id: number;
  name: string;
  email: string;
}

interface EditIocProps {
  id: number;
}

const EditIoc: React.FC<EditIocProps> = ({ id }) => {
  const [theIoc, setTheIoc] = useState<Ioc>()
  const [url, setUrl] = useState("");
  const [removed_date, setRemoved] = useState<Date | null>(null);
  const [status, setStatus] = useState("");
  const [report_method_one, setMethodOne] = useState("");
  const [report_method_two, setMethodTwo] = useState("");
  const [form, setForm] = useState("");
  const [host, setHost] = useState("");
  const [follow_up_date, setFollowUp] = useState<Date | null>(null);
  const [follow_up_count, setCount] = useState(0);
  const [comments, setComment] = useState("");
  const [forms, setForms] = useState<Form[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [formattedRD, setFormattedRD] = useState(new Date('2022-01-01T00:00:00.000Z'));
  const [formattedFD, setFormattedFD] = useState(new Date());


  const handleCancel = async () => {
    console.log("THE IOC: ", theIoc);
    setUrl(theIoc ? theIoc.url : "");
    setRemoved(theIoc ? new Date(theIoc.removed_date) : removed_date);
    setMethodOne(theIoc ? theIoc.report_method_one : report_method_one);
    setMethodTwo(theIoc ? theIoc.report_method_two : report_method_two);
    setForm(theIoc ? theIoc.form : form);
    setHost(theIoc ? theIoc.host : host);
    setFollowUp(theIoc ? new Date(theIoc.follow_up_date) : follow_up_date);
    setCount(theIoc ? theIoc.follow_up_count : follow_up_count)
    setComment(theIoc ? theIoc.comments : comments);
    setStatus(theIoc ? theIoc.status : status);
    // setUrl("");
    // setRemoved(null);
    // setStatus(ioc ? ioc.status : Status.added );
    // setMethodOne("");
    // setMethodTwo("");
    // setForm("");
    // setHost("");
    // setFollowUp(null);
    // setCount(0)
    // setComment("");
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
          status,
          report_method_one,
          report_method_two,
          form,
          host,
          follow_up_date,
          follow_up_count,
          comments
        }),
      })
      // if (condition) {

      // } else {

      // }
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

  const fetchIoc = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/iocs/${id}`);
      const ioc: Ioc = await response.json();
      console.log(ioc);
      setTheIoc(ioc);
      if (theIoc) {
        setUrl(theIoc.url);
        setRemoved(theIoc.removed_date);
        // setStatus(theIoc ? theIoc.status : Status.added );
        setMethodOne(theIoc.report_method_one);
        setMethodTwo(theIoc.report_method_two);
        setForm(theIoc.form);
        setHost(theIoc.host);
        setFollowUp(theIoc.follow_up_date);
        setCount(theIoc.follow_up_count)
        setComment(theIoc.comments);
        setStatus(theIoc.status);
        console.log("Status: ", theIoc.status);

        const formatRD = new Date(theIoc.removed_date);

        setFormattedRD(formatRD);
        const formatFD = new Date(theIoc.follow_up_date);
        setFormattedFD(formatFD);
      }


    } catch (error) {
      console.log(error);
    }
  }

  const fetchForms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/forms");
      const forms: Form[] = await response.json();
      setForms(forms);
    } catch (error) {
      console.log(error);
    }
  };


  const fetchHosts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/hosts");
      const hosts: Host[] = await response.json();
      setHosts(hosts);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {

    fetchIoc();
    fetchForms();
    fetchHosts();
  }, []);

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
              value={theIoc ? theIoc.url : url}
              onChange={(event) => setUrl(event.target.value)}
            // required
            ></input>
          </div>

          <div className='mb-3'>
            <label htmlFor="DatePicker" className="m-1">Resolved date</label>
            <DatePicker selected={theIoc ? formattedRD : removed_date} onChange={(date) => setRemoved(date)} />
          </div>

          <div className='mb-3'>
            <label htmlFor="status" className='form-label m-1'>Status</label>

            <select name="status" id="status" className='form-select' onChange={(event) => setStatus(event.target.value)}>
              {theIoc && theIoc.status === "added" ? <option value={"added"} selected>Added</option> : <option value={"added"} >Added</option>}
              {theIoc && theIoc.status === "reported" ? <option value={"reported"} selected>Reported</option> : <option value={"reported"} >Reported</option>}
              {theIoc && theIoc.status === "resolved" ? <option value={"resolved"} selected>Resolved</option> : <option value={"resolved"} >Resolved</option>}
              {theIoc && theIoc.status === "official_url" ? <option value={"official_url"} selected>Our Url</option> : <option value={"official_url"} >Our Url</option>}
              {theIoc && theIoc.status === "watchlist" ? <option value={"watchlist"} selected>Watchlist</option> : <option value={"watchlist"} >Watchlist</option>}

            </select>

          </div>

          <div className='mb-3'>
            <label htmlFor="method1" className='form-label m-1'>Report Method 1</label>
            <input
              id="method1"
              value={theIoc ? theIoc.report_method_one : report_method_one}
              onChange={(event) => setMethodOne(event.target.value)}
              className='form-control'
            // required
            ></input>
          </div>

          <div className='mb-3'>
            <label htmlFor="method2" className='form-label m-1'>Report Method 2</label>
            <input
              id="method2"
              value={theIoc ? theIoc.report_method_two : report_method_two}
              onChange={(event) => setMethodTwo(event.target.value)}
              className='form-control'
            ></input>
          </div>

          <div className='mb-3'>
            <label htmlFor="form" className='form-label m-1'>Form used</label>

            <select name="forms" id="forms" className='form-select' defaultValue="N/A" onChange={(event) => setForm(event.target.value)}>
              {forms.map((form) => (
                <option key={form.id} value={form.name}>{form.name}</option>
              ))}
            </select>

            {/* <input
              id='form'
              value={form}
              onChange={(event) => setForm(event.target.value)}
              className='form-control'
            ></input> */}
          </div>

          <div className='mb-3'>
            <label htmlFor="host" className='form-label m-1'>Domain Host/Registrar</label>
            <select name="hosts" id="hosts" className='form-select' onChange={(event) => setHost(event.target.value)}>
              {hosts.map((host) => (
                <option key={host.id} value={host.name}>{host.name}</option>
              ))}
            </select>

            {/* <input
              id="host"
              value={host}
              onChange={(event) => setHost(event.target.value)}
              className='form-control'
            ></input> */}
          </div>

          <div className='mb-3'>
            <label htmlFor="DatePicker" className='m-1'>Follow up date</label>
            <DatePicker selected={theIoc? formattedFD : follow_up_date } onChange={(d) => setFollowUp(d)} />
          </div>

          <div className='mb-3'>
            <label htmlFor="count" className='form-label m-1'>Follow up count</label>
            <input
              id="count"
              type="text"
              value={theIoc? theIoc.follow_up_count: follow_up_count }
              onChange={(event) => setCount(parseInt(event.target.value))}
              className='form-control'
            ></input>
          </div>

          <div className='mb-3'>
            <label htmlFor="comments" className='form-label m-1'>Comments</label>
            <input
              id="comments"
              value={theIoc? theIoc.comments : comments}
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

//defaultValue={ioc? ioc.status : status }
