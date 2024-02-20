
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import Flash from "./Flash";
import SearchBar from './SearchBar';
import BoostrapModal from './BoostrapModal';


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
  const [removed_date, setRemoved] = useState<Date | null>();
  const [status, setStatus] = useState("added");
  const [report_method_one, setMethodOne] = useState("");
  const [report_method_two, setMethodTwo] = useState("");
  const [form, setForm] = useState("");
  const [host, setHost] = useState("");
  const [follow_up_date, setFollowUp] = useState<Date | null>();
  const [follow_up_count, setCount] = useState(0);
  const [comments, setComment] = useState("");
  const [forms, setForms] = useState<Form[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [image_url, setImageUrl] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      console.log("File set, now uploading")
      // debugger;
      await handleUpload(selectedFile);
    }
  };

  const handleUpload = async (file: File) => {
    // if (file) {
      console.log("Uploading file...");

      const formData = new FormData();
      formData.append("evidence", file);
      formData.append("key", file.name);

      try {

        const result = await fetch("http://localhost:5000/api/upload_file", {
          method: "POST",
        //   headers: {
        //     "Content-Type": "multipart/form-data",
        // },
          body: formData,
        });

        if (result.status !== 201) {
          Flash("Something went wrong uploading the file. Please try again", "warning");
        } else if (result.status === 201) {
          const url = await result.text();
          console.log("GOT URL: ", url);
          Flash("Successful file upload ✅", "success");
          setImageUrl(url);
        }
      } catch (error) {
        console.error(error);
      }
    // } else {
    //   console.log("Issue in upload")
    // }
  };

  const handleCancel = async (event: React.MouseEvent) => {
    event.preventDefault();
    setUrl("");
    setRemoved(null);
    setMethodOne("N/A");
    setMethodTwo("N/A");
    setForm("");
    setHost("");
    setFollowUp(null);
    setCount(0)
    setComment("");
    setStatus("");
    setImageUrl("");

    setFile(null);
  };

  const resetForm = async (event: React.FormEvent) => {
    event.preventDefault();
    setUrl("");
    setRemoved(null);
    setMethodOne("N/A");
    setMethodTwo("N/A");
    setForm("N/A");
    setHost("N/A");
    setFollowUp(null);
    setCount(0)
    setComment("");
    setStatus("");
    setImageUrl("");

    setFile(null);
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
      comments,
      image_url
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
        Flash(errorMsg, "danger");
      } else {
        Flash("Successfully added the IOC ✅", "success");
        resetForm(event);
      }

      setUrl("");
      setRemoved(null);
      setStatus("");
      setMethodOne("N/A");
      setMethodTwo("N/A");
      setForm("N/A");
      setHost("N/A");
      setFollowUp(null);
      setCount(0)
      setComment("");
      setImageUrl("");

      setFile(null);
    } catch (error) {
      console.log(error);
    }
  };


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
      <div className='p-5 m-3'>
        <div className="my-3 text-center">
          <div className='my-1'>
            <h5>Check to see if the Ioc exists in the database 👇</h5>
          </div>
          <SearchBar />
        </div>
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
              <DatePicker selected={removed_date} onChange={(date: Date) => setRemoved(date)} />
            </div>

            <div className='mb-3'>
              <label htmlFor="status" className='form-label m-1'>Status</label>

              <select name="status" value={status} id="status" className='form-select' onChange={(event) => setStatus(event.target.value)}>
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

              <select name="forms" id="forms" className='form-select' value={form} defaultValue="N/A" onChange={(event) => setForm(event.target.value)}>
                <option value="N/A">N/A</option>
                {forms.map((form) => (
                  <option key={form.id} value={form.name}>{form.name}</option>
                ))}
              </select>

            </div>
            <div className='mb-3'>
              <BoostrapModal name={"form"} fetchForms={fetchForms} fetchHosts={fetchHosts} />
            </div>


            <div className='mb-3'>
              <label htmlFor="host" className='form-label m-1'>Domain Host/Registrar</label>
              <select name="hosts" id="hosts" value={host} className='form-select' onChange={(event) => setHost(event.target.value)}>
                <option value="N/A">N/A</option>
                {hosts.map((host) => (
                  <option key={host.id} value={host.name}>{host.name}</option>
                ))}
              </select>

            </div>
            <div className='mb-3'>
              <BoostrapModal name={"Domain host/Registrar"} fetchForms={fetchForms} fetchHosts={fetchHosts} />
            </div>

            <div className='mb-3'>
              <label htmlFor="DatePicker" className='m-1'>Follow up date</label>
              <DatePicker selected={follow_up_date} onChange={(date: Date) => setFollowUp(date)} />
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

            <input type="hidden" name="image_url" value={image_url} />

            <div className="d-flex justify-content-center">
              <button type="submit" className='btn btn-primary m-1'>Save</button>
              <button onClick={handleCancel} className='btn btn-secondary m-1'>Reset Changes</button>
            </div>

          </form>

          <div>
            <label htmlFor="file" className="sr-only">
              Attach an image:
            </label>
            <input id="file" className="form-control" type="file" name="evidence" onChange={handleFileChange} placeholder={file !== null ? file.name : ""}/>
          </div>
          {file && (
            <section>
              File details:
              <ul>
                <li>Name: {file.name}</li>
                <li>Type: {file.type}</li>
                <li>Size: {file.size} bytes</li>
              </ul>
            </section>
          )}

        </div>
      </div>
    </>
  )
}

export default Landing;
