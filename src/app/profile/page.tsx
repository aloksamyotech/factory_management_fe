"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CameraIcon } from "./_components/icons";
import { SocialAccounts } from "./_components/social-accounts";
import { jwtDecode } from "jwt-decode";
import { Box, Button, Divider, FormControl, FormHelperText, Grid, Input, Paper, Typography } from "@mui/material";
import * as yup from 'yup';
import { useFormik } from 'formik';
import { urls } from "@/common/url";
import { putApi } from "@/common/api";
interface decodeToken {
  id: string,
  name: string,
  email: string,
  department: string,
}
const getUser = (setUser: any) => {
  const token = localStorage.getItem("9x4kz5t7e2m1lqf");
  if (!token) return "N/A";
  const decode: decodeToken = jwtDecode(token);
  const { name, department } = decode;
  setUser({ name, department });
}
export default function Page() {
  const [user, setUser] = useState<any>();
  const [data, setData] = useState({
    name: "Danish Heilium",
    profilePhoto: "/images/user/user-03.png",
    coverPhoto: "/images/cover/cover-01.png",
  });

  useEffect(() => {
    getUser(setUser);
  }, [])
  const handleChange = (e: any) => {
    if (e.target.name === "profilePhoto") {
      const file = e.target?.files[0];

      setData({
        ...user,
        profilePhoto: file && URL.createObjectURL(file),
      });
    } else if (e.target.name === "coverPhoto") {
      const file = e.target?.files[0];

      setData({
        ...user,
        coverPhoto: file && URL.createObjectURL(file),
      });
    } else {
      setData({
        ...user,
        [e.target.name]: e.target.value,
      });
    }
  };
  const validationSchema = yup.object({
    file: yup
      .mixed()
      .required("Please Upload Your Logo File")
      .test(
        "fileFormat",
        "Invalid File Format",
        (value: any) => {
          if (!value) return false;
          return value.type.startsWith("image/");
        }
      )
  });

  const initialValues = {
    file: null,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: any) => {
      const formData = new FormData();
      for (const key in values) {
        formData?.append(key, values[key]);
      }
      const url = urls?.endpoints?.employee?.logo;
      const customHeaders = { 'Content-Type': 'multipart/form-data', };
      await putApi(url, values, customHeaders);
      formik?.resetForm();
      window.location.reload();
    }
  });
  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={data?.coverPhoto}
            alt="profile cover"
            className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }}
          />
          <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
            <label
              htmlFor="cover"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-[15px] py-[5px] text-body-sm font-medium text-white hover:bg-opacity-90"
            >
              <input
                type="file"
                name="coverPhoto"
                id="coverPhoto"
                className="sr-only"
                onChange={handleChange}
                accept="image/png, image/jpg, image/jpeg"
              />

              <CameraIcon />

              <span>Edit</span>
            </label>
          </div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
            <div className="relative drop-shadow-2">
              {data?.profilePhoto && (
                <>
                  <Image
                    src={data?.profilePhoto}
                    width={160}
                    height={160}
                    className="overflow-hidden rounded-full"
                    alt="profile"
                  />

                  <label
                    htmlFor="profilePhoto"
                    className="absolute bottom-0 right-0 flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                  >
                    <CameraIcon />

                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      className="sr-only"
                      onChange={handleChange}
                      accept="image/png, image/jpg, image/jpeg"
                    />
                  </label>
                </>
              )}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
              {user?.name}
            </h3>
            <p className="font-medium">{user?.department}</p>
            {/* <div className="mx-auto mb-5.5 mt-5 grid max-w-[370px] grid-cols-3 rounded-[5px] border border-stroke py-[9px] shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:shadow-card">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                <span className="font-medium text-dark dark:text-white">
                  259
                </span>
                <span className="text-body-sm">Posts</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-dark-3 xsm:flex-row">
                <span className="font-medium text-dark dark:text-white">
                  129K
                </span>
                <span className="text-body-sm">Followers</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="font-medium text-dark dark:text-white">
                  2K
                </span>
                <span className="text-body-sm-sm">Following</span>
              </div>
            </div> */}
            <Divider />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: '20px' }}>
              <Paper elevation={4} sx={{ p: '10px', width: '60%' }}>
                <Grid container direction='column' >
                  <Grid>
                    <Typography variant='h6' sx={{ my: '10px' }}>Update Company Logo</Typography>
                    <Divider />
                    <Typography sx={{ fontSize: '10px' }}>(800px * 200px)</Typography>
                  </Grid>
                  <Grid sx={{ my: '20px', mx: '10px' }}>
                    <form>
                      <FormControl>
                        <Input
                          id="file"
                          name="file"
                          type="file"
                          size="small"
                          inputProps={{ accept: "image/png, image/jpeg, image/jpg" }}
                          onChange={(event: any) => {
                            formik?.setFieldValue('file', event?.currentTarget?.files[0]);
                          }}
                          error={formik?.touched?.file && Boolean(formik?.errors?.file)}
                        />
                        <FormHelperText sx={{ color: '#c34c51' }}>{formik?.touched?.file && formik?.errors?.file as any}</FormHelperText>
                      </FormControl>
                    </form>
                  </Grid>
                  <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} spacing={2}>
                    <Grid>
                      <Button type="submit" variant="contained" onClick={()=>formik?.handleSubmit()} style={{ textTransform: 'capitalize' }} color="primary">
                        Upload Logo
                      </Button>
                    </Grid>
                    <Grid>
                      <Button type="submit" size='small' variant="outlined" onClick={() => { formik?.resetForm() }} style={{ textTransform: 'capitalize' }} color="primary">
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Box>

            <div className="mx-auto max-w-[720px] mt-5">
              <h4 className="font-medium text-dark dark:text-white">
                About Me
              </h4>
              <p className="mt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque posuere fermentum urna, eu condimentum mauris
                tempus ut. Donec fermentum blandit aliquet. Etiam dictum dapibus
                ultricies. Sed vel aliquet libero. Nunc a augue fermentum,
                pharetra ligula sed, aliquam lacus.
              </p>
            </div>

            {/* <SocialAccounts /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
