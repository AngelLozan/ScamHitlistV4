// import { debug } from 'console';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'


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


const Landing = () => {
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



  const handleCancel = async (event: React.MouseEvent) => {
    event.preventDefault();
    setUrl("");
    setRemoved(removed_date);
    setMethodOne("N/A");
    setMethodTwo("N/A");
    setForm("");
    setHost("");
    setFollowUp(follow_up_date);
    setCount(0)
    setComment("");
    setStatus("");
  };


  const handleAddIoc = async (event: React.FormEvent) => {
    event.preventDefault();

    const bodyJson = JSON.stringify({
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
      let res = await fetch('http://localhost:5000/api/iocs', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyJson,
      })

      if (!res.ok) {
        const errorMsg = await res.text();
        displayFlashMessage(errorMsg);
      } else {
        displayFlashMessage("Successfully updated the IOC ✅");
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

  const displayFlashMessage = (message: string) => {
    const flashElement = document.createElement("div");
    flashElement.className = `alert alert-info alert-dismissible fade show m-1 position-fixed top-0 end-0`;
    flashElement.role = "alert";
    flashElement.textContent = `${message}`;

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
    fetchForms();
    fetchHosts();
  }, []);

  return (
    <>
      <div className='text-center m-3'>
        <h1>Add an Ioc</h1>
      </div>
      <div className='m-3'>
        <form
          className="ioc-form"
          onSubmit={(event) => handleAddIoc(event)}
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
            <DatePicker onChange={(date) => setRemoved(date)} />
          </div>

          <div className='mb-3'>
            <label htmlFor="status" className='form-label m-1'>Status</label>

            <select name="status" id="status" className='form-select' onChange={(event) => setStatus(event.target.value)}>
              <option value={"added"} >Added</option>
              <option value={"reported"} >Reported</option>
              <option value={"resolved"} >Resolved</option>
              <option value={"official_url"} >Our Url</option>
              <option value={"watchlist"} >Watchlist</option>

            </select>

          </div>

          <div className='mb-3'>
            <label htmlFor="method1" className='form-label m-1'>Report Method 1</label>
            <select name="method1" id="method1" className='form-select' value={report_method_one} onChange={(e) => setMethodOne(e.target.value)}>
              <option selected value={""}>N/A</option>
              <option value={'Full Website Process'}>Full Website Process</option>
              <option value={"Profile Report"}>Profile Report (social sites)</option>
              <option value={"Registrar/Domain Host Email"}>Registrar/Domain Host Email</option>
              <option value={"Telegram"}>Telegram</option>
              <option value={"Via Host Site"}>Via Host Site (blog, apk, ect.)</option>
              <option value={"Site Specific Form"}>Site Specific Form</option>
              <option value={"Follow Up Email"}>Follow Up Email</option>
            </select>
            {/* <input
              id="method1"
              value={report_method_one}
              onChange={(event) => setMethodOne(event.target.value)}
              className='form-control'
            // required
            ></input> */}
          </div>

          <div className='mb-3'>
            <label htmlFor="method2" className='form-label m-1'>Report Method 2</label>
            <select name="method2" id="method2" className='form-select' value={report_method_two} onChange={(e) => setMethodTwo(e.target.value)}>
              <option selected value={""}>N/A</option>
              <option value={'Full Website Process'}>Full Website Process</option>
              <option value={"Profile Report"}>Profile Report (social sites)</option>
              <option value={"Registrar/Domain Host Email"}>Registrar/Domain Host Email</option>
              <option value={"Telegram"}>Telegram</option>
              <option value={"Via Host Site"}>Via Host Site (blog, apk, ect.)</option>
              <option value={"Site Specific Form"}>Site Specific Form</option>
              <option value={"Follow Up Email"}>Follow Up Email</option>
            </select>
            {/* <input
              id="method2"
              value={report_method_two}
              onChange={(event) => setMethodTwo(event.target.value)}
              className='form-control'
            ></input> */}
          </div>

          <div className='mb-3'>
            <label htmlFor="form" className='form-label m-1'>Form used</label>

            <select name="forms" id="forms" className='form-select' defaultValue="N/A" onChange={(event) => setForm(event.target.value)}>
              <option value="N/A">N/A</option>
              {forms.map((form) => (
                <option key={form.id} value={form.name}>{form.name}</option>
              ))}
            </select>

          </div>

          <div className='mb-3'>
            <label htmlFor="host" className='form-label m-1'>Domain Host/Registrar</label>
            <select name="hosts" id="hosts" className='form-select' onChange={(event) => setHost(event.target.value)}>
              <option value="N/A">N/A</option>
              {hosts.map((host) => (
                <option key={host.id} value={host.name}>{host.name}</option>
              ))}
            </select>

          </div>

          <div className='mb-3'>
            <label htmlFor="DatePicker" className='m-1'>Follow up date</label>
            <DatePicker onChange={(d) => setFollowUp(d)} />
          </div>

          <div className='mb-3'>
            <label htmlFor="count" className='form-label m-1'>Follow up count</label>
            <input
              id="count"
              type="number"
              value={follow_up_count}
              onChange={(event) => {
                const value = parseInt(event.target.value);
                if (!isNaN(value)) { // Check if the entered value is a valid number
                  setCount(value);
                }
                setCount(parseInt(event.target.value))
              }}
              className='form-control'
            ></input>
          </div>

          <div className='mb-3'>
            <label htmlFor="comments" className='form-label m-1'>Comments</label>
            <textarea
              id="comments"
              style={{ minHeight: '100px' }}
              value={comments}
              onChange={(event) => setComment(event.target.value)}
              className='form-control'
            />
          </div>


          <div className="d-flex justify-content-center">
            <button type="submit" className='btn btn-primary m-1'>Save</button>
            <button onClick={handleCancel} className='btn btn-secondary m-1'>Reset Changes</button>
          </div>

        </form>

      </div>
    </>
  )
}

export default Landing;
