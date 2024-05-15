import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiGet, ApiPost } from "../Utils/ApiData";
import toast from "react-hot-toast";
import { Button, Modal, Table } from "react-bootstrap";
import moment from "moment";
import { Form as BForm } from "react-bootstrap";
import * as yup from "yup";
import { ErrorMessage, Field, Formik, Form } from "formik";
import InfoIcon from "@mui/icons-material/Info";

type TInitialState = {
  email: string;
  name: string;
  mobile_number: string;
  gender: string;
  dob: string;
};

const initialValue: TInitialState = {
  email: "",
  name: "",
  mobile_number: "",
  gender: "",
  dob: "",
};

const patientSchema = yup.object({
  email: yup.string().required().email(),
  name: yup.string().required(),
  mobile_number: yup.string().required(),
  gender: yup.string().required(),
  dob: yup.string().required(),
});

const MyInput = ({ field, form, ...props }: any) => {
  return <BForm.Control {...field} {...props} />;
};

const Home = () => {
  const [data, setData] = useState<any>([]);
  const [show, setShow] = useState<boolean>(false);

  const handleAddPatient = (value: TInitialState) => {
    const body = {
      ...value,
    };
    ApiPost("/patient/add", body)
      .then((response: any) => {
        if (response?.data?.success) {
          get_all_patient();
          handleClose();
          toast.success(response?.data?.message);
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
  };

  const get_all_patient = () => {
    ApiGet("/patient/get/all")
      .then((response: any) => {
        if (response?.data?.success) {
          setData(response?.data?.data);
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error) => {
        toast.error(error?.message);
      });
  };

  useEffect(() => {
    get_all_patient();
  }, []);

  return (
    <>
      <div className="p-5 border m-5 rounded ">
        <div className="ms-auto mb-2 ">
          <Button className="ms-auto" onClick={() => setShow(true)}>
            Add Patient
          </Button>
        </div>
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>dob</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data?.map((user: any) => {
                return (
                  <tr>
                    <td>{user?.id}</td>
                    <td>{user?.name}</td>
                    <td>{user?.email}</td>
                    <td>{moment(user?.dob).format("MM/DD/YYYY")}</td>
                    <td>
                      <Link to={`/patient/detail/${user?.id}`}>
                        <InfoIcon />
                      </Link>{" "}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Patient</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Formik
            initialValues={initialValue}
            validationSchema={patientSchema}
            onSubmit={handleAddPatient}
          >
            {({ setFieldValue }) => {
              return (
                <Form>
                  <BForm>
                    <BForm.Group className="mb-3" controlId="name">
                      <BForm.Label className="text-color fw-bold">
                        Patient Name
                      </BForm.Label>
                      <Field
                        name="name"
                        placeholder="Name"
                        component={MyInput}
                      />
                      <p className="error fw-bold">
                        <ErrorMessage name="name" />
                      </p>
                    </BForm.Group>

                    <BForm.Group className="mb-3" controlId="formGroupEmail">
                      <BForm.Label className="text-color fw-bold">
                        Email address
                      </BForm.Label>
                      <Field
                        name="email"
                        placeholder="Email"
                        component={MyInput}
                      />
                      <p className="error fw-bold">
                        <ErrorMessage name="email" />
                      </p>
                    </BForm.Group>
                    <BForm.Group className="mb-3" controlId="mobile_number">
                      <BForm.Label className="text-color fw-bold">
                        Mobile Number
                      </BForm.Label>
                      <Field
                        name="mobile_number"
                        placeholder="Mobile Number"
                        component={MyInput}
                      />
                      <p className="error fw-bold">
                        <ErrorMessage name="mobile_number" />
                      </p>
                    </BForm.Group>
                    <BForm.Group className="mb-3" controlId="gender">
                      <BForm.Label className="me-3 text-color fw-bold">
                        Gender
                      </BForm.Label>
                      <BForm.Check
                        inline
                        label="Male"
                        name="gender"
                        type={"radio"}
                        onChange={(e) => {
                          setFieldValue("gender", "male");
                        }}
                      />
                      <BForm.Check
                        inline
                        label="Female"
                        name="gender"
                        type={"radio"}
                        onChange={(e) => setFieldValue("gender", "female")}
                      />
                      <p className="error fw-bold">
                        <ErrorMessage name="gender" />
                      </p>
                    </BForm.Group>
                    <BForm.Group className="mb-3" controlId="dob">
                      <BForm.Label className="text-color fw-bold">
                        Date of Birth
                      </BForm.Label>
                      <Field type="date" name="dob" component={MyInput} />
                      <p className="error fw-bold">
                        <ErrorMessage name="dob" />
                      </p>
                    </BForm.Group>
                  </BForm>
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

export default Home;
