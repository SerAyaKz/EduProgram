import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [initialValues, setInitialValues] = useState(null);
  const dbUser = JSON.parse(localStorage.getItem("dbUser"));

  useEffect(() => {
    setInitialValues({
      displayName: dbUser.displayName || "",
      email: dbUser.email || "",
      photoUrl: dbUser.photoUrl || "",
      title: dbUser.title || "",
    });
  }, []);

  const handleFormSubmit = async (values) => {
    const response = await fetch('http://localhost:8081/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: dbUser.id,
        uid: dbUser.uid,
        displayName: values.displayName,
        email: values.email,
        photoUrl: values.photoURL,
        title: values.title,
        roleId: dbUser.roleId

      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register user in the backend');
    }
    const userData = await response.json();
    localStorage.setItem('dbUser', JSON.stringify(userData));
  };

  if (!initialValues) return null; // You can also show a spinner/loading here

  return (
    <Box m="20px">
      <Header title="UPDATE USER" subtitle="Update Existing User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={userSchema}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Display Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.displayName}
                name="displayName"
                error={!!touched.displayName && !!errors.displayName}
                helperText={touched.displayName && errors.displayName}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="url"
                label="Photo URL"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.photoUrl}
                name="photoUrl"
                error={!!touched.photoUrl && !!errors.photoUrl}
                helperText={touched.photoUrl && errors.photoUrl}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                name="title"
                error={!!touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: "span 4" }}
                />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Update User
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const userSchema = yup.object().shape({
  displayName: yup.string().required("Display Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  photoUrl: yup.string().url("Invalid URL"),
  title: yup.string().required("Title is required"),

});

export default Form;
