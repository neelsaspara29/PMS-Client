import React, { useState } from "react";
import { ApiGet, ApiPostNoAuth } from "../Utils/ApiData";
import toast from "react-hot-toast";
import { Accordion, Button } from "react-bootstrap";
import moementTz from "moment-timezone";

const PatientPage = () => {
  const [email, setEmail] = useState("");
  const [data, setData] = useState<any>(null);
  const [reports, setReports] = useState<any>([]);

  const getUserDetail = () => {
    ApiPostNoAuth("/user/public/detail", { email })
      .then((response: any) => {
        if (response?.data?.success) {
          setData(response?.data?.data);
          getPatientReports(response?.data?.data?.id);
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error: any) => {
        toast.error(error?.message);
      });
  };

  const getPatientReports = (id: any) => {
    ApiGet(`/report/publish/${id}`)
      .then((response: any) => {
        if (response?.data?.success) {
          console.log(response?.data, "=> patient report data");
          setReports(response?.data?.data);
          // toast.success(response?.data?.message)
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  };
  return (
    <>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button onClick={getUserDetail}>submit</Button>
{data?.id && 
<>
<div className="p-2">
        <div className="d-flex justify-content-between">
          <h1>Patient Detail</h1>
        </div>
      </div>

      <div>
        <p>
          <span>Name : </span> {data?.name}
        </p>
        <p>
          <span>Bob : </span>{" "}
          {moementTz(data?.dob).tz("PST").format("MM-DD-YYYY")}
        </p>
        <p>
          <span>Email : </span> {data?.email}
        </p>
        <p>
          <span>Mobile Number : </span> {data?.mobile_number}
        </p>
        <p>
          <span>Gender : </span> {data?.gender}
        </p>
      </div>

      <Accordion>
        {reports?.map((item: any, index: string) => {
          return (
            <Accordion.Item eventKey={index}>
              <Accordion.Header>
                {item?.report_type} :{" "}
                {moementTz(item?.report_date).tz("PST").format("MM-DD-YYYY")}
              </Accordion.Header>
              <Accordion.Body>
                <div>{item?.description}</div>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion></>
}
     
    </>
  );
};

export default PatientPage;
