import React, { useEffect, useState } from "react";
import EditIoc from "./EditIoc";
import PostZF from './PostZF';

enum Status {
  added = 0,
  reported,
  resolved,
  official_url,
  watchlist
}

type Ioc = {
  id: number;
  url: string;
  created_at: Date;
  updated_at: Date;
  removed_date: Date;
  status: Status;
  report_method_one: string;
  report_method_two: string;
  form: string;
  host: string;
  follow_up_date: Date;
  follow_up_count: number;
  comments: string;
  image_url: string;
}

interface ShowIocProps {
  id: number;
}


const ShowIoc: React.FC<ShowIocProps> = ({ id }) => {
  const [Ioc, setIoc] = useState<Ioc | null>(null);

  const fetchIoc = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/iocs/${id}`);
      const Ioc = await response.json();
      setIoc(Ioc);
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {

    fetchIoc();
  }, [Ioc]);

  return (
    <div className="p3 m-3">
      {Ioc ? (
        <>
          <div className="text-center">
            <h3>Ioc: {Ioc.id}</h3>
            <p>{Ioc.url}</p>
            <p>Reported: {Ioc.created_at.toLocaleString().split("T", 1)[0]}</p>
            <p>Status: {Ioc.status}</p>
            <p>Comments: {Ioc.comments}</p>
            <p>Report Method 1: {Ioc.report_method_one}</p>
            {Ioc.image_url !== null ? <img src={Ioc.image_url} className="img-thumbnail" alt="Evidence file" /> : false }
            <button className="btn btn-primary m-3" data-url={Ioc.url} onClick={PostZF}>Submit to ZeroFox</button>
          </div>

          <hr />
          <div className="m-3">
            <h3 className="text-center">Edit Ioc:</h3>
            <p className="text-center">Changes only apply after you save them.</p>
            < EditIoc id={Ioc.id} />
          </div>
        </>
      ) : (
        <p>Something went wrong, please refresh the page.</p>
      )
      }
    </div>
  );
};

export default ShowIoc;
