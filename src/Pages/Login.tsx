import { ApiPostNoAuth } from "../Utils/ApiData";
import toast from "react-hot-toast";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { setAuth, setUser } from "../store/slice/auth";
import { useDispatch } from "react-redux";

type TInitialState = {
  email: string;
  password: string;
};

const initialValue: TInitialState = {
  email: "",
  password: "",
};

const loginSchema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (value: TInitialState) => {
    ApiPostNoAuth("/login", value)
      .then((response: any) => {
        console.log(response?.data);
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          dispatch(setAuth({ token: response?.data?.data?.token }));
          dispatch(setUser({ user: response?.data?.data?.user }));
          navigate("/");
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
                  <h2>Sign In</h2>

                  <div className="form">
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
                      <Link to="/register">Signup</Link>
                    </div>

                    <div className="links">
                      {" "}
                      <Link to="/patient">Are you Patient?</Link>
                    </div>
                    <div className="inputBox">
                      <input type="submit" value="Login" />
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

export default Login;
