import React, { useState, useEffect } from 'react';
import BoostrapModal from './BoostrapModal';
import Flash from './Flash';
import DataTable, { Row } from "./DataTable";


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

const Settings = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [formId, setFormId] = useState<number | null>(null);
  const [hostId, setHostId] = useState<number | null>(null);
  const [rows, setIocs] = useState<Row[]>([]);
  const [q, setQuery] = useState('');

  const handleDeleteForm = async (event: React.FormEvent, id: number) => {
    event.preventDefault();
    console.log(id);
    if (id === 0) {
      Flash("Please select a form", "info");
      return;
    }
    if (window.confirm('Are you sure you wish to delete this form?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/forms/${id}`, {
          method: "DELETE"
        })
        if (res.status === 204) {
          Flash("Successfully deleted", "success");
          setFormId(null);
          await fetchForms();
          await fetchHosts();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }


  const handleDeleteHost = async (event: React.FormEvent, id: number) => {
    event.preventDefault();
    console.log(id);
    if (id === 0) {
      Flash("Please select a form", "info");
      return;
    }
    if (window.confirm('Are you sure you wish to delete this item?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/hosts/${id}`, {
          method: "DELETE"
        })
        if (res.status === 204) {
          Flash("Successfully deleted", "success");
          setHostId(null);
          await fetchForms();
          await fetchHosts();
        }
      } catch (error) {
        console.log(error);
      }
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

  const fetchIocs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/iocs/official_urls");
      const rows = await response.json();
      setIocs(rows);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchIocs();
    fetchForms();
    fetchHosts();
  }, []);

  return (
    <div className="p3 m-3">
      <h1 className="text-center">Settings</h1>
      <div className="row m-3 p-1">
        <div className="col">
          <h5>Select to delete a Form</h5>
          <form
            className="form"
            onSubmit={(event) => typeof (formId) === "number" ? handleDeleteForm(event, formId) : false}
          >
            <div className='mb-3'>

              <select name="forms" id="forms" className='form-select' onChange={(event) => setFormId(parseInt(event.target.value))}>
                <option value={0}></option>
                {forms.map((form) => (
                  <option key={form.id} value={form.id}>{form.name}: {form.url}</option>
                ))}
              </select>

            </div>
            <div className='mb-3'>
              <button type="submit" className='btn btn-danger'>Delete</button>
            </div>
          </form>
          <div className='mb-3'>
            <BoostrapModal name={"form"} fetchForms={fetchForms} fetchHosts={fetchHosts} />
          </div>

        </div>

        <div className="col">
          <h5>Select to delete a Domain Host/Registrar</h5>
          <form
            className="host"
            onSubmit={(event) => typeof (hostId) === "number" ? handleDeleteHost(event, hostId) : false}
          >
            <div className='mb-3'>
              <select name="hosts" id="hosts" className='form-select' onChange={(event) => setHostId(parseInt(event.target.value))}>
                <option value={0}></option>
                {hosts.map((host) => (
                  <option key={host.id} value={host.id}>{host.name}: {host.email}</option>
                ))}
              </select>

            </div>
            <div className='mb-3'>
              <button type="submit" className='btn btn-danger'>Delete</button>
            </div>

          </form>
          <div className='mb-3'>
            <BoostrapModal name={"Domain host/Registrar"} fetchForms={fetchForms} fetchHosts={fetchHosts} />
          </div>

        </div>
      </div>
      <div className='row'>
        {rows.length === 0 ?
          <h1 className="m-3 text-center">Loading... 🕐</h1>
          :
          <div className="p3 m-3">
            <h1 className="text-center m-3"><a style={{ textDecoration: 'none' }} href="/settings">Exodus Official Urls</a></h1>
            <DataTable rows={rows} q={q} setQuery={setQuery} />
          </div>
        }
      </div>
    </div >
  );
};

export default Settings;
