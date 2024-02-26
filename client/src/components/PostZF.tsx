import React from 'react';
import Flash from './Flash';

const PostZF = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault();
  let url = e.currentTarget.getAttribute('data-url')?.trim();

  if (url) {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(url) || url.startsWith('http')) {
      url = url
    } else {
      url = `http://${url}`;
    }
  }

  const csrfToken = () => {
    const csrfMetaTag = document.querySelector("meta[name='csrf-token']") as HTMLMetaElement;
    return csrfMetaTag ? csrfMetaTag.content : "";
  }


  // const id = e.currentTarget.getAttribute('data-id');
  // const alertDesignation = e.currentTarget.getAttribute('data-custom-id');
  let type = 'url';
  let violation = 'phishing';


  // if (alertDesignation === "email") {
  //   type = 'email';
  //   violation = 'phishing';
  // } else {
  //   type = 'url';
  //   violation = alertDesignation;
  // }


  try {
    // let res = await fetch(`/zf/${id}`, {
    let res = await fetch('http://localhost:5000/api/zf', {
      method: 'GET',
      headers: { "Content-Type": "application/json", "Accept": "application/json", "X-CSRF-Token": `${csrfToken}` },
      body: JSON.stringify({ "source": `${url}`, "alert_type": `${type}`, "violation": `${violation}`, "entity_id": "1194610", "request_takedown": false, "notes": "For review" })
    })

    let data = await res.text();

    if (res.status === 201) {
      console.log(data);
      Flash('Successfully submitted IOC to ZeroFox ✅', 'success');
    } else {
      console.error("Request failed with status:", res.status);
      Flash(`${data}`, "warning");
    }

  } catch (error: any) {
    console.log(error.message);
    Flash(`Something went wrong : ${error.message}`, 'warning');
  }
}

export default PostZF;
