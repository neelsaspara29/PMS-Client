import { ApiPostNoAuth } from "../Utils/ApiData";
import toast from "react-hot-toast";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";

type TInitialState = {
  email: string;
  password: string;
  userName: string;
};

const initialValue: TInitialState = {
  email: "",
  password: "",
  userName: "",
};

const loginSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
  userName: yup.string().required(),
});

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = (value: TInitialState) => {
    const body = { ...value };
    ApiPostNoAuth("/register", body)
      .then((response: any) => {
        console.log(response?.data);
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          navigate("/login");
        } else {
          toast.error(response?.data?.message);
        }
      })
      .catch((error: any) => {
        console.log(error?.message);
      });
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center main_container">
        <Formik
          initialValues={initialValue}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <section>
              <div className="signin">
                <div className="content">
                  <h2>Sign Up</h2>

                  <div className="form">
                    <div className="inputBox">
                      <Field name="userName" /> <i>User Name</i>
                    </div>
                    <p className="error_message">
                      <ErrorMessage name="userName" />
                    </p>

                    <div className="inputBox">
                      <Field name="email" /> <i>Email</i>
                    </div>
                    <p className="error_message">
                      <ErrorMessage name="email" />
                    </p>

                    <div className="inputBox">
                      <Field name="password" type="password" /> <i>Password</i>
                    </div>
                    <p className="error_message">
                      <ErrorMessage name="password" />
                    </p>

                    <div className="links">
                      {" "}
                      <Link to="/login">Signin</Link>
                    </div>

                    <div className="inputBox">
                      <input type="submit" value="Register" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default Register;
