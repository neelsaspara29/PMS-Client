import React, { useEffect, useState } from "react";
import { Accordion, Badge, Button, Modal } from "react-bootstrap";
import { ApiGet, ApiPost } from "../Utils/ApiData";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Form as BForm } from "react-bootstrap";
import * as yup from "yup";
import moementTz from "moment-timezone";

const MyInput = ({ field, form, ...props }: any) => {
  return <BForm.Control {...field} {...props} />;
};

const BADGE_COLOR: any = {
  publish: "success",
  draft: "secondary",
};

type TInitialState = {
  report_type: string;
  description: string;
  active_status: string;
};

const initialValue: TInitialState = {
  report_type: "",
  description: "",
  active_status: "",
};

const reportSchema = yup.object({
  report_type: yup.string().required(),
  description: yup.string().required(),
  active_status: yup.string().required(),
});

const PatientDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [reports, setReports] = useState<any>([]);
  const [show, setShow] = useState<boolean>(false);
  const [initialState, setInitialState] = useState<TInitialState>(initialValue);
  const [editId, setEditId] = useState<string>("");

  const getPatientDetail = () => {
    ApiGet(`/patient/get/detail/${id}`)
      .then((response: any) => {
        if (response?.data?.success) {
          console.log(response?.data, "=> patient data");
          setData(response?.data?.data);
          // toast.success(response?.data?.message)
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  };

  const getPatientReports = () => {
    ApiGet(`/report/${id}`)
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

  const handleAddReport = (value: any) => {
    const body = { ...value, patientId: id };
    ApiPost("/patient/report/add", body)
      .then((response: any) => {
        if (response?.data?.success) {
          handleClose();
          toast.success(response?.data?.message);
          getPatientReports();
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error: any) => {
        toast.error(error?.message);
      });
  };

  const handleEditReport = (value: any) => {
    const body = { ...value, id: editId };
    ApiPost("/patient/report/edit", body)
      .then((response: any) => {
        if (response?.data?.success) {
          handleClose();
          toast.success(response?.data?.message);
          getPatientReports();
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error: any) => {
        toast.error(error?.message);
      });
  };

  const handleClose = () => {
    setShow(false);
    setEditId("");
    setInitialState(initialValue);
  };

  useEffect(() => {
    getPatientDetail();
    getPatientReports();
  }, [id]);
  return (
    <>
      <div className="p-2">
        <div className="d-flex justify-content-between">
          <h1>Patient Detail</h1>
          <div>
            <Button variant="primary" onClick={() => setShow(true)}>
              Add Report
            </Button>
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
                  <div className="d-flex">
                    <div>
                      {item?.description}
                      <Button
                        onClick={() => {
                          setEditId(item?.id);
                          setShow(true);
                          setInitialState({
                            report_type: item?.report_type,
                            description: item?.description,
                            active_status: item?.active_status,
                          });
                        }}
                      >
                        Edit{" "}
                      </Button>
                    </div>
                    <div>
                      <Badge bg={BADGE_COLOR[item?.active_status]}>
                        {" "}
                        {item?.active_status}
                      </Badge>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{!!editId ? "Edit" : "Add"} Report</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={initialState}
            enableReinitialize
            validationSchema={reportSchema}
            onSubmit={editId ? handleEditReport : handleAddReport}
          >
            {({ setFieldValue, values }) => {
              return (
                <Form>
                  <BForm>
                    <BForm.Group className="mb-3" controlId="name">
                      <BForm.Label className="text-color fw-bold">
                        Report Type
                      </BForm.Label>
                      <Field
                        name="report_type"
                        placeholder="Report Type"
                        component={MyInput}
                      />
                      <p className="error fw-bold">
                        <ErrorMessage name="report_type" />
                      </p>
                    </BForm.Group>

                    <BForm.Group className="mb-3" controlId="formGroupEmail">
                      <BForm.Label className="text-color fw-bold">
                        Description
                      </BForm.Label>
                      <Field
                        name="description"
                        placeholder="Description"
                        component={MyInput}
                      />
                      <p className="error fw-bold">
                        <ErrorMessage name="description" />
                      </p>
                    </BForm.Group>
                  </BForm>
                  <BForm.Group className="mb-3" controlId="gender">
                    <BForm.Label className="me-3 text-color fw-bold">
                      Status
                    </BForm.Label>
                    <BForm.Check
                      inline
                      label="Draft"
                      name="active_status"
                      type={"radio"}
                      onChange={(e) => {
                        setFieldValue("active_status", "draft");
                      }}
                      checked={values?.active_status == "draft"}
                    />
                    <BForm.Check
                      inline
                      label="Publish"
                      name="active_status"
                      type={"radio"}
                      onChange={(e) =>
                        setFieldValue("active_status", "publish")
                      }
                      checked={values?.active_status == "publish"}
                    />
                    <p className="error fw-bold">
                      <ErrorMessage name="gender" />
                    </p>
                  </BForm.Group>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit" className="ms-1">
                    Save Changes
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PatientDetail;
