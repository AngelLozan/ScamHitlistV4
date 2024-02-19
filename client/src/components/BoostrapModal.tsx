import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Flash from './Flash';


interface BoostrapModalProps {
  name: string;
  fetchForms: () => Promise<void>; // @dev form or host
  fetchHosts: () => Promise<void>; // @dev form or host
}

const BoostrapModal: React.FC<BoostrapModalProps> = ({ name, fetchForms, fetchHosts }) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const createEvent = async (event: React.FormEvent) => {
    // event.stopPropagation();
    event.preventDefault();
    // debugger;
    if (name === "form") {
      // let bddy = JSON.stringify({
      //   url: link,
      //   name: title,
      // });
      // console.log(bddy);
      try {
        let res = await fetch('http://localhost:5000/api/forms', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: link,
            name: title,
          }),
        })

        if (!res.ok) {
          const errorMsg = await res.text();
          handleClose();
          Flash(errorMsg, "danger");
        } else {
          Flash("Successfully added the Form ✅", "success");
          handleClose();
          fetchForms();
        }
      } catch (error) {
        console.log(error);
        handleClose();
        Flash(`${error}`, "warning");

      }
    } else {
      try {
        let res = await fetch('http://localhost:5000/api/hosts', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: link,
            name: title,
          }),
        })

        if (!res.ok) {
          const errorMsg = await res.text();
          handleClose();
          Flash(errorMsg, "danger");
        } else {
          Flash("Successfully added the Domain Host/Registrar ✅", "success");
          handleClose();
          fetchHosts();
        }
      } catch (error) {
        console.log(error);
        handleClose();
        Flash(`${error}`, "warning");

      }
    }
  };



  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        ➕ Add list item
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a {name} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='m-3'>
            <form
              onSubmit={(event) => createEvent(event)}
            >
              <div className='mb-3'>
                <label htmlFor="title" className='form-label m-1'>Name/Title/Label</label>
                <input
                  className='form-control'
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                ></input>
              </div>
              {name === "form" ?

                <div className='mb-3'>
                  <label htmlFor="link" className='form-label m-1'>Url</label>
                  <input
                    className='form-control'
                    id="link"
                    type="text"
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                  ></input>
                </div>
                :
                <div className='mb-3'>
                  <label htmlFor="link" className='form-label m-1'>Email</label>
                  <input
                    className='form-control'
                    id="link"
                    type="text"
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                  ></input>
                </div>
              }
              <div className="d-flex justify-content-center">
                <button type="submit" className='btn btn-primary m-1'>Save</button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default BoostrapModal;
