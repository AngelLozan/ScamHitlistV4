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
  const [url, setUrl] = useState(theIoc ? theIoc.url : "");
  const [removed_date, setRemoved] = useState<Date | null>(null);
  const [status, setStatus] = useState("");
  const [report_method_one, setMethodOne] = useState(theIoc ? theIoc.report_method_one : "");
  const [report_method_two, setMethodTwo] = useState(theIoc ? theIoc.report_method_two : "");
  const [form, setForm] = useState("");
  const [host, setHost] = useState("");
  const [follow_up_date, setFollowUp] = useState<Date | null>(null);
  const [follow_up_count, setCount] = useState(theIoc ? theIoc.follow_up_count : 0);
  const [comments, setComment] = useState(theIoc ? theIoc.comments : "");
  const [forms, setForms] = useState<Form[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [formattedRD, setFormattedRD] = useState(new Date('2022-01-01T00:00:00.000Z'));
  const [formattedFD, setFormattedFD] = useState(new Date());


  const handleCancel = async (event: React.MouseEvent) => {
    event.preventDefault();
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

    const bodyJson = JSON.stringify({
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
    });

    console.log("Body json: ", bodyJson);

    try {
      let res = await fetch(`http://localhost:5000/api/iocs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyJson,
      })

      if (!res.ok) {
        const errorMsg = await res.text();
        displayFlashMessage(errorMsg);
      }

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
      console.log("Fetch ioc: ", ioc);
      setTheIoc(ioc);
      setUrl(ioc.url);
      setRemoved(Object.is(ioc.removed_date,null) ? new Date('2022-01-01T00:00:00.000Z') : ioc.removed_date );
      setMethodOne(ioc.report_method_one);
      setMethodTwo(ioc.report_method_two);
      setForm(ioc.form);
      setHost(ioc.host);
      setFollowUp(ioc.follow_up_date);
      setCount(ioc.follow_up_count)
      setComment(ioc.comments);
      setStatus(ioc.status);
      console.log("Status: ", ioc.status);

      const formatRD = new Date(Object.is(ioc.removed_date,null) ? new Date('2022-01-01T00:00:00.000Z') : ioc.removed_date);

      setFormattedRD(formatRD);
      const formatFD = new Date(Object.is(ioc.follow_up_date,null) ? new Date() : ioc.follow_up_date);
      setFormattedFD(formatFD);
    } catch (error) {
      console.log(error);
    }
  }

  const displayFlashMessage = (message: string) => {
    const flashElement = document.createElement("div");
    flashElement.className = `alert alert-info alert-dismissible fade show m-1 position-fixed top-0 end-0`;
    flashElement.role = "alert";
    flashElement.textContent = `👀 ${message}`;

    const button = document.createElement("button");
    button.className = "btn-close";
    button.setAttribute("data-bs-dismiss", "alert");

    button.addEventListener("click", () => {
      flashElement.remove();
    });

    flashElement.appendChild(button);
    document.body.appendChild(flashElement);

    setTimeout(() => {
      flashElement.remove();
    }, 5000);
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
              type="text"
              value={url}
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
              value={report_method_one}
              onChange={(event) => setMethodOne(event.target.value)}
              className='form-control'
            // required
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
            <DatePicker selected={theIoc ? formattedFD : follow_up_date} onChange={(d) => setFollowUp(d)} />
          </div>

          <div className='mb-3'>
            <label htmlFor="count" className='form-label m-1'>Follow up count</label>
            <input
              id="count"
              type="text"
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
            <button onClick={handleCancel} className='btn btn-secondary m-1'>Reset Changes</button>
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
