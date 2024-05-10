import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setLogout } from '../../store/slice/auth';
import { ApiGet, ApiPost } from '../../Utils/ApiData';
import toast from 'react-hot-toast';
import { Badge, Button, Modal, Table } from 'react-bootstrap';
import moment from 'moment';
import { Form as BForm } from 'react-bootstrap';
import * as yup from 'yup';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

const BADGE_COLOR: any = {
  'admin': "success",
  'sub-admin': "secondary"
}

type TApproveuser = {
  userRole: string
}

type TInitialState = {
    userName: string;
    email: string;
    password: string;
    userRole: string;
  };
  
  const initialValue: TInitialState = {
    userName: "",
    email: "",
    password: "",
    userRole: ""
  };

  const initialValueuser: TApproveuser = {
    userRole: ""
  }
  
  const adminSchema = yup.object({
    email: yup.string().required().email(),
    userName: yup.string().required(),
    password: yup.string().required(),
    userRole: yup.string().required(),
  });

  const approveUserSchema = yup.object({
    userRole: yup.string().required(),
  });

  const MyInput = ({ field, form, ...props }:any) => {
    return <BForm.Control {...field} {...props} />;
  };

const SubAdminList = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>([]);
    const [show, setShow] = useState<boolean>(false);
    const [approvePatientId, setApprovePatientId] = useState("");
    const dispatch = useDispatch();


    const handleAddPatient = (value: TInitialState) => {
      ApiPost('/admin/add', value).then((response: any) => {
        if(response?.data?.success) {
          get_all_patient();
          handleClose();
          toast.success(response?.data?.message)
      }else {
          toast.error(response?.data?.message)
      }
      }).catch((error: any) => {
        toast.error(error?.message);
      })
    }

    const handleApprove = (value:any) => {
      ApiGet(`/user/approve/${approvePatientId}/${value?.userRole}`).then((response : any) => {
        if(response?.data?.success) {
          get_all_patient();
          setApprovePatientId("");
          toast.success(response?.data?.message)
      }else {
          toast.error(response?.data?.message)
      }
      }).catch((error: any) => {
        toast.error(error?.message);
      })
    }

    const handleReject = (id: any) => {
      ApiGet(`/user/reject/${id}`).then((response : any) => {
        if(response?.data?.success) {
          get_all_patient();
          toast.success(response?.data?.message)
      }else {
          toast.error(response?.data?.message)
      }
      }).catch((error: any) => {
        toast.error(error?.message);
      })
    }

    const handleDelete = (id: any) => {
      ApiGet(`/user/delete/${id}`).then((response : any) => {
        if(response?.data?.success) {
          get_all_patient();
          toast.success(response?.data?.message)
      }else {
          toast.error(response?.data?.message)
      }
      }).catch((error: any) => {
        toast.error(error?.message);
      })
    }

    const handleClose = () => {
        setShow(false);
    }

    const get_all_patient = () => {
        ApiGet('/user/get/all').then((response: any) => {
            if(response?.data?.success) {
                setData(response?.data?.data);
            }else {
                toast.error(response?.data?.message)
            }
        }).catch((error:any) => {
            toast.error(error?.message);
        })
    }

    const handleRejectConfirmation = (id: any) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Reject this!"
      }).then((result: any) => {
        if (result.isConfirmed) {
          handleReject(id);
        }
      });
    }

    const handleDeleteConfirmation = (id: any) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete this!"
      }).then((result: any) => {
        if (result.isConfirmed) {
          handleDelete(id);
        }
      });
    }

    useEffect(() => {
        get_all_patient();
    }, [])

    return <>
        <div className='ms-auto mb-2 '>
            <Button className='ms-auto' onClick={() => setShow(true)}>Add User</Button>
        </div>
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                            <th>Name</th>
                            <th>email</th>
                            <th>Role</th>
                            <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((user: any) => {
                        return <tr>
                            <td>{user?.userName}</td>
                            <td>{user?.email}</td>
                            <td>  <Badge bg={BADGE_COLOR[user?.userRole]}>{user?.userRole}</Badge> </td>
                            <td>{user?.active_status != "pending" ? user?.active_status : <div><span onClick={() => setApprovePatientId(user?.id)}><CheckCircleOutlineIcon  /></span> <span onClick={() => handleRejectConfirmation(user?.id)}> <DeleteIcon /></span></div>} </td>
                            <td><div> <span onClick={() => handleDeleteConfirmation(user?.id)}> <DeleteIcon /></span></div></td>
                        </tr>
                    })}
                </tbody>
            </Table>
        </div>

        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
       
        <Modal.Body>
        <Formik
          initialValues={initialValue}
          validationSchema={adminSchema}
          onSubmit={handleAddPatient}
        >
         {({ setFieldValue }) => {
                    return (    
          <Form>
        <BForm >
        <BForm.Group className="mb-3" controlId="name">
        <BForm.Label className='text-color fw-bold' >Name</BForm.Label>
        <Field name = "userName" placeholder="User name" component = {MyInput} />
        <p className='error fw-bold'><ErrorMessage name='userName' /></p>
      </BForm.Group>
       
      <BForm.Group className="mb-3" controlId="formGroupEmail">
        <BForm.Label className='text-color fw-bold'>Email address</BForm.Label>
        <Field name = "email" placeholder="Email" component = {MyInput} />
        <p className='error fw-bold'><ErrorMessage name='email' /></p>
      </BForm.Group>
      <BForm.Group className="mb-3" controlId="mobile_number">
        <BForm.Label className='text-color fw-bold'>Password</BForm.Label>
        <Field name = "password" placeholder="Password" component = {MyInput} />
        <p className='error fw-bold'><ErrorMessage name='password' /></p>
      </BForm.Group>
      <BForm.Group className="mb-3" controlId="userRole">
        <BForm.Label className='me-3 text-color fw-bold'>Role</BForm.Label>
        <BForm.Check
            inline
            label="Admin"
            name="userRole"
            type={"radio"}
            onChange={(e) => {setFieldValue("userRole",'admin')}}
       
          />
          <BForm.Check
            inline
            label="Sub-admin"
            name="userRole"
            type={"radio"}
            onChange={(e) => setFieldValue("userRole",'sub-admin')}
          />
        <p className='error fw-bold'><ErrorMessage name='userRole' /></p>
      </BForm.Group>  
    </BForm>
    <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type='submit' className='ms-1'>
            Save Changes
          </Button>
          </Form>)}}
          
        </Formik>
        
    
        </Modal.Body>
       
       
      </Modal>

      <Modal show={!!approvePatientId} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Approve User</Modal.Title>
        </Modal.Header>
       
        <Modal.Body>
        <Formik
          initialValues={initialValueuser}
          validationSchema={approveUserSchema}
          onSubmit={handleApprove}
        >
         {({ setFieldValue }) => {
                    return (    
          <Form>
        <BForm >
  
      <BForm.Group className="mb-3" controlId="userRole">
        <BForm.Label className='me-3 text-color fw-bold'>Role</BForm.Label>
        <BForm.Check
            inline
            label="Admin"
            name="userRole"
            type={"radio"}
            onChange={(e) => {setFieldValue("userRole",'admin')}}
          />
          <BForm.Check
            inline
            label="Sub-admin"
            name="userRole"
            type={"radio"}
            onChange={(e) => setFieldValue("userRole",'sub-admin')}
          />
        <p className='error fw-bold'><ErrorMessage name='userRole' /></p>
      </BForm.Group>  
    </BForm>
    <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type='submit' className='ms-1'>
            Approve
          </Button>
          </Form>)}}
          
        </Formik>
        
    
        </Modal.Body>
       
       
      </Modal>
    </>
}

export default SubAdminList;